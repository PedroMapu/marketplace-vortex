const botaoIdioma = document.querySelector<HTMLButtonElement>(
  "#footer-lang-button",
);
const menuIdiomas = document.querySelector<HTMLElement>("#footer-lang-menu");
const rotuloIdioma = botaoIdioma?.querySelector<HTMLElement>(
  ".footer-lang-label",
);
const bandeiraIdioma = botaoIdioma?.querySelector<HTMLImageElement>(
  ".footer-lang-flag",
);
const opcoesIdioma = Array.from(
  menuIdiomas?.querySelectorAll<HTMLButtonElement>("[data-language]") ?? [],
);

const CHAVE_IDIOMA = "marketplace-vortex-language";

function definirMenuIdiomasAberto(aberto: boolean): void {
  if (!botaoIdioma || !menuIdiomas) {
    return;
  }

  botaoIdioma.setAttribute("aria-expanded", String(aberto));
  menuIdiomas.hidden = !aberto;
}

function salvarIdioma(codigo: string): void {
  try {
    window.localStorage.setItem(CHAVE_IDIOMA, codigo);
  } catch {
    // A seleção continua funcionando quando o armazenamento estiver bloqueado.
  }
}

function carregarIdiomaSalvo(): string | null {
  try {
    return window.localStorage.getItem(CHAVE_IDIOMA);
  } catch {
    return null;
  }
}

function selecionarIdioma(
  opcao: HTMLButtonElement,
  persistir = true,
): void {
  const codigo = opcao.dataset.language;
  const bandeira = opcao.dataset.flagSrc;
  const nome = opcao.querySelector("span")?.textContent?.trim();

  if (!codigo || !bandeira || !nome || !rotuloIdioma || !bandeiraIdioma) {
    return;
  }

  opcoesIdioma.forEach((item) => {
    item.setAttribute("aria-checked", String(item === opcao));
  });

  bandeiraIdioma.src = bandeira;
  rotuloIdioma.textContent = nome;

  if (persistir) {
    salvarIdioma(codigo);
  }

  document.dispatchEvent(
    new CustomEvent("vortex:languagechange", { detail: { language: codigo } }),
  );
}

function focarOpcao(deslocamento: number): void {
  const indiceAtual = opcoesIdioma.findIndex(
    (opcao) => opcao === document.activeElement,
  );
  const proximoIndice =
    (indiceAtual + deslocamento + opcoesIdioma.length) % opcoesIdioma.length;

  opcoesIdioma[proximoIndice]?.focus();
}

function inicializarSeletorDeIdioma(): void {
  if (!botaoIdioma || !menuIdiomas || opcoesIdioma.length === 0) {
    return;
  }

  const idiomaSalvo = carregarIdiomaSalvo();
  const opcaoSalva = opcoesIdioma.find(
    (opcao) => opcao.dataset.language === idiomaSalvo,
  );

  if (opcaoSalva) {
    selecionarIdioma(opcaoSalva, false);
  }

  botaoIdioma.addEventListener("click", () => {
    const deveAbrir = botaoIdioma.getAttribute("aria-expanded") !== "true";
    definirMenuIdiomasAberto(deveAbrir);

    if (deveAbrir) {
      opcoesIdioma.find(
        (opcao) => opcao.getAttribute("aria-checked") === "true",
      )?.focus();
    }
  });

  opcoesIdioma.forEach((opcao) => {
    opcao.addEventListener("click", () => {
      selecionarIdioma(opcao);
      definirMenuIdiomasAberto(false);
      botaoIdioma.focus();
    });
  });

  menuIdiomas.addEventListener("keydown", (evento) => {
    if (evento.key === "ArrowDown" || evento.key === "ArrowUp") {
      evento.preventDefault();
      focarOpcao(evento.key === "ArrowDown" ? 1 : -1);
    }

    if (evento.key === "Home" || evento.key === "End") {
      evento.preventDefault();
      opcoesIdioma[evento.key === "Home" ? 0 : opcoesIdioma.length - 1]?.focus();
    }

    if (evento.key === "Escape") {
      definirMenuIdiomasAberto(false);
      botaoIdioma.focus();
    }
  });

  document.addEventListener("click", (evento) => {
    const alvo = evento.target instanceof Node ? evento.target : null;

    if (
      botaoIdioma.getAttribute("aria-expanded") === "true" &&
      alvo &&
      !botaoIdioma.contains(alvo) &&
      !menuIdiomas.contains(alvo)
    ) {
      definirMenuIdiomasAberto(false);
    }
  });

  definirMenuIdiomasAberto(false);
}

inicializarSeletorDeIdioma();
