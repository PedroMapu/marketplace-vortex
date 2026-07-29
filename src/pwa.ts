export async function invalidarCacheCatalogoPublico(): Promise<void> {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  try {
    // A remoção no contexto da página elimina a corrida entre o postMessage e
    // o recarregamento imediato; a mensagem mantém os demais clientes/SW em
    // conformidade com o contrato de invalidação.
    await window.caches?.delete("marketplace-vortex-catalog-v1");

    const serviceWorker =
      navigator.serviceWorker.controller ??
      (await navigator.serviceWorker.ready).active;

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
      const temporizador = window.setTimeout(concluir, 750);

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
