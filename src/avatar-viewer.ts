type DialogoAvatar = HTMLDialogElement & {
  elementoAcionador?: HTMLElement | null;
};

const SELETOR_BOTAO_AVATAR = ".botao-avatar-anunciante";

function sincronizarEstadoDeModal(): void {
  document.body.classList.toggle(
    "modal-aberto",
    Boolean(document.querySelector("dialog[open]")),
  );
}

export function inicializarVisualizadorDeAvatar(): void {
  const dialogo =
    document.querySelector<DialogoAvatar>("#dialogo-avatar-anunciante");
  const imagem =
    document.querySelector<HTMLImageElement>("#avatar-anunciante-ampliado");
  const nome = document.querySelector<HTMLElement>("#nome-avatar-anunciante");
  const botaoSair =
    document.querySelector<HTMLButtonElement>("#sair-avatar-anunciante");

  if (!dialogo || !imagem || !nome || !botaoSair) {
    return;
  }

  document.addEventListener("click", (evento) => {
    const botao =
      evento.target instanceof Element
        ? evento.target.closest<HTMLElement>(SELETOR_BOTAO_AVATAR)
        : null;

    if (!botao || dialogo.open) {
      return;
    }

    const avatarUrl = botao.dataset.avatarUrl?.trim();
    const nomeAnunciante =
      botao.dataset.avatarName?.trim() || "Anunciante";

    if (!avatarUrl) {
      return;
    }

    dialogo.elementoAcionador = botao;
    imagem.src = avatarUrl;
    imagem.alt = `Foto ampliada de ${nomeAnunciante}`;
    nome.textContent = nomeAnunciante;
    document.body.classList.add("modal-aberto");
    dialogo.showModal();
  });

  botaoSair.addEventListener("click", () => dialogo.close());

  dialogo.addEventListener("click", (evento) => {
    if (evento.target === dialogo) {
      dialogo.close();
    }
  });

  dialogo.addEventListener("close", () => {
    const elementoAcionador = dialogo.elementoAcionador;

    imagem.removeAttribute("src");
    imagem.alt = "";
    nome.textContent = "";
    dialogo.elementoAcionador = null;
    sincronizarEstadoDeModal();

    if (elementoAcionador?.isConnected) {
      elementoAcionador.focus();
    }
  });
}

inicializarVisualizadorDeAvatar();
