"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const {
  DEFAULT_MANIFEST,
  createServiceWorkerHarness,
  responseWithType,
} = require("./helpers/service-worker-harness");

const CATALOG_CACHE = "marketplace-vortex-catalog-v1";

function publicCatalogRequest(origin, query = "") {
  return new Request(`${origin}/api/anuncios${query}`);
}

function findStaticCache(harness) {
  return harness
    .cacheNames()
    .find((cacheName) => cacheName.startsWith("marketplace-vortex-static-"));
}

test("instala o app shell e remove apenas versões estáticas antigas", async () => {
  const harness = createServiceWorkerHarness();

  assert.deepEqual(
    [...harness.listeners.keys()].sort(),
    ["activate", "fetch", "install", "message"],
  );

  await harness.dispatchExtendable("install");
  const currentStaticCache = findStaticCache(harness);
  assert.ok(currentStaticCache);
  assert.deepEqual(
    harness.cacheKeys(currentStaticCache),
    DEFAULT_MANIFEST.map(({ url }) => url),
  );
  assert.equal(harness.skipWaitingCalls, 1);

  await harness.caches.open("marketplace-vortex-static-antigo");
  await harness.caches.open(CATALOG_CACHE);
  await harness.caches.open("cache-de-outra-aplicacao");
  await harness.dispatchExtendable("activate");

  assert.equal(
    harness.cacheNames().includes("marketplace-vortex-static-antigo"),
    false,
  );
  assert.equal(harness.cacheNames().includes(CATALOG_CACHE), true);
  assert.equal(harness.cacheNames().includes("cache-de-outra-aplicacao"), true);
  assert.equal(harness.claimCalls, 1);
});

test("usa network-first e preserva cada query do catálogo como chave própria", async () => {
  const harness = createServiceWorkerHarness();
  const livros = publicCatalogRequest(
    harness.origin,
    "?categoria=livros&busca=algoritmos",
  );
  const moveis = publicCatalogRequest(harness.origin, "?categoria=moveis");
  let networkCalls = 0;

  harness.setFetch(async (request) => {
    networkCalls += 1;
    return responseWithType(
      JSON.stringify({ origem: "rede", url: request.url }),
      { headers: { "Content-Type": "application/json" } },
      "cors",
    );
  });

  const onlineResponse = await harness.dispatchFetch(livros);
  assert.equal(onlineResponse.status, 200);
  assert.equal((await onlineResponse.json()).origem, "rede");
  assert.deepEqual(harness.cacheKeys(CATALOG_CACHE), [livros.url]);

  harness.setFetch(async () => {
    networkCalls += 1;
    throw new Error("offline");
  });

  const cachedResponse = await harness.dispatchFetch(livros);
  assert.equal(cachedResponse.status, 200);
  assert.equal(cachedResponse.headers.get("X-Vortex-Offline"), "1");
  assert.equal((await cachedResponse.json()).url, livros.url);

  const missingResponse = await harness.dispatchFetch(moveis);
  assert.equal(missingResponse.status, 503);
  assert.equal(missingResponse.headers.get("X-Vortex-Offline"), "1");
  assert.equal(missingResponse.headers.get("Cache-Control"), "no-store");
  assert.equal(
    (await missingResponse.json()).codigo,
    "OFFLINE_SEM_CACHE",
  );
  assert.equal(networkCalls, 3);
});

test("não armazena resposta inválida, não JSON ou com erro HTTP", async () => {
  const harness = createServiceWorkerHarness();
  const request = publicCatalogRequest(harness.origin);

  for (const response of [
    responseWithType("não é JSON", { status: 200 }, "cors"),
    responseWithType(
      JSON.stringify({ erro: "interno" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
      "cors",
    ),
    responseWithType(
      JSON.stringify({ ok: true }),
      { headers: { "Content-Type": "application/json" } },
      "opaque",
    ),
  ]) {
    harness.setFetch(async () => response);
    await harness.dispatchFetch(request);
    assert.deepEqual(harness.cacheKeys(CATALOG_CACHE), []);
  }
});

test("não intercepta autenticação, rota privada, mutações nem requests parciais", async () => {
  const harness = createServiceWorkerHarness();
  let networkCalls = 0;
  harness.setFetch(async () => {
    networkCalls += 1;
    return responseWithType("{}");
  });

  const requests = [
    new Request(`${harness.origin}/api/anuncios`, {
      headers: { Authorization: "Bearer token-de-teste" },
    }),
    new Request(`${harness.origin}/api/anuncios/me`),
    new Request(`${harness.origin}/api/anuncios`, {
      method: "POST",
      body: "{}",
      headers: { "Content-Type": "application/json" },
    }),
    new Request(`${harness.origin}/api/anuncios/123`, {
      method: "DELETE",
    }),
    new Request(`${harness.origin}/api/anuncios`, {
      headers: { Range: "bytes=0-99" },
    }),
  ];

  for (const request of requests) {
    assert.equal(await harness.dispatchFetch(request), undefined);
  }

  assert.equal(networkCalls, 0);
  assert.deepEqual(harness.cacheKeys(CATALOG_CACHE), []);
});

test("respeita a origem configurada para a API publicada", async () => {
  const apiOrigin = "https://api.vortex.test";
  const harness = createServiceWorkerHarness({ apiUrl: `${apiOrigin}/v1` });
  harness.setFetch(async () =>
    responseWithType(
      "[]",
      { headers: { "Content-Type": "application/json" } },
      "cors",
    ),
  );

  assert.equal(
    await harness.dispatchFetch(
      new Request(`${harness.origin}/api/anuncios`),
    ),
    undefined,
  );
  assert.equal(
    (
      await harness.dispatchFetch(
        new Request(`${apiOrigin}/api/anuncios`),
      )
    ).status,
    200,
  );
});

test("usa a API publicada como fallback sem variável no build de produção", async () => {
  const apiOrigin = "https://marketplace-vortex-api.onrender.com";
  const harness = createServiceWorkerHarness({ production: true });
  harness.setFetch(async () =>
    responseWithType(
      "[]",
      { headers: { "Content-Type": "application/json" } },
      "cors",
    ),
  );

  assert.equal(
    (
      await harness.dispatchFetch(
        new Request(`${apiOrigin}/api/anuncios`),
      )
    ).status,
    200,
  );
});

test("invalida todas as queries do catálogo e confirma pelo MessageChannel", async () => {
  const harness = createServiceWorkerHarness();
  const cache = await harness.caches.open(CATALOG_CACHE);
  await cache.put(
    publicCatalogRequest(harness.origin, "?categoria=livros"),
    responseWithType("[]"),
  );
  await cache.put(
    publicCatalogRequest(harness.origin, "?categoria=moveis"),
    responseWithType("[]"),
  );
  const acknowledgements = [];

  await harness.dispatchMessage(
    { type: "INVALIDATE_CATALOG_CACHE" },
    [
      {
        postMessage(message) {
          acknowledgements.push(message);
        },
      },
    ],
  );

  assert.equal(harness.cacheNames().includes(CATALOG_CACHE), false);
  assert.deepEqual(
    JSON.parse(JSON.stringify(acknowledgements)),
    [{ type: "CATALOG_CACHE_INVALIDATED" }],
  );
});

test("ignora mensagens desconhecidas e aceita SKIP_WAITING", async () => {
  const harness = createServiceWorkerHarness();

  await harness.dispatchMessage({ type: "DESCONHECIDA" });
  assert.equal(harness.skipWaitingCalls, 0);

  await harness.dispatchMessage({ type: "SKIP_WAITING" });
  assert.equal(harness.skipWaitingCalls, 1);
});
