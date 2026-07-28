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
const PRECACHE_ENTRIES = self.__WB_MANIFEST;

function hashManifest(entries: ReadonlyArray<PrecacheEntry>): string {
  const serializedEntries = JSON.stringify(entries);
  let hash = 2_166_136_261;

  for (let index = 0; index < serializedEntries.length; index += 1) {
    hash ^= serializedEntries.charCodeAt(index);
    hash = Math.imul(hash, 16_777_619);
  }

  return (hash >>> 0).toString(36);
}

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

async function staleWhileRevalidate(
  request: Request,
  event: FetchEvent,
): Promise<Response> {
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

  event.waitUntil(caches.delete(CATALOG_CACHE));
});

self.addEventListener("fetch", (event: FetchEvent) => {
  const { request } = event;

  if (request.method !== "GET" || request.headers.has("range")) {
    return;
  }

  const url = new URL(request.url);

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
