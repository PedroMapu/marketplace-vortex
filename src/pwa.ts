const TEMPO_MAXIMO_ESPERA_SERVICE_WORKER_MS = 750;

async function obterServiceWorkerAtivo(): Promise<ServiceWorker | null> {
  const controller = navigator.serviceWorker.controller;

  if (controller) {
    return controller;
  }

  return new Promise<ServiceWorker | null>((resolve) => {
    const temporizador = window.setTimeout(
      () => resolve(null),
      TEMPO_MAXIMO_ESPERA_SERVICE_WORKER_MS,
    );

    void navigator.serviceWorker.ready
      .then((registration) => {
        window.clearTimeout(temporizador);
        resolve(registration.active);
      })
      .catch(() => {
        window.clearTimeout(temporizador);
        resolve(null);
      });
  });
}

export async function invalidarCacheCatalogoPublico(): Promise<void> {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  try {
    // A remoção no contexto da página elimina a corrida entre o postMessage e
    // o recarregamento imediato; a mensagem mantém os demais clientes/SW em
    // conformidade com o contrato de invalidação.
    await window.caches?.delete("marketplace-vortex-catalog-v1");

    const serviceWorker = await obterServiceWorkerAtivo();

    if (!serviceWorker) {
      return;
    }

    const canal = new MessageChannel();

    await new Promise<void>((resolve) => {
      const concluir = (): void => {
        window.clearTimeout(temporizador);
        canal.port1.close();
        resolve();
      };
      const temporizador = window.setTimeout(
        concluir,
        TEMPO_MAXIMO_ESPERA_SERVICE_WORKER_MS,
      );

      canal.port1.addEventListener("message", concluir, { once: true });
      canal.port1.start();
      serviceWorker.postMessage(
        { type: "INVALIDATE_CATALOG_CACHE" },
        [canal.port2],
      );
    });
  } catch (error: unknown) {
    console.warn(
      "Não foi possível invalidar o cache público do catálogo:",
      error,
    );
  }
}

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
