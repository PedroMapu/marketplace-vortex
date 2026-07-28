"use strict";

if ("serviceWorker" in navigator) {
  window.addEventListener(
    "load",
    () => {
      navigator.serviceWorker
        .register("/service-worker.js", { scope: "/" })
        .catch((erro) => {
          console.error("Falha ao registrar o Service Worker:", erro);
        });
    },
    { once: true },
  );
}
