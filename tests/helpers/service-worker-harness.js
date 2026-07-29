"use strict";

const vm = require("node:vm");
const { readProjectFile, transpileScript } = require("./typescript-runtime");

const DEFAULT_MANIFEST = Object.freeze([
  { url: "/index.html", revision: "index" },
  { url: "/assets/app.js", revision: "app" },
  { url: "/assets/styles.css", revision: "styles" },
  { url: "/manifest.json", revision: "manifest" },
]);

function responseWithType(body, init = {}, type = "basic") {
  const response = new Response(body, init);
  Object.defineProperty(response, "type", {
    configurable: true,
    value: type,
  });
  return response;
}

function requestKey(request) {
  return typeof request === "string" ? request : request.url;
}

function prepareServiceWorkerSource(apiUrl) {
  const source = readProjectFile("src/service-worker.ts")
    .replace(
      /\(import\.meta\.env\.VITE_API_URL \?\? ""\)\.trim\(\)/,
      JSON.stringify(apiUrl.trim()),
    )
    .replace(/\nexport \{\};\s*$/, "\n");

  return transpileScript(source, "src/service-worker.ts");
}

function createServiceWorkerHarness(options = {}) {
  const {
    apiUrl = "",
    manifest = DEFAULT_MANIFEST,
    origin = "https://app.vortex.test",
  } = options;
  const listeners = new Map();
  const stores = new Map();
  const deletedCaches = [];
  let claimCalls = 0;
  let skipWaitingCalls = 0;
  let fetchImplementation = async () =>
    responseWithType("network", { status: 200 });

  function getStore(cacheName) {
    if (!stores.has(cacheName)) {
      stores.set(cacheName, new Map());
    }

    return stores.get(cacheName);
  }

  const caches = {
    async open(cacheName) {
      const store = getStore(cacheName);

      return {
        async addAll(paths) {
          for (const item of paths) {
            store.set(
              requestKey(item),
              responseWithType(`precache:${requestKey(item)}`),
            );
          }
        },
        async match(request) {
          return store.get(requestKey(request))?.clone();
        },
        async put(request, response) {
          store.set(requestKey(request), response.clone());
        },
      };
    },
    async keys() {
      return [...stores.keys()];
    },
    async delete(cacheName) {
      deletedCaches.push(cacheName);
      return stores.delete(cacheName);
    },
    async match(request) {
      const key = requestKey(request);

      for (const store of stores.values()) {
        if (store.has(key)) {
          return store.get(key).clone();
        }
      }

      return undefined;
    },
  };

  const self = {
    __WB_MANIFEST: manifest,
    location: { origin },
    clients: {
      async claim() {
        claimCalls += 1;
      },
    },
    async skipWaiting() {
      skipWaitingCalls += 1;
    },
    addEventListener(type, listener) {
      listeners.set(type, listener);
    },
  };

  const context = vm.createContext({
    Headers,
    Math,
    Request,
    Response,
    URL,
    caches,
    fetch: (...args) => fetchImplementation(...args),
    self,
  });

  vm.runInContext(prepareServiceWorkerSource(apiUrl), context, {
    filename: "src/service-worker.ts",
  });

  async function settleEvent(listener, event) {
    const pending = [];
    listener({
      ...event,
      waitUntil(promise) {
        pending.push(Promise.resolve(promise));
      },
    });
    await Promise.all(pending);
  }

  async function dispatchExtendable(type) {
    const listener = listeners.get(type);
    if (!listener) {
      throw new Error(`Listener ${type} não registrado.`);
    }

    await settleEvent(listener, {});
  }

  async function dispatchFetch(request) {
    const listener = listeners.get("fetch");
    if (!listener) {
      throw new Error("Listener fetch não registrado.");
    }

    const pending = [];
    let responsePromise;
    listener({
      request,
      respondWith(promise) {
        responsePromise = Promise.resolve(promise);
      },
      waitUntil(promise) {
        pending.push(Promise.resolve(promise));
      },
    });

    const response = responsePromise ? await responsePromise : undefined;
    await Promise.all(pending);
    return response;
  }

  async function dispatchMessage(data, ports = []) {
    const listener = listeners.get("message");
    if (!listener) {
      throw new Error("Listener message não registrado.");
    }

    await settleEvent(listener, { data, ports });
  }

  function cacheNames() {
    return [...stores.keys()];
  }

  function cacheKeys(cacheName) {
    return [...getStore(cacheName).keys()];
  }

  return {
    cacheKeys,
    cacheNames,
    caches,
    deletedCaches,
    dispatchExtendable,
    dispatchFetch,
    dispatchMessage,
    get claimCalls() {
      return claimCalls;
    },
    get skipWaitingCalls() {
      return skipWaitingCalls;
    },
    listeners,
    origin,
    responseWithType,
    setFetch(implementation) {
      fetchImplementation = implementation;
    },
  };
}

module.exports = {
  DEFAULT_MANIFEST,
  createServiceWorkerHarness,
  responseWithType,
};
