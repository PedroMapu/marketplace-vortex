"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const vm = require("node:vm");
const {
  readProjectFile,
  transpileScript,
} = require("./helpers/typescript-runtime");

function createPwaHarness(options = {}) {
  const {
    acknowledgement = true,
    controller = true,
    ready = true,
    serviceWorkerSupport = true,
  } = options;
  const events = [];
  const exports = {};
  const loadListeners = [];
  const registrations = [];
  let portClosed = false;
  let portStarted = false;
  let messageListener;

  class FakeMessageChannel {
    constructor() {
      this.port1 = {
        addEventListener(type, listener) {
          assert.equal(type, "message");
          messageListener = listener;
        },
        close() {
          portClosed = true;
        },
        start() {
          portStarted = true;
        },
      };
      this.port2 = {
        acknowledge() {
          messageListener?.({
            data: { type: "CATALOG_CACHE_INVALIDATED" },
          });
        },
      };
    }
  }

  const activeWorker = {
    postMessage(message, ports) {
      events.push(["postMessage", message]);
      if (acknowledgement) {
        ports[0]?.acknowledge();
      }
    },
  };
  const serviceWorker = {
    async register(url, settings) {
      registrations.push({ settings, url });
      return { scope: "/" };
    },
    ready: ready
      ? Promise.resolve({ active: activeWorker })
      : new Promise(() => {}),
  };
  if (controller) {
    serviceWorker.controller = activeWorker;
  }

  const navigator = serviceWorkerSupport ? { serviceWorker } : {};
  const window = {
    addEventListener(type, listener, settings) {
      loadListeners.push({ listener, settings, type });
    },
    caches: {
      async delete(cacheName) {
        events.push(["delete", cacheName]);
        return true;
      },
    },
    clearTimeout,
    setTimeout,
  };
  const context = vm.createContext({
    MessageChannel: FakeMessageChannel,
    console,
    exports,
    module: { exports },
    navigator,
    window,
  });
  const source = transpileScript(
    readProjectFile("src/pwa.ts")
      .replace("export async function", "async function")
      .replace("export function", "function")
      .concat(
        "\nexports.invalidarCacheCatalogoPublico = invalidarCacheCatalogoPublico;",
        "\nexports.registerPwa = registerPwa;\n",
      ),
    "src/pwa.ts",
  );
  vm.runInContext(source, context, { filename: "src/pwa.ts" });

  return {
    events,
    exports,
    loadListeners,
    get portClosed() {
      return portClosed;
    },
    get portStarted() {
      return portStarted;
    },
    registrations,
  };
}

test("registra o Service Worker no load com escopo raiz", async () => {
  const harness = createPwaHarness();

  assert.equal(harness.loadListeners.length, 1);
  const [{ listener, settings, type }] = harness.loadListeners;
  assert.equal(type, "load");
  assert.equal(settings.once, true);

  listener();
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(
    JSON.parse(JSON.stringify(harness.registrations)),
    [{ url: "/service-worker.js", settings: { scope: "/" } }],
  );
});

test("invalida primeiro no cliente e aguarda confirmação do Service Worker", async () => {
  const harness = createPwaHarness();

  await harness.exports.invalidarCacheCatalogoPublico();

  assert.deepEqual(
    JSON.parse(JSON.stringify(harness.events)),
    [
      ["delete", "marketplace-vortex-catalog-v1"],
      ["postMessage", { type: "INVALIDATE_CATALOG_CACHE" }],
    ],
  );
  assert.equal(harness.portStarted, true);
  assert.equal(harness.portClosed, true);
});

test("permanece compatível quando Service Worker não está disponível", async () => {
  const harness = createPwaHarness({ serviceWorkerSupport: false });

  assert.deepEqual(harness.loadListeners, []);
  await harness.exports.invalidarCacheCatalogoPublico();
  assert.deepEqual(harness.events, []);
});

test("não bloqueia a interface quando o Service Worker nunca fica ativo", async () => {
  const harness = createPwaHarness({ controller: false, ready: false });
  const inicio = Date.now();

  await harness.exports.invalidarCacheCatalogoPublico();

  assert.ok(Date.now() - inicio < 1_500);
  assert.deepEqual(
    JSON.parse(JSON.stringify(harness.events)),
    [["delete", "marketplace-vortex-catalog-v1"]],
  );
});
