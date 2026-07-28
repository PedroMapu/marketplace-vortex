export function registerPwa(): void {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener(
    "load",
    () => {
      void navigator.serviceWorker
        .register("/service-worker.js", { scope: "/" })
        .catch((error: unknown) => {
          console.error("Falha ao registrar o Service Worker:", error);
        });
    },
    { once: true },
  );
}

registerPwa();
