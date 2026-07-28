"use strict";

const CACHE_PREFIX = "marketplace-vortex";
const CACHE_VERSION = "v1";
const STATIC_CACHE = `${CACHE_PREFIX}-static-${CACHE_VERSION}`;

const APP_SHELL = [
  "/",
  "/index.html",
  "/styles.css",
  "/app.js",
  "/animations.js",
  "/pwa.js",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter(
              (cacheName) =>
                cacheName.startsWith(`${CACHE_PREFIX}-`) &&
                cacheName !== STATIC_CACHE,
            )
            .map((cacheName) => caches.delete(cacheName)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function isCacheableResponse(response) {
  return response.ok && response.type === "basic";
}

function isApiRequest(url) {
  return url.pathname === "/api" || url.pathname.startsWith("/api/");
}

function isStaticAsset(request, url) {
  if (url.origin !== self.location.origin) {
    return false;
  }

  if (
    ["style", "script", "image", "font"].includes(request.destination)
  ) {
    return true;
  }

  return (
    url.pathname === "/manifest.json" ||
    url.pathname.endsWith(".webmanifest")
  );
}

async function networkFirstNavigation(request) {
  try {
    const response = await fetch(request);

    if (isCacheableResponse(response)) {
      const cache = await caches.open(STATIC_CACHE);
      await cache.put(request, response.clone());
    }

    return response;
  } catch {
    return (
      (await caches.match(request)) ||
      (await caches.match("/index.html")) ||
      (await caches.match("/")) ||
      new Response("O Marketplace Vortex está indisponível no momento.", {
        status: 503,
        statusText: "Service Unavailable",
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      })
    );
  }
}

function staleWhileRevalidate(request, event) {
  const cachePromise = caches.open(STATIC_CACHE);
  const cachedResponse = cachePromise.then((cache) => cache.match(request));
  const networkResponse = fetch(request)
    .then(async (response) => {
      if (isCacheableResponse(response)) {
        const cache = await cachePromise;
        await cache.put(request, response.clone());
      }

      return response;
    })
    .catch(() => undefined);

  event.waitUntil(networkResponse.then(() => undefined));

  return cachedResponse.then(async (response) => {
    return response || (await networkResponse) || Response.error();
  });
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (
    request.method !== "GET" ||
    request.headers.has("range")
  ) {
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
