type CodigoIdioma = "pt-BR" | "de" | "en" | "fr" | "es" | "ja" | "zh-CN";

type ChaveTraducao =
  | "pularConteudo"
  | "inicio"
  | "comoFunciona"
  | "estatisticas"
  | "explorar"
  | "anunciar"
  | "meusAnuncios"
  | "tituloPrincipal"
  | "descricaoPrincipal"
  | "anunciarItem"
  | "explorarCatalogo"
  | "tituloCatalogo"
  | "descricaoCatalogo"
  | "buscarPlaceholder"
  | "buscarAnuncios"
  | "ordenarAnuncios"
  | "maisRecentes"
  | "menorPreco"
  | "maiorPreco"
  | "nomeAZ"
  | "criarColecao"
  | "fecharFormulario"
  | "fecharColecao"
  | "conversas"
  | "descricaoRodape"
  | "plataforma"
  | "economiaCircular"
  | "explorarAnuncios"
  | "criarAnuncio"
  | "suporte"
  | "perguntasFrequentes"
  | "contato"
  | "projetoAcademico"
  | "selecionarIdioma"
  | "idiomaAtual";

type Traducoes = Record<ChaveTraducao, string>;

const IDIOMAS: ReadonlyArray<{
  codigo: CodigoIdioma;
  nome: string;
}> = [
  { codigo: "pt-BR", nome: "Português — Brasil" },
  { codigo: "de", nome: "Deutsch" },
  { codigo: "en", nome: "English" },
  { codigo: "fr", nome: "Français" },
  { codigo: "es", nome: "Español" },
  { codigo: "ja", nome: "日本語" },
  { codigo: "zh-CN", nome: "简体中文" },
];

const TRADUCOES: Record<CodigoIdioma, Traducoes> = {
  "pt-BR": {
    pularConteudo: "Pular para o conteúdo principal",
    inicio: "Início",
    comoFunciona: "Como funciona",
    estatisticas: "Estatísticas",
    explorar: "Explorar",
    anunciar: "Anunciar",
    meusAnuncios: "Meus anúncios",
    tituloPrincipal: "Dê uma nova volta para o que ainda tem valor",
    descricaoPrincipal:
      "Encontre, venda ou doe itens dentro da comunidade UNIFOR e faça parte de uma economia mais circular.",
    anunciarItem: "Anunciar um item",
    explorarCatalogo: "Explorar catálogo",
    tituloCatalogo: "Itens que podem ganhar uma nova história",
    descricaoCatalogo:
      "Explore o catálogo com os filtros detalhados e encontre o que precisa no campus.",
    buscarPlaceholder: "Buscar por item, categoria ou localização...",
    buscarAnuncios: "Buscar anúncios",
    ordenarAnuncios: "Ordenar anúncios",
    maisRecentes: "Mais recentes",
    menorPreco: "Menor preço",
    maiorPreco: "Maior preço",
    nomeAZ: "Nome de A a Z",
    criarColecao: "Criar coleção",
    fecharFormulario: "Fechar formulário",
    fecharColecao: "Fechar coleção",
    conversas: "Conversas",
    descricaoRodape:
      "Uma iniciativa para incentivar escolhas mais conscientes na comunidade UNIFOR.",
    plataforma: "Plataforma",
    economiaCircular: "Economia circular",
    explorarAnuncios: "Explorar anúncios",
    criarAnuncio: "Criar anúncio",
    suporte: "Suporte",
    perguntasFrequentes: "Perguntas frequentes",
    contato: "Contato",
    projetoAcademico:
      "Projeto acadêmico desenvolvido para a Universidade de Fortaleza — UNIFOR.",
    selecionarIdioma: "Selecionar idioma",
    idiomaAtual: "Idioma atual",
  },
  de: {
    pularConteudo: "Zum Hauptinhalt springen",
    inicio: "Startseite",
    comoFunciona: "So funktioniert es",
    estatisticas: "Statistiken",
    explorar: "Entdecken",
    anunciar: "Inserieren",
    meusAnuncios: "Meine Anzeigen",
    tituloPrincipal: "Gib Wertvollem eine neue Chance",
    descricaoPrincipal:
      "Finde, verkaufe oder verschenke Artikel in der UNIFOR-Community und unterstütze eine stärker kreislauforientierte Wirtschaft.",
    anunciarItem: "Artikel inserieren",
    explorarCatalogo: "Katalog entdecken",
    tituloCatalogo: "Artikel, die eine neue Geschichte beginnen können",
    descricaoCatalogo:
      "Durchsuche den Katalog mit detaillierten Filtern und finde auf dem Campus, was du brauchst.",
    buscarPlaceholder: "Nach Artikel, Kategorie oder Ort suchen...",
    buscarAnuncios: "Anzeigen durchsuchen",
    ordenarAnuncios: "Anzeigen sortieren",
    maisRecentes: "Neueste zuerst",
    menorPreco: "Niedrigster Preis",
    maiorPreco: "Höchster Preis",
    nomeAZ: "Name A bis Z",
    criarColecao: "Sammlung erstellen",
    fecharFormulario: "Formular schließen",
    fecharColecao: "Sammlung schließen",
    conversas: "Unterhaltungen",
    descricaoRodape:
      "Eine Initiative für bewusstere Entscheidungen in der UNIFOR-Community.",
    plataforma: "Plattform",
    economiaCircular: "Kreislaufwirtschaft",
    explorarAnuncios: "Anzeigen entdecken",
    criarAnuncio: "Anzeige erstellen",
    suporte: "Support",
    perguntasFrequentes: "Häufige Fragen",
    contato: "Kontakt",
    projetoAcademico:
      "Akademisches Projekt der Universidade de Fortaleza — UNIFOR.",
    selecionarIdioma: "Sprache auswählen",
    idiomaAtual: "Aktuelle Sprache",
  },
  en: {
    pularConteudo: "Skip to main content",
    inicio: "Home",
    comoFunciona: "How it works",
    estatisticas: "Statistics",
    explorar: "Explore",
    anunciar: "List an item",
    meusAnuncios: "My listings",
    tituloPrincipal: "Give what still has value another turn",
    descricaoPrincipal:
      "Find, sell, or donate items within the UNIFOR community and help build a more circular economy.",
    anunciarItem: "List an item",
    explorarCatalogo: "Explore catalog",
    tituloCatalogo: "Items ready for a new story",
    descricaoCatalogo:
      "Explore the catalog with detailed filters and find what you need on campus.",
    buscarPlaceholder: "Search by item, category, or location...",
    buscarAnuncios: "Search listings",
    ordenarAnuncios: "Sort listings",
    maisRecentes: "Most recent",
    menorPreco: "Lowest price",
    maiorPreco: "Highest price",
    nomeAZ: "Name A to Z",
    criarColecao: "Create collection",
    fecharFormulario: "Close form",
    fecharColecao: "Close collection",
    conversas: "Conversations",
    descricaoRodape:
      "An initiative that encourages more conscious choices in the UNIFOR community.",
    plataforma: "Platform",
    economiaCircular: "Circular economy",
    explorarAnuncios: "Explore listings",
    criarAnuncio: "Create listing",
    suporte: "Support",
    perguntasFrequentes: "Frequently asked questions",
    contato: "Contact",
    projetoAcademico:
      "Academic project developed for the University of Fortaleza — UNIFOR.",
    selecionarIdioma: "Select language",
    idiomaAtual: "Current language",
  },
  fr: {
    pularConteudo: "Aller au contenu principal",
    inicio: "Accueil",
    comoFunciona: "Comment ça marche",
    estatisticas: "Statistiques",
    explorar: "Explorer",
    anunciar: "Publier",
    meusAnuncios: "Mes annonces",
    tituloPrincipal: "Donnez une nouvelle vie à ce qui a encore de la valeur",
    descricaoPrincipal:
      "Trouvez, vendez ou donnez des objets au sein de la communauté UNIFOR et participez à une économie plus circulaire.",
    anunciarItem: "Publier un objet",
    explorarCatalogo: "Explorer le catalogue",
    tituloCatalogo: "Des objets prêts à commencer une nouvelle histoire",
    descricaoCatalogo:
      "Explorez le catalogue avec des filtres détaillés et trouvez ce dont vous avez besoin sur le campus.",
    buscarPlaceholder: "Rechercher par objet, catégorie ou lieu...",
    buscarAnuncios: "Rechercher des annonces",
    ordenarAnuncios: "Trier les annonces",
    maisRecentes: "Plus récentes",
    menorPreco: "Prix le plus bas",
    maiorPreco: "Prix le plus élevé",
    nomeAZ: "Nom de A à Z",
    criarColecao: "Créer une collection",
    fecharFormulario: "Fermer le formulaire",
    fecharColecao: "Fermer la collection",
    conversas: "Conversations",
    descricaoRodape:
      "Une initiative pour encourager des choix plus responsables dans la communauté UNIFOR.",
    plataforma: "Plateforme",
    economiaCircular: "Économie circulaire",
    explorarAnuncios: "Explorer les annonces",
    criarAnuncio: "Créer une annonce",
    suporte: "Assistance",
    perguntasFrequentes: "Questions fréquentes",
    contato: "Contact",
    projetoAcademico:
      "Projet universitaire développé pour l'Université de Fortaleza — UNIFOR.",
    selecionarIdioma: "Choisir la langue",
    idiomaAtual: "Langue actuelle",
  },
  es: {
    pularConteudo: "Saltar al contenido principal",
    inicio: "Inicio",
    comoFunciona: "Cómo funciona",
    estatisticas: "Estadísticas",
    explorar: "Explorar",
    anunciar: "Publicar",
    meusAnuncios: "Mis anuncios",
    tituloPrincipal: "Dale una nueva vuelta a lo que aún tiene valor",
    descricaoPrincipal:
      "Encuentra, vende o dona artículos dentro de la comunidad UNIFOR y forma parte de una economía más circular.",
    anunciarItem: "Publicar un artículo",
    explorarCatalogo: "Explorar catálogo",
    tituloCatalogo: "Artículos que pueden comenzar una nueva historia",
    descricaoCatalogo:
      "Explora el catálogo con filtros detallados y encuentra lo que necesitas en el campus.",
    buscarPlaceholder: "Buscar por artículo, categoría o ubicación...",
    buscarAnuncios: "Buscar anuncios",
    ordenarAnuncios: "Ordenar anuncios",
    maisRecentes: "Más recientes",
    menorPreco: "Menor precio",
    maiorPreco: "Mayor precio",
    nomeAZ: "Nombre de A a Z",
    criarColecao: "Crear colección",
    fecharFormulario: "Cerrar formulario",
    fecharColecao: "Cerrar colección",
    conversas: "Conversaciones",
    descricaoRodape:
      "Una iniciativa para fomentar decisiones más conscientes en la comunidad UNIFOR.",
    plataforma: "Plataforma",
    economiaCircular: "Economía circular",
    explorarAnuncios: "Explorar anuncios",
    criarAnuncio: "Crear anuncio",
    suporte: "Soporte",
    perguntasFrequentes: "Preguntas frecuentes",
    contato: "Contacto",
    projetoAcademico:
      "Proyecto académico desarrollado para la Universidad de Fortaleza — UNIFOR.",
    selecionarIdioma: "Seleccionar idioma",
    idiomaAtual: "Idioma actual",
  },
  ja: {
    pularConteudo: "メインコンテンツへ移動",
    inicio: "ホーム",
    comoFunciona: "仕組み",
    estatisticas: "統計",
    explorar: "探す",
    anunciar: "出品する",
    meusAnuncios: "自分の出品",
    tituloPrincipal: "まだ価値のあるものに、新しい出番を",
    descricaoPrincipal:
      "UNIFORコミュニティで品物を探し、販売し、寄付して、循環型経済に参加しましょう。",
    anunciarItem: "品物を出品",
    explorarCatalogo: "カタログを見る",
    tituloCatalogo: "新しい物語を始められる品物",
    descricaoCatalogo:
      "詳細な絞り込みでカタログを検索し、キャンパスで必要なものを見つけましょう。",
    buscarPlaceholder: "品物、カテゴリー、場所で検索...",
    buscarAnuncios: "出品を検索",
    ordenarAnuncios: "出品を並べ替え",
    maisRecentes: "新着順",
    menorPreco: "価格が低い順",
    maiorPreco: "価格が高い順",
    nomeAZ: "名前 A〜Z",
    criarColecao: "コレクションを作成",
    fecharFormulario: "フォームを閉じる",
    fecharColecao: "コレクションを閉じる",
    conversas: "メッセージ",
    descricaoRodape: "UNIFORコミュニティで、より意識的な選択を促す取り組みです。",
    plataforma: "プラットフォーム",
    economiaCircular: "循環型経済",
    explorarAnuncios: "出品を見る",
    criarAnuncio: "出品を作成",
    suporte: "サポート",
    perguntasFrequentes: "よくある質問",
    contato: "お問い合わせ",
    projetoAcademico: "フォルタレザ大学（UNIFOR）のために開発された学術プロジェクト。",
    selecionarIdioma: "言語を選択",
    idiomaAtual: "現在の言語",
  },
  "zh-CN": {
    pularConteudo: "跳到主要内容",
    inicio: "首页",
    comoFunciona: "使用方式",
    estatisticas: "统计",
    explorar: "探索",
    anunciar: "发布",
    meusAnuncios: "我的发布",
    tituloPrincipal: "让仍有价值的物品开启新的循环",
    descricaoPrincipal:
      "在 UNIFOR 社区内寻找、出售或捐赠物品，共同参与更具循环性的经济。",
    anunciarItem: "发布物品",
    explorarCatalogo: "浏览目录",
    tituloCatalogo: "可以开启新故事的物品",
    descricaoCatalogo: "使用详细筛选浏览目录，在校园中找到你所需要的物品。",
    buscarPlaceholder: "按物品、类别或地点搜索...",
    buscarAnuncios: "搜索发布",
    ordenarAnuncios: "发布排序",
    maisRecentes: "最新发布",
    menorPreco: "价格最低",
    maiorPreco: "价格最高",
    nomeAZ: "名称 A 到 Z",
    criarColecao: "创建收藏",
    fecharFormulario: "关闭表单",
    fecharColecao: "关闭收藏",
    conversas: "对话",
    descricaoRodape: "一项鼓励 UNIFOR 社区做出更有意识选择的倡议。",
    plataforma: "平台",
    economiaCircular: "循环经济",
    explorarAnuncios: "浏览发布",
    criarAnuncio: "创建发布",
    suporte: "支持",
    perguntasFrequentes: "常见问题",
    contato: "联系我们",
    projetoAcademico: "为福塔莱萨大学（UNIFOR）开发的学术项目。",
    selecionarIdioma: "选择语言",
    idiomaAtual: "当前语言",
  },
};

const CHAVE_IDIOMA = "marketplace-vortex-language";
const botaoIdioma = document.querySelector<HTMLButtonElement>("#footer-lang-button");
const menuIdiomas = document.querySelector<HTMLElement>("#footer-lang-menu");
const rotuloIdioma = botaoIdioma?.querySelector<HTMLElement>(".footer-lang-label");
const bandeiraIdioma = botaoIdioma?.querySelector<HTMLImageElement>(".footer-lang-flag");
const opcoesIdioma = Array.from(
  menuIdiomas?.querySelectorAll<HTMLButtonElement>("[data-language]") ?? [],
);

const VINCULOS_TEXTO: ReadonlyArray<[string, ChaveTraducao]> = [
  ['body > a[href="#conteudo-principal"]', "pularConteudo"],
  ["#navegacao-principal li:nth-child(1) a", "inicio"],
  ["#navegacao-principal li:nth-child(2) a", "comoFunciona"],
  ["#navegacao-principal li:nth-child(3) a", "estatisticas"],
  ["#navegacao-principal li:nth-child(4) a", "explorar"],
  ["#navegacao-principal li:nth-child(5) a", "anunciar"],
  ["#navegacao-principal li:nth-child(6) a", "meusAnuncios"],
  ["#titulo-principal", "tituloPrincipal"],
  ["#inicio > p", "descricaoPrincipal"],
  [".hero-cta-primary", "anunciarItem"],
  [".hero-cta-secondary", "explorarCatalogo"],
  ["#titulo-vitrine", "tituloCatalogo"],
  ["#titulo-vitrine + p", "descricaoCatalogo"],
  ['#ordenacao-vitrine option[value="recentes"]', "maisRecentes"],
  ['#ordenacao-vitrine option[value="menor-preco"]', "menorPreco"],
  ['#ordenacao-vitrine option[value="maior-preco"]', "maiorPreco"],
  ['#ordenacao-vitrine option[value="nome"]', "nomeAZ"],
  ["footer > section > p", "descricaoRodape"],
  [".footer-nav-container nav:nth-child(1) .footer-heading", "plataforma"],
  [".footer-nav-container nav:nth-child(1) li:nth-child(1) a", "economiaCircular"],
  [".footer-nav-container nav:nth-child(1) li:nth-child(2) a", "explorarAnuncios"],
  [".footer-nav-container nav:nth-child(1) li:nth-child(3) a", "criarAnuncio"],
  [".footer-nav-container nav:nth-child(2) .footer-heading", "suporte"],
  [".footer-nav-container nav:nth-child(2) li:nth-child(1) a", "meusAnuncios"],
  [".footer-nav-container nav:nth-child(2) li:nth-child(2) a", "perguntasFrequentes"],
  [".footer-nav-container nav:nth-child(2) li:nth-child(3) a", "contato"],
  [".footer-bottom > p", "projetoAcademico"],
];

function idiomaSuportado(codigo: string | null | undefined): codigo is CodigoIdioma {
  return IDIOMAS.some((idioma) => idioma.codigo === codigo);
}

function definirMenuIdiomasAberto(aberto: boolean): void {
  if (!botaoIdioma || !menuIdiomas) return;

  botaoIdioma.setAttribute("aria-expanded", String(aberto));
  menuIdiomas.hidden = !aberto;
}

function salvarIdioma(codigo: CodigoIdioma): void {
  try {
    window.localStorage.setItem(CHAVE_IDIOMA, codigo);
  } catch {
    // A seleção continua funcionando quando o armazenamento estiver bloqueado.
  }
}

function carregarIdiomaSalvo(): CodigoIdioma | null {
  try {
    const salvo = window.localStorage.getItem(CHAVE_IDIOMA);
    return idiomaSuportado(salvo) ? salvo : null;
  } catch {
    return null;
  }
}

function definirTexto(seletor: string, texto: string): void {
  const elemento = document.querySelector<HTMLElement>(seletor);
  if (elemento) elemento.textContent = texto;
}

function atualizarBotoesComEstado(traducoes: Traducoes): void {
  const botaoAnuncio = document.querySelector<HTMLButtonElement>("#botao-abrir-anuncio");
  const botaoColecao = document.querySelector<HTMLButtonElement>("#botao-criar-colecao");
  const botaoConversas = document.querySelector<HTMLButtonElement>("#botao-abrir-conversas");

  if (botaoAnuncio) {
    botaoAnuncio.textContent =
      botaoAnuncio.getAttribute("aria-expanded") === "true"
        ? traducoes.fecharFormulario
        : traducoes.anunciar;
  }

  if (botaoColecao) {
    botaoColecao.textContent =
      botaoColecao.getAttribute("aria-expanded") === "true"
        ? traducoes.fecharColecao
        : traducoes.criarColecao;
  }

  if (botaoConversas) {
    const noTexto = Array.from(botaoConversas.childNodes).find(
      (no) => no.nodeType === Node.TEXT_NODE && no.textContent?.trim(),
    );
    if (noTexto) noTexto.textContent = `\n                  ${traducoes.conversas}\n                  `;
  }
}

function traduzirInterface(codigo: CodigoIdioma): void {
  const traducoes = TRADUCOES[codigo];
  document.documentElement.lang = codigo;

  VINCULOS_TEXTO.forEach(([seletor, chave]) => definirTexto(seletor, traducoes[chave]));

  const campoBusca = document.querySelector<HTMLInputElement>("#busca-vitrine");
  if (campoBusca) {
    campoBusca.placeholder = traducoes.buscarPlaceholder;
    campoBusca.setAttribute("aria-label", traducoes.buscarAnuncios);
  }

  document
    .querySelector("#ordenacao-vitrine")
    ?.setAttribute("aria-label", traducoes.ordenarAnuncios);
  menuIdiomas?.setAttribute("aria-label", traducoes.selecionarIdioma);
  atualizarBotoesComEstado(traducoes);
}

function selecionarIdioma(
  opcao: HTMLButtonElement,
  persistir = true,
  emitirEvento = true,
): void {
  const codigo = opcao.dataset.language;
  const bandeira = opcao.dataset.flagSrc;

  if (!idiomaSuportado(codigo) || !bandeira || !rotuloIdioma || !bandeiraIdioma) return;

  const idioma = IDIOMAS.find((item) => item.codigo === codigo);
  if (!idioma) return;

  opcoesIdioma.forEach((item) => {
    const selecionada = item === opcao;
    item.setAttribute("aria-checked", String(selecionada));
    item.tabIndex = selecionada ? 0 : -1;

    const codigoOpcao = item.dataset.language;
    const idiomaOpcao = IDIOMAS.find((candidato) => candidato.codigo === codigoOpcao);
    const rotuloOpcao = item.querySelector("span");
    if (idiomaOpcao && rotuloOpcao) rotuloOpcao.textContent = idiomaOpcao.nome;
  });

  bandeiraIdioma.src = bandeira;
  rotuloIdioma.textContent = idioma.nome;
  traduzirInterface(codigo);
  botaoIdioma?.setAttribute(
    "aria-label",
    `${TRADUCOES[codigo].idiomaAtual}: ${idioma.nome}. ${TRADUCOES[codigo].selecionarIdioma}`,
  );

  if (persistir) salvarIdioma(codigo);

  if (emitirEvento) {
    document.dispatchEvent(
      new CustomEvent("vortex:languagechange", {
        detail: { language: codigo },
      }),
    );
  }
}

function focarOpcao(deslocamento: number): void {
  if (opcoesIdioma.length === 0) return;

  const indiceAtual = opcoesIdioma.findIndex((opcao) => opcao === document.activeElement);
  const indiceBase = indiceAtual >= 0 ? indiceAtual : 0;
  const proximoIndice =
    (indiceBase + deslocamento + opcoesIdioma.length) % opcoesIdioma.length;
  opcoesIdioma[proximoIndice]?.focus();
}

function abrirMenuEFocar(posicao: "selecionada" | "primeira" | "ultima"): void {
  definirMenuIdiomasAberto(true);

  if (posicao === "primeira") opcoesIdioma[0]?.focus();
  else if (posicao === "ultima") opcoesIdioma.at(-1)?.focus();
  else {
    opcoesIdioma
      .find((opcao) => opcao.getAttribute("aria-checked") === "true")
      ?.focus();
  }
}

function inicializarSeletorDeIdioma(): void {
  if (!botaoIdioma || !menuIdiomas || opcoesIdioma.length === 0) return;

  const idiomaInicial = carregarIdiomaSalvo() ?? "pt-BR";
  const opcaoInicial = opcoesIdioma.find(
    (opcao) => opcao.dataset.language === idiomaInicial,
  );
  if (opcaoInicial) selecionarIdioma(opcaoInicial, false, false);

  botaoIdioma.addEventListener("click", () => {
    const deveAbrir = botaoIdioma.getAttribute("aria-expanded") !== "true";
    if (deveAbrir) abrirMenuEFocar("selecionada");
    else definirMenuIdiomasAberto(false);
  });

  botaoIdioma.addEventListener("keydown", (evento) => {
    if (evento.key === "ArrowDown" || evento.key === "ArrowUp") {
      evento.preventDefault();
      abrirMenuEFocar(evento.key === "ArrowDown" ? "primeira" : "ultima");
    } else if (evento.key === "Home" || evento.key === "End") {
      evento.preventDefault();
      abrirMenuEFocar(evento.key === "Home" ? "primeira" : "ultima");
    } else if (evento.key === "Escape") {
      definirMenuIdiomasAberto(false);
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
    } else if (evento.key === "Home" || evento.key === "End") {
      evento.preventDefault();
      opcoesIdioma[evento.key === "Home" ? 0 : opcoesIdioma.length - 1]?.focus();
    } else if (evento.key === "Escape") {
      evento.preventDefault();
      definirMenuIdiomasAberto(false);
      botaoIdioma.focus();
    }
  });

  menuIdiomas.addEventListener("focusout", (evento) => {
    const proximoFoco = evento.relatedTarget;

    if (
      proximoFoco instanceof Node &&
      (menuIdiomas.contains(proximoFoco) || proximoFoco === botaoIdioma)
    ) {
      return;
    }

    window.setTimeout(() => {
      const foco = document.activeElement;
      if (foco instanceof Node && !menuIdiomas.contains(foco) && foco !== botaoIdioma) {
        definirMenuIdiomasAberto(false);
      }
    }, 0);
  });

  document.addEventListener("click", (evento) => {
    const alvo = evento.target instanceof Node ? evento.target : null;
    if (
      botaoIdioma.getAttribute("aria-expanded") === "true" &&
      (!alvo || (!botaoIdioma.contains(alvo) && !menuIdiomas.contains(alvo)))
    ) {
      definirMenuIdiomasAberto(false);
    }
  });

  window.addEventListener("storage", (evento) => {
    if (evento.key !== CHAVE_IDIOMA || !idiomaSuportado(evento.newValue)) return;
    const opcao = opcoesIdioma.find(
      (item) => item.dataset.language === evento.newValue,
    );
    if (opcao) selecionarIdioma(opcao, false);
  });

  const botoesComEstado = ["#botao-abrir-anuncio", "#botao-criar-colecao"]
    .map((seletor) => document.querySelector(seletor))
    .filter((elemento): elemento is Element => Boolean(elemento));

  if (botoesComEstado.length > 0) {
    const observador = new MutationObserver(() => {
      const codigoAtual = document.documentElement.lang;
      if (idiomaSuportado(codigoAtual)) atualizarBotoesComEstado(TRADUCOES[codigoAtual]);
    });
    botoesComEstado.forEach((elemento) =>
      observador.observe(elemento, { attributes: true, attributeFilter: ["aria-expanded"] }),
    );
  }

  definirMenuIdiomasAberto(false);
}

inicializarSeletorDeIdioma();
