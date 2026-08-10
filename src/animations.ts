const contadoresEstatisticas =
  document.querySelectorAll<HTMLElement>("[data-counter]");
const prefereMovimentoReduzido = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const formatadorInteiro = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 0,
});

function easeOutQuart(progresso: number): number {
  return 1 - Math.pow(1 - progresso, 4);
}

function escreverValorDoContador(
  contador: HTMLElement,
  valor: number,
): void {
  const sufixo = contador.dataset.counterSuffix ?? "";
  contador.textContent = `${formatadorInteiro.format(valor)}${sufixo}`;
}

function animarContador(contador: HTMLElement): void {
  if (contador.dataset.counterAnimated === "true") {
    return;
  }

  contador.dataset.counterAnimated = "true";

  const valorFinal = Number(contador.dataset.counterTo);

  if (!Number.isFinite(valorFinal)) {
    return;
  }

  if (prefereMovimentoReduzido) {
    escreverValorDoContador(contador, valorFinal);
    return;
  }

  const duracao = 1250;
  const inicio = performance.now();

  function atualizarContador(agora: DOMHighResTimeStamp): void {
    const tempoDecorrido = agora - inicio;
    const progresso = Math.min(tempoDecorrido / duracao, 1);
    const valorAtual = Math.round(valorFinal * easeOutQuart(progresso));

    escreverValorDoContador(contador, valorAtual);

    if (progresso < 1) {
      window.requestAnimationFrame(atualizarContador);
    }
  }

  escreverValorDoContador(contador, 0);
  window.requestAnimationFrame(atualizarContador);
}

function inicializarContadoresEstatisticas(): void {
  if (!contadoresEstatisticas.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    contadoresEstatisticas.forEach(animarContador);
    return;
  }

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) {
          return;
        }

        if (entrada.target instanceof HTMLElement) {
          animarContador(entrada.target);
        }
        observador.unobserve(entrada.target);
      });
    },
    {
      threshold: 0.35,
    },
  );

  contadoresEstatisticas.forEach((contador) => {
    observador.observe(contador);
  });
}

inicializarContadoresEstatisticas();

const gruposComMovimentoContinuo =
  document.querySelectorAll<HTMLElement>("#inicio, #como-funciona");

function atualizarSuspensaoGlobalDoMovimento(): void {
  document.body.dataset.motionSuspended = String(document.hidden);
}

function inicializarPausaDeMovimentoForaDaTela(): void {
  if (!gruposComMovimentoContinuo.length) {
    return;
  }

  atualizarSuspensaoGlobalDoMovimento();
  document.addEventListener(
    "visibilitychange",
    atualizarSuspensaoGlobalDoMovimento,
  );

  if (!("IntersectionObserver" in window)) {
    return;
  }

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.target instanceof HTMLElement) {
          entrada.target.dataset.motionPaused = String(
            !entrada.isIntersecting,
          );
        }
      });
    },
    {
      rootMargin: "12% 0px",
      threshold: 0.05,
    },
  );

  gruposComMovimentoContinuo.forEach((grupo) => {
    observador.observe(grupo);
  });
}

inicializarPausaDeMovimentoForaDaTela();
