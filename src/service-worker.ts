/// <reference lib="webworker" />

interface PrecacheEntry {
  readonly url: string;
  readonly revision?: string | null;
}

interface VortexServiceWorkerScope extends ServiceWorkerGlobalScope {
  readonly __WB_MANIFEST: ReadonlyArray<PrecacheEntry>;
}

interface ServiceWorkerMessage {
  readonly type: "INVALIDATE_CATALOG_CACHE" | "SKIP_WAITING";
}

declare const self: VortexServiceWorkerScope;

const CACHE_PREFIX = "marketplace-vortex";
const CATALOG_CACHE = `${CACHE_PREFIX}-catalog-v1`;
const OFFLINE_RESPONSE_HEADER = "X-Vortex-Offline";
const OFFLINE_RESPONSE_VALUE = "1";
const PRECACHE_ENTRIES = self.__WB_MANIFEST;
const CONFIGURED_API_URL = (import.meta.env.VITE_API_URL ?? "").trim();

function resolveApiOrigin(value: string): string | null {
  if (value === "") {
    return self.location.origin;
  }

  try {
    return new URL(value, self.location.origin).origin;
  } catch {
    return null;
  }
}

const CATALOG_API_ORIGIN = resolveApiOrigin(CONFIGURED_API_URL);

function hashManifest(entries: ReadonlyArray<PrecacheEntry>): string {
  const serializedEntries = JSON.stringify(entries);
  let hash = 2_166_136_261;

  for (let index = 0; index < serializedEntries.length; index += 1) {
    hash ^= serializedEntries.charCodeAt(index);
    hash = Math.imul(hash, 16_777_619);
  }

  return (hash >>> 0).toString(36);
}

// O hash cria uma versão de cache por manifesto; a ativação pode remover com
// segurança apenas as versões estáticas antigas deste aplicativo.
const STATIC_CACHE = `${CACHE_PREFIX}-static-${hashManifest(PRECACHE_ENTRIES)}`;
const APP_SHELL = PRECACHE_ENTRIES.map(({ url }) => url);

function isServiceWorkerMessage(value: unknown): value is ServiceWorkerMessage {
  if (typeof value !== "object" || value === null || !("type" in value)) {
    return false;
  }

  const { type } = value;
  return type === "INVALIDATE_CATALOG_CACHE" || type === "SKIP_WAITING";
}

function isCacheableResponse(response: Response): boolean {
  return (
    response.ok && (response.type === "basic" || response.type === "cors")
  );
}

async function isCacheableCatalogResponse(
  response: Response,
): Promise<boolean> {
  if (!isCacheableResponse(response)) {
    return false;
  }

  try {
    await response.clone().json();
    return true;
  } catch {
    return false;
  }
}

function isPublicCatalogRequest(request: Request, url: URL): boolean {
  return (
    CATALOG_API_ORIGIN !== null &&
    request.method === "GET" &&
    !request.headers.has("Authorization") &&
    url.origin === CATALOG_API_ORIGIN &&
    url.pathname === "/api/anuncios"
  );
}

function isApiRequest(url: URL): boolean {
  return url.pathname === "/api" || url.pathname.startsWith("/api/");
}

function isStaticAsset(request: Request, url: URL): boolean {
  if (url.origin !== self.location.origin) {
    return false;
  }

  if (["style", "script", "image", "font"].includes(request.destination)) {
    return true;
  }

  return (
    url.pathname === "/manifest.json" ||
    url.pathname.endsWith(".webmanifest")
  );
}

async function networkFirstNavigation(request: Request): Promise<Response> {
  try {
    const response = await fetch(request);

    if (isCacheableResponse(response)) {
      const cache = await caches.open(STATIC_CACHE);
      await cache.put(request, response.clone());
    }

    return response;
  } catch {
    return (
      (await caches.match(request)) ??
      (await caches.match("/index.html")) ??
      (await caches.match("/")) ??
      new Response("O Marketplace Vortex está indisponível no momento.", {
        status: 503,
        statusText: "Service Unavailable",
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      })
    );
  }
}

function markResponseAsOffline(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set(OFFLINE_RESPONSE_HEADER, OFFLINE_RESPONSE_VALUE);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function createCatalogOfflineMissResponse(): Response {
  return new Response(
    JSON.stringify({
      erro: "O catálogo não está disponível offline neste dispositivo.",
      codigo: "OFFLINE_SEM_CACHE",
    }),
    {
      status: 503,
      statusText: "Service Unavailable",
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "application/json",
        [OFFLINE_RESPONSE_HEADER]: OFFLINE_RESPONSE_VALUE,
      },
    },
  );
}

async function networkFirstCatalog(request: Request): Promise<Response> {
  // O catálogo prioriza dados atuais, mas conserva a última resposta válida
  // para leitura offline. Respostas de erro nunca substituem esse snapshot.
  const cache = await caches.open(CATALOG_CACHE);

  try {
    const response = await fetch(request);

    if (await isCacheableCatalogResponse(response)) {
      await cache.put(request, response.clone());
    }

    return response;
  } catch {
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return markResponseAsOffline(cachedResponse);
    }

    return createCatalogOfflineMissResponse();
  }
}

async function staleWhileRevalidate(
  request: Request,
  event: FetchEvent,
): Promise<Response> {
  // Assets estáticos podem responder imediatamente do cache enquanto a cópia
  // é atualizada em segundo plano, sem atrasar a renderização da página.
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);
  const networkResponse = fetch(request)
    .then(async (response) => {
      if (isCacheableResponse(response)) {
        await cache.put(request, response.clone());
      }

      return response;
    })
    .catch(() => undefined);

  event.waitUntil(networkResponse.then(() => undefined));

  return cachedResponse ?? (await networkResponse) ?? Response.error();
}

self.addEventListener("install", (event: ExtendableEvent) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event: ExtendableEvent) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter(
              (cacheName) =>
                cacheName.startsWith(`${CACHE_PREFIX}-static-`) &&
                cacheName !== STATIC_CACHE,
            )
            .map((cacheName) => caches.delete(cacheName)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event: ExtendableMessageEvent) => {
  if (!isServiceWorkerMessage(event.data)) {
    return;
  }

  if (event.data.type === "SKIP_WAITING") {
    event.waitUntil(self.skipWaiting());
    return;
  }

  event.waitUntil(
    caches.delete(CATALOG_CACHE).then(() => {
      event.ports[0]?.postMessage({
        type: "CATALOG_CACHE_INVALIDATED",
      });
    }),
  );
});

self.addEventListener("fetch", (event: FetchEvent) => {
  const { request } = event;

  if (
    request.method !== "GET" ||
    request.headers.has("range") ||
    request.headers.has("Authorization")
  ) {
    return;
  }

  const url = new URL(request.url);

  if (isPublicCatalogRequest(request, url)) {
    event.respondWith(networkFirstCatalog(request));
    return;
  }

  if (url.origin === self.location.origin && isApiRequest(url)) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  if (isStaticAsset(request, url)) {
    event.respondWith(staleWhileRevalidate(request, event));
  }
});

export {};
