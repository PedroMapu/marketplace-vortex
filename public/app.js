const valorItem = document.querySelector("#valor-item");
const modalidadeVenda = document.querySelector("#modalidade-venda");
const modalidadeDoacao = document.querySelector("#modalidade-doacao");
const campoImagem = document.querySelector("#imagem-item");
const errosImagem = document.querySelector("#erro-imagem");
const formularioNovoAnuncio = document.querySelector(
  "#formulario-novo-anuncio",
);
const botaoPublicarAnuncio = document.querySelector("#botao-publicar-anuncio");
const painelNovoAnuncio = document.querySelector("#painel-novo-anuncio");
const botaoAbrirAnuncio = document.querySelector("#botao-abrir-anuncio");
const botaoFecharAnuncio = document.querySelector("#botao-fechar-anuncio");
const botaoCriarColecao = document.querySelector("#botao-criar-colecao");
const painelNovaColecao = document.querySelector("#painel-nova-colecao");
const botaoFecharColecao = document.querySelector("#botao-fechar-colecao");
const formularioNovaColecao = document.querySelector(
  "#formulario-nova-colecao",
);
const campoNomeColecao = document.querySelector("#nome-colecao");
const listaItensColecao = document.querySelector("#lista-itens-colecao");
const botaoAdicionarItemColecao = document.querySelector(
  "#botao-adicionar-item-colecao",
);
const botaoSalvarColecao = document.querySelector("#botao-salvar-colecao");
const feedbackColecao = document.querySelector("#feedback-colecao");
const secaoColecoes = document.querySelector("#colecoes-destaque");
const gradeColecoes = secaoColecoes?.querySelector(".colecoes-grid");
const listaAnuncios = document.querySelector("#lista-anuncios");
const listaMeusAnuncios = document.querySelector("#lista-meus-anuncios");
const resultadosContagem = document.querySelector("#resultados-contagem");
const feedbackAnuncio = document.querySelector("#feedback-anuncio");
const botaoContaUsuario = document.querySelector("#nome-usuario");
const containerContaUsuario = document.querySelector(".conta-usuario");
const menuContaUsuario = document.querySelector("#menu-conta");
const botaoSairConta = document.querySelector("#botao-sair-conta");
const headerPrincipal = document.querySelector("header");
const botaoMenuPrincipal = document.querySelector("#botao-menu-principal");
const navegacaoPrincipal = document.querySelector("#navegacao-principal");
const mediaMenuCompacto = window.matchMedia("(max-width: 68rem)");
const formularioBuscaVitrine = document.querySelector("#formulario-busca-vitrine");
const campoBuscaVitrine = document.querySelector("#busca-vitrine");
const ordenacaoVitrine = document.querySelector("#ordenacao-vitrine");
const abasCatalogo = document.querySelectorAll("[data-aba-catalogo]");
const botoesLayout = document.querySelectorAll("[data-layout]");
const filtrosCategoria = document.querySelectorAll("[data-categoria-filtro]");
const filtrosCondicao = document.querySelectorAll("[data-condicao-filtro]");
const filtrosModalidade = document.querySelectorAll("[data-modalidade-filtro]");
const modalImagem = document.querySelector("#modal-imagem");
const imagemAmpliada = document.querySelector("#imagem-ampliada");
const tituloModalImagem = document.querySelector("#modal-imagem-titulo");
const botaoFecharModalImagem = document.querySelector("#fechar-modal-imagem");

const CHAVE_USUARIO = "marketplace-vortex:usuario";
const CHAVE_COLECOES = "marketplace-vortex:colecoes";
const MENSAGEM_IMAGEM_OBRIGATORIA = "Escolha uma imagem para o anúncio.";
const MENSAGEM_IMAGEM_INVALIDA = "Envie uma imagem PNG, JPG ou JPEG.";
const TAMANHO_MAXIMO_IMAGEM_BYTES = 5 * 1024 * 1024;
const MENSAGEM_TAMANHO_IMAGEM_INVALIDO =
  "Envie uma imagem de até 5 MB.";
const IMAGEM_PADRAO_ANUNCIO =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80";
const categorias = {
  livros: {
    nome: "Livros e papelaria",
    emoji: "📚",
    imagemPadrao:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
  },
  eletronicos: {
    nome: "Eletrônicos",
    emoji: "🎧",
    imagemPadrao:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
  },
  casa: {
    nome: "Casa e decoração",
    emoji: "🪴",
    imagemPadrao:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80",
  },
  moda: {
    nome: "Moda e acessórios",
    emoji: "🎒",
    imagemPadrao:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
  },
  outros: {
    nome: "Outros",
    emoji: "♻️",
    imagemPadrao: IMAGEM_PADRAO_ANUNCIO,
  },
};
const nomesCondicoes = {
  novo: "Novo",
  seminovo: "Seminovo",
  usado: "Usado",
};

let temporizadorAvisoBotao;
let temporizadorFeedback;
let scrollHeaderAgendado = false;
let termoBuscaVitrine = "";
let abaCatalogoAtiva = "todos";
let categoriaFiltroAtiva = "todas";
let ordenacaoAtiva = "recentes";
// Snapshots de leitura preenchidos exclusivamente pelas respostas da API.
// Toda alteração persistente deve ser seguida por um novo carregamento do servidor.
let cacheCatalogoApi = [];
let cacheAnunciosUsuarioApi = [];
let cacheContagemApi = [];
let sequenciaRequisicaoCatalogo = 0;
let sequenciaRequisicaoUsuario = 0;
const idsEmExclusao = new Set();
let publicacaoEmAndamento = false;
let sequenciaItemColecao = 0;
let temporizadorFeedbackColecao;

const formatadorMoeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
const ordenadorAlfabetico = new Intl.Collator("pt-BR", {
  sensitivity: "base",
});

async function requisitarApi(caminho, opcoes = {}) {
  const { headers = {}, ...demaisOpcoes } = opcoes;
  const resposta = await fetch(caminho, {
    ...demaisOpcoes,
    headers: {
      Accept: "application/json",
      ...headers,
    },
  });

  let dados = null;

  try {
    dados = await resposta.json();
  } catch {
    // Uma resposta sem JSON será tratada pela mensagem genérica abaixo.
  }

  if (!resposta.ok) {
    const erro = new Error(
      dados?.erro || "Não foi possível concluir a solicitação.",
    );
    erro.status = resposta.status;
    erro.dados = dados;
    throw erro;
  }

  return dados;
}

function normalizarAnuncioDaApi(anuncio) {
  const id = Number(anuncio?.id);
  const valor = Number(anuncio?.valor);

  if (!Number.isInteger(id) || id <= 0) {
    throw new TypeError("A API retornou um anúncio com ID inválido.");
  }

  return {
    ...anuncio,
    id,
    valor: Number.isFinite(valor) ? valor : 0,
  };
}

function criarUrlDaApiDeAnuncios({ categoria, usuarioId } = {}) {
  const parametros = new URLSearchParams();

  if (categoria && categoria !== "todas") {
    parametros.set("categoria", categoria);
  }

  if (usuarioId) {
    parametros.set("usuarioId", usuarioId);
  }

  const queryString = parametros.toString();
  return `/api/anuncios${queryString ? `?${queryString}` : ""}`;
}

function normalizarListaDeAnuncios(resposta) {
  if (!Array.isArray(resposta)) {
    throw new TypeError("A API retornou uma lista de anúncios inválida.");
  }

  // A API entrega os mais recentes primeiro; o cache mantém a ordem histórica
  // esperada pelas rotinas atuais de renderização.
  return resposta.map(normalizarAnuncioDaApi).reverse();
}

function exibirEstadoDeCarregamento() {
  const mensagem = criarEstadoVazio("Carregando anúncios...");

  listaAnuncios?.replaceChildren(mensagem);
  listaAnuncios?.setAttribute("aria-busy", "true");

  if (resultadosContagem) {
    resultadosContagem.textContent = "Carregando resultados...";
  }
}

function exibirEstadoDeCarregamentoDoUsuario() {
  if (listaMeusAnuncios) {
    listaMeusAnuncios.replaceChildren(
      criarEstadoVazio("Carregando seus anúncios..."),
    );
    listaMeusAnuncios.setAttribute("aria-busy", "true");
  }
}

function exibirErroAoCarregarAnuncios() {
  if (listaAnuncios) {
    const estado = criarElemento("div", "estado-vazio");
    const mensagem = criarElemento(
      "p",
      "",
      "Não foi possível carregar os anúncios. Verifique sua conexão e tente novamente.",
    );
    const botaoTentarNovamente = criarElemento(
      "button",
      "btn-detalhes",
      "Tentar novamente",
    );

    botaoTentarNovamente.type = "button";
    botaoTentarNovamente.addEventListener("click", carregarAnunciosDaApi);
    estado.append(mensagem, botaoTentarNovamente);
    listaAnuncios.replaceChildren(estado);
    listaAnuncios.removeAttribute("aria-busy");
  }

  if (resultadosContagem) {
    resultadosContagem.textContent = "Anúncios indisponíveis";
  }
}

function exibirErroAoCarregarAnunciosDoUsuario() {
  if (listaMeusAnuncios) {
    const estado = criarElemento("div", "estado-vazio");
    const mensagem = criarElemento(
      "p",
      "",
      "Não foi possível carregar seus anúncios.",
    );
    const botaoTentarNovamente = criarElemento(
      "button",
      "btn-detalhes",
      "Tentar novamente",
    );

    botaoTentarNovamente.type = "button";
    botaoTentarNovamente.addEventListener(
      "click",
      carregarMeusAnunciosDaApi,
    );
    estado.append(mensagem, botaoTentarNovamente);
    listaMeusAnuncios.replaceChildren(estado);
    listaMeusAnuncios.removeAttribute("aria-busy");
  }
}

async function carregarAnunciosDaApi({ mostrarCarregamento = true } = {}) {
  const sequenciaDestaRequisicao = ++sequenciaRequisicaoCatalogo;
  const categoria = categoriaFiltroAtiva;

  if (mostrarCarregamento) {
    exibirEstadoDeCarregamento();
  }

  try {
    const urlCatalogo = criarUrlDaApiDeAnuncios({ categoria });
    const precisaCarregarContagensGerais = categoria !== "todas";
    const [resposta, respostaParaContagem] = await Promise.all([
      requisitarApi(urlCatalogo),
      precisaCarregarContagensGerais
        ? requisitarApi(criarUrlDaApiDeAnuncios())
        : Promise.resolve(null),
    ]);

    if (sequenciaDestaRequisicao !== sequenciaRequisicaoCatalogo) {
      return false;
    }

    cacheCatalogoApi = normalizarListaDeAnuncios(resposta);
    cacheContagemApi = respostaParaContagem
      ? normalizarListaDeAnuncios(respostaParaContagem)
      : [...cacheCatalogoApi];
    listaAnuncios?.removeAttribute("aria-busy");
    renderizarAnuncios();
    return true;
  } catch (erro) {
    if (sequenciaDestaRequisicao !== sequenciaRequisicaoCatalogo) {
      return false;
    }

    console.error("Não foi possível carregar os anúncios da API.", erro);
    cacheCatalogoApi = [];
    cacheContagemApi = [];
    exibirErroAoCarregarAnuncios();
    return false;
  }
}

async function carregarMeusAnunciosDaApi(
  { mostrarCarregamento = true } = {},
) {
  const sequenciaDestaRequisicao = ++sequenciaRequisicaoUsuario;
  const usuarioDaRequisicao = usuarioAtual;

  if (!usuarioDaRequisicao) {
    cacheAnunciosUsuarioApi = [];
    listaMeusAnuncios?.removeAttribute("aria-busy");
    renderizarMeusAnuncios();
    return true;
  }

  if (mostrarCarregamento) {
    exibirEstadoDeCarregamentoDoUsuario();
  }

  try {
    const resposta = await requisitarApi(
      criarUrlDaApiDeAnuncios({ usuarioId: usuarioDaRequisicao.id }),
    );

    if (
      sequenciaDestaRequisicao !== sequenciaRequisicaoUsuario ||
      usuarioAtual?.id !== usuarioDaRequisicao.id
    ) {
      return false;
    }

    cacheAnunciosUsuarioApi = normalizarListaDeAnuncios(resposta);
    listaMeusAnuncios?.removeAttribute("aria-busy");
    renderizarMeusAnuncios();
    return true;
  } catch (erro) {
    if (
      sequenciaDestaRequisicao !== sequenciaRequisicaoUsuario ||
      usuarioAtual?.id !== usuarioDaRequisicao.id
    ) {
      return false;
    }

    console.error("Não foi possível carregar os anúncios do usuário.", erro);
    cacheAnunciosUsuarioApi = [];
    exibirErroAoCarregarAnunciosDoUsuario();
    return false;
  }
}

function gerarId(prefixo) {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return `${prefixo}-${window.crypto.randomUUID()}`;
  }

  return `${prefixo}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function usuarioSalvoEhValido(usuario) {
  return (
    usuario &&
    typeof usuario.id === "string" &&
    usuario.id.trim() !== "" &&
    typeof usuario.nome === "string" &&
    usuario.nome.trim() !== ""
  );
}

function lerUsuarioSalvo() {
  try {
    const usuarioSalvo = window.localStorage.getItem(CHAVE_USUARIO);

    if (!usuarioSalvo) {
      return null;
    }

    const usuario = JSON.parse(usuarioSalvo);
    return usuarioSalvoEhValido(usuario) ? usuario : null;
  } catch (erro) {
    console.warn("Não foi possível recuperar o usuário salvo.", erro);
    return null;
  }
}

function salvarUsuario(usuario) {
  try {
    window.localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario));
  } catch (erro) {
    console.warn("Não foi possível salvar o usuário neste navegador.", erro);
  }
}

function removerUsuarioSalvo() {
  try {
    window.localStorage.removeItem(CHAVE_USUARIO);
  } catch (erro) {
    console.warn("Não foi possível remover o usuário salvo.", erro);
  }
}

let usuarioAtual = lerUsuarioSalvo();

function colecaoSalvaEhValida(colecao) {
  return (
    colecao &&
    typeof colecao.id === "string" &&
    typeof colecao.usuarioId === "string" &&
    typeof colecao.usuarioNome === "string" &&
    typeof colecao.nome === "string" &&
    colecao.nome.trim() !== "" &&
    Array.isArray(colecao.itens) &&
    colecao.itens.length > 0 &&
    colecao.itens.every(
      (item) =>
        item &&
        typeof item.nome === "string" &&
        item.nome.trim() !== "" &&
        typeof item.categoria === "string" &&
        Object.hasOwn(categorias, item.categoria),
    )
  );
}

function lerColecoesSalvas() {
  try {
    const conteudoSalvo = window.localStorage.getItem(CHAVE_COLECOES);

    if (!conteudoSalvo) {
      return [];
    }

    const colecoes = JSON.parse(conteudoSalvo);
    return Array.isArray(colecoes)
      ? colecoes.filter(colecaoSalvaEhValida)
      : [];
  } catch (erro) {
    console.warn("Não foi possível recuperar as coleções salvas.", erro);
    return [];
  }
}

function salvarColecoes(colecoes) {
  try {
    window.localStorage.setItem(CHAVE_COLECOES, JSON.stringify(colecoes));
    return true;
  } catch (erro) {
    console.warn("Não foi possível salvar a coleção neste navegador.", erro);
    return false;
  }
}

function criarCardColecaoUsuario(colecao) {
  const card = criarElemento("article", "card-colecao card-colecao-usuario");
  const cabecalho = criarElemento("div", "colecao-header");
  const avatar = document.createElement("img");
  const dadosAutor = document.createElement("div");
  const titulo = criarElemento("h3", "", colecao.nome);
  const autor = criarElemento(
    "p",
    "",
    `Por ${colecao.usuarioNome} · ${colecao.itens.length} ${
      colecao.itens.length === 1 ? "item" : "itens"
    }`,
  );
  const nomesItens = colecao.itens.map((item) => item.nome);
  const nomesNoResumo = nomesItens.slice(0, 3);
  const complementoDoResumo =
    nomesItens.length > 3 ? ` e mais ${nomesItens.length - 3}` : "";
  const descricao = criarElemento(
    "p",
    "colecao-desc",
    `Inclui ${nomesNoResumo.join(", ")}${complementoDoResumo}.`,
  );
  const previa = criarElemento("div", "colecao-preview");
  const itensNaPrevia =
    colecao.itens.length > 3 ? colecao.itens.slice(0, 2) : colecao.itens;

  card.dataset.colecaoUsuario = "true";
  card.dataset.id = colecao.id;
  card.setAttribute("aria-label", `Coleção ${colecao.nome}`);
  avatar.className = "colecao-avatar";
  avatar.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(colecao.usuarioNome)}`;
  avatar.alt = "";

  itensNaPrevia.forEach((item) => {
    const categoria = categorias[item.categoria];
    const miniatura = criarElemento(
      "div",
      "colecao-img-mini",
      categoria.emoji,
    );
    miniatura.setAttribute("aria-hidden", "true");
    previa.append(miniatura);
  });

  if (colecao.itens.length > 3) {
    const quantidadeRestante = criarElemento(
      "div",
      "colecao-img-mini overlay",
      `+${colecao.itens.length - 2}`,
    );
    quantidadeRestante.setAttribute("aria-hidden", "true");
    previa.append(quantidadeRestante);
  }

  dadosAutor.append(titulo, autor);
  cabecalho.append(avatar, dadosAutor);
  card.append(cabecalho, descricao, previa);

  return card;
}

function renderizarColecoesDoUsuario() {
  if (!gradeColecoes) {
    return;
  }

  gradeColecoes
    .querySelectorAll('[data-colecao-usuario="true"]')
    .forEach((card) => card.remove());

  if (!usuarioAtual) {
    return;
  }

  const colecoesDoUsuario = lerColecoesSalvas()
    .filter((colecao) => colecao.usuarioId === usuarioAtual.id)
    .reverse();
  const fragmento = document.createDocumentFragment();

  colecoesDoUsuario.forEach((colecao) => {
    fragmento.append(criarCardColecaoUsuario(colecao));
  });

  gradeColecoes.insertBefore(fragmento, gradeColecoes.firstChild);
}

function obterIniciaisDoUsuario(nome) {
  return nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join("");
}

function fecharMenuConta({ devolverFoco = false } = {}) {
  if (!menuContaUsuario || !botaoContaUsuario) {
    return;
  }

  menuContaUsuario.hidden = true;
  botaoContaUsuario.setAttribute("aria-expanded", "false");

  if (devolverFoco) {
    botaoContaUsuario.focus();
  }
}

function atualizarContaNoHeader() {
  if (!botaoContaUsuario) {
    return;
  }

  const usuarioEstaLogado = Boolean(usuarioAtual);
  botaoContaUsuario.replaceChildren();
  botaoContaUsuario.classList.toggle("is-autenticado", usuarioEstaLogado);
  botaoContaUsuario.setAttribute("aria-expanded", "false");

  if (!usuarioEstaLogado) {
    const icone = document.createElement("span");
    const rotulo = document.createElement("span");
    const indicador = document.createElement("span");

    icone.className = "icone-conta-cta";
    icone.setAttribute("aria-hidden", "true");
    rotulo.className = "rotulo-conta-cta";
    rotulo.textContent = "Entrar na conta";
    indicador.className = "indicador-conta-cta";
    indicador.textContent = "→";
    indicador.setAttribute("aria-hidden", "true");

    botaoContaUsuario.append(icone, rotulo, indicador);
    botaoContaUsuario.setAttribute("aria-label", "Entrar na conta");
    botaoContaUsuario.removeAttribute("aria-haspopup");
    menuContaUsuario.hidden = true;
    return;
  }

  const avatar = document.createElement("span");
  const saudacao = document.createElement("span");
  const seta = document.createElement("span");

  avatar.className = "avatar-usuario";
  avatar.textContent = obterIniciaisDoUsuario(usuarioAtual.nome);
  avatar.setAttribute("aria-hidden", "true");
  saudacao.className = "saudacao-usuario";
  saudacao.textContent = `Olá, ${usuarioAtual.nome}`;
  saudacao.title = `Olá, ${usuarioAtual.nome}`;
  seta.className = "seta-conta";
  seta.setAttribute("aria-hidden", "true");

  botaoContaUsuario.append(avatar, saudacao, seta);
  botaoContaUsuario.setAttribute("aria-label", `Abrir opções da conta de ${usuarioAtual.nome}`);
  botaoContaUsuario.setAttribute("aria-haspopup", "menu");
  menuContaUsuario.hidden = true;
}

function entrarNaConta() {
  const resposta = window.prompt("Qual é o seu nome?");
  const nome = resposta?.trim();

  if (!nome) {
    if (resposta !== null) {
      mostrarFeedback("Informe seu nome para entrar.");
    }
    return;
  }

  usuarioAtual = {
    id: gerarId("usuario"),
    nome,
  };
  salvarUsuario(usuarioAtual);
  atualizarContaNoHeader();
  renderizarColecoesDoUsuario();
  void carregarMeusAnunciosDaApi();
  mostrarFeedback(`Olá, ${usuarioAtual.nome}. Você entrou na sua conta.`);
}

function sairDaConta() {
  removerUsuarioSalvo();
  usuarioAtual = null;
  sequenciaRequisicaoUsuario += 1;
  cacheAnunciosUsuarioApi = [];
  fecharMenuConta();
  atualizarContaNoHeader();
  renderizarMeusAnuncios();
  renderizarColecoesDoUsuario();
  mostrarFeedback("Você saiu da sua conta.");
  botaoContaUsuario?.focus();
}

function inicializarContaUsuario() {
  if (!botaoContaUsuario) {
    return;
  }

  botaoContaUsuario.addEventListener("click", () => {
    if (!usuarioAtual) {
      entrarNaConta();
      return;
    }

    const menuEstaAberto = !menuContaUsuario.hidden;
    menuContaUsuario.hidden = menuEstaAberto;
    botaoContaUsuario.setAttribute("aria-expanded", String(!menuEstaAberto));
  });

  botaoSairConta?.addEventListener("click", sairDaConta);

  document.addEventListener("click", (evento) => {
    if (
      usuarioAtual &&
      !menuContaUsuario.hidden &&
      !containerContaUsuario?.contains(evento.target)
    ) {
      fecharMenuConta();
    }
  });

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && !menuContaUsuario.hidden) {
      fecharMenuConta({ devolverFoco: true });
    }
  });

  atualizarContaNoHeader();
}

function obterValorNumerico(valor) {
  const valorNormalizado = valor
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  if (valorNormalizado === "") {
    return NaN;
  }

  return Number(valorNormalizado);
}

function formatarValorComoMoeda() {
  if (!valorItem || valorItem.value === "") {
    return;
  }

  const valorNumerico = obterValorNumerico(valorItem.value);

  if (!Number.isFinite(valorNumerico) || valorNumerico < 0) {
    valorItem.value = "";
    return;
  }

  valorItem.value = formatadorMoeda.format(valorNumerico);
}

function sincronizarModalidadeComValor() {
  if (!valorItem || !modalidadeVenda || !modalidadeDoacao) {
    return;
  }

  modalidadeDoacao.addEventListener("change", () => {
    if (modalidadeDoacao.checked) {
      valorItem.value = formatadorMoeda.format(0);
    }
  });

  valorItem.addEventListener("input", () => {
    if (valorItem.value === "") {
      return;
    }

    const valorNumerico = obterValorNumerico(valorItem.value);

    if (valorNumerico === 0) {
      modalidadeDoacao.checked = true;
      return;
    }

    if (valorNumerico > 0) {
      modalidadeVenda.checked = true;
    }
  });

  valorItem.addEventListener("blur", formatarValorComoMoeda);
}

function campoEstaPreenchido(campo) {
  if (campo.type === "file") {
    return campo.files.length > 0;
  }

  if (campo === valorItem) {
    const valorNumerico = obterValorNumerico(campo.value);
    return campo.value.trim() !== "" && Number.isFinite(valorNumerico);
  }

  return campo.value.trim() !== "";
}

function obterMensagemDeCampo(campo) {
  const mensagensObrigatorias = {
    nome: "Informe o nome do item.",
    categoria: "Selecione uma categoria.",
    condicao: "Selecione a condição do item.",
    modalidade: "Escolha entre venda e doação.",
    valor: "Informe o valor do anúncio.",
    localizacao: "Informe o local de retirada.",
    descricao: "Descreva o estado e a utilidade do item.",
  };

  if (campo.type === "radio") {
    const selecionado = formularioNovoAnuncio.querySelector(
      `input[name="${campo.name}"]:checked`,
    );
    return selecionado ? "" : mensagensObrigatorias[campo.name];
  }

  if (!campoEstaPreenchido(campo)) {
    return mensagensObrigatorias[campo.name] || "Preencha este campo.";
  }

  if (campo === valorItem) {
    const valorNumerico = obterValorNumerico(campo.value);

    if (valorNumerico < 0) {
      return "Informe um valor igual ou maior que zero.";
    }

    if (modalidadeVenda?.checked && valorNumerico === 0) {
      return "Para venda, informe um valor maior que zero.";
    }
  }

  return "";
}

function obterCamposRelacionados(campo) {
  if (campo.type !== "radio") {
    return [campo];
  }

  return [
    ...formularioNovoAnuncio.querySelectorAll(
      `input[name="${campo.name}"]`,
    ),
  ];
}

function obterElementoErroCampo(campo) {
  const identificador = campo.type === "radio" ? campo.name : campo.id;
  const idErro = `erro-${identificador}`;
  let elementoErro = formularioNovoAnuncio.querySelector(`#${idErro}`);

  if (!elementoErro) {
    elementoErro = document.createElement("p");
    elementoErro.id = idErro;
    elementoErro.className = "erro-campo";
    elementoErro.hidden = true;

    const container =
      campo.type === "radio" ? campo.closest("fieldset") : campo.parentElement;
    container?.append(elementoErro);
  }

  for (const campoRelacionado of obterCamposRelacionados(campo)) {
    const descricoes = new Set(
      (campoRelacionado.getAttribute("aria-describedby") || "")
        .split(/\s+/)
        .filter(Boolean),
    );
    descricoes.add(idErro);
    campoRelacionado.setAttribute(
      "aria-describedby",
      [...descricoes].join(" "),
    );
  }

  return elementoErro;
}

function definirErroCampo(campo, mensagem) {
  const elementoErro = obterElementoErroCampo(campo);

  for (const campoRelacionado of obterCamposRelacionados(campo)) {
    campoRelacionado.setCustomValidity(mensagem);
    if (mensagem) {
      campoRelacionado.setAttribute("aria-invalid", "true");
    } else {
      campoRelacionado.removeAttribute("aria-invalid");
    }
  }

  elementoErro.textContent = mensagem;
  elementoErro.hidden = !mensagem;
}

function validarCampo(campo) {
  const mensagem = obterMensagemDeCampo(campo);
  definirErroCampo(campo, mensagem);
  return mensagem === "";
}

function validarCamposDoFormulario() {
  let primeiroCampoInvalido = null;
  const gruposValidados = new Set();

  for (const campo of formularioNovoAnuncio.elements) {
    if (!(campo instanceof HTMLElement) || campo.type === "file") {
      continue;
    }

    if (campo.type === "radio") {
      if (gruposValidados.has(campo.name)) {
        continue;
      }
      gruposValidados.add(campo.name);
    } else if (!campo.required) {
      continue;
    }

    if (!validarCampo(campo) && !primeiroCampoInvalido) {
      primeiroCampoInvalido = campo;
    }
  }

  return primeiroCampoInvalido;
}

function limparErrosDosCampos() {
  formularioNovoAnuncio
    .querySelectorAll(".erro-campo")
    .forEach((elementoErro) => {
      elementoErro.textContent = "";
      elementoErro.hidden = true;
    });

  formularioNovoAnuncio
    .querySelectorAll('[aria-invalid="true"]:not(#imagem-item)')
    .forEach((campo) => {
      campo.removeAttribute("aria-invalid");
      campo.setCustomValidity("");
    });
}

function mostrarAvisoNoBotao() {
  const textoOriginal = botaoPublicarAnuncio.dataset.textoOriginal;

  botaoPublicarAnuncio.textContent = "Revise os campos destacados";
  botaoPublicarAnuncio.classList.add("is-warning");

  window.clearTimeout(temporizadorAvisoBotao);
  temporizadorAvisoBotao = window.setTimeout(() => {
    botaoPublicarAnuncio.textContent = textoOriginal;
    botaoPublicarAnuncio.classList.remove("is-warning");
  }, 2600);
}

function mostrarFeedback(mensagem) {
  if (!feedbackAnuncio) {
    return;
  }

  feedbackAnuncio.textContent = mensagem;
  window.clearTimeout(temporizadorFeedback);
  temporizadorFeedback = window.setTimeout(() => {
    feedbackAnuncio.textContent = "";
  }, 5000);
}

function arquivoEhImagemPermitida(arquivo) {
  const tiposPermitidos = ["image/jpeg", "image/png"];
  const extensoesPermitidas = [".jpeg", ".jpg", ".png"];

  return (
    arquivo instanceof File &&
    tiposPermitidos.includes(arquivo.type.toLowerCase()) &&
    extensoesPermitidas.some((extensao) =>
      arquivo.name.toLowerCase().endsWith(extensao),
    )
  );
}

function converterArquivoParaDataUrl(arquivo) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();

    leitor.addEventListener(
      "load",
      () => {
        if (typeof leitor.result === "string") {
          resolve(leitor.result);
          return;
        }

        reject(new Error("A imagem não pôde ser convertida para envio."));
      },
      { once: true },
    );

    leitor.addEventListener(
      "error",
      () => {
        reject(new Error("A imagem não pôde ser lida para envio."));
      },
      { once: true },
    );

    leitor.addEventListener(
      "abort",
      () => {
        reject(new Error("A leitura da imagem foi interrompida."));
      },
      { once: true },
    );

    leitor.readAsDataURL(arquivo);
  });
}

async function obterErrosImagem(
  arquivo,
  { imagemObrigatoria = false } = {},
) {
  if (!arquivo) {
    return imagemObrigatoria ? [MENSAGEM_IMAGEM_OBRIGATORIA] : [];
  }

  const erros = [];
  const formatoPermitido = arquivoEhImagemPermitida(arquivo);

  if (!formatoPermitido) {
    erros.push(MENSAGEM_IMAGEM_INVALIDA);
  }

  if (arquivo.size > TAMANHO_MAXIMO_IMAGEM_BYTES) {
    erros.push(MENSAGEM_TAMANHO_IMAGEM_INVALIDO);
  }

  if (!formatoPermitido) {
    return erros;
  }

  return erros;
}

function exibirErrosDaImagem(erros) {
  if (!errosImagem) {
    return;
  }

  errosImagem.replaceChildren();
  errosImagem.hidden = erros.length === 0;

  if (erros.length === 0) {
    return;
  }

  const titulo = document.createElement("strong");
  titulo.textContent = "Corrija os itens abaixo antes de enviar:";
  const lista = document.createElement("ul");

  erros.forEach((erro) => {
    const item = document.createElement("li");
    item.textContent = erro;
    lista.append(item);
  });

  errosImagem.append(titulo, lista);
}

async function atualizarValidacaoDaImagem(
  { anunciarErro = false, imagemObrigatoria = false } = {},
) {
  if (!campoImagem) {
    return false;
  }

  const arquivo = campoImagem.files[0];
  const erros = await obterErrosImagem(arquivo, { imagemObrigatoria });
  const mensagemErro = erros.join(" ");
  const arquivoInvalido = erros.length > 0;

  campoImagem.setCustomValidity(mensagemErro);
  campoImagem.classList.toggle("is-invalid", Boolean(arquivoInvalido));

  if (arquivoInvalido) {
    campoImagem.setAttribute("aria-invalid", "true");
  } else {
    campoImagem.removeAttribute("aria-invalid");
  }

  exibirErrosDaImagem(erros);

  if (arquivoInvalido && anunciarErro) {
    mostrarFeedback(mensagemErro);
    campoImagem.reportValidity();
  }

  return Boolean(arquivo) && !arquivoInvalido;
}

function criarElemento(tag, classe, texto) {
  const elemento = document.createElement(tag);

  if (classe) {
    elemento.className = classe;
  }

  if (texto !== undefined) {
    elemento.textContent = texto;
  }

  return elemento;
}

function obterDadosVisuaisCategoria(categoria) {
  return categorias[categoria] || {
    nome: "Outros",
    emoji: "♻️",
    imagemPadrao: IMAGEM_PADRAO_ANUNCIO,
  };
}

function obterImagemDoAnuncio(anuncio) {
  if (typeof anuncio.imagemUrl === "string" && anuncio.imagemUrl.trim() !== "") {
    return anuncio.imagemUrl;
  }

  return obterDadosVisuaisCategoria(anuncio.categoria).imagemPadrao;
}

function criarMediaDoAnuncio(anuncio, classe) {
  const imagemUrl = obterImagemDoAnuncio(anuncio);
  const media = imagemUrl
    ? criarElemento("button", `${classe} botao-ampliar-imagem`)
    : criarElemento("div", classe);

  if (imagemUrl) {
    media.type = "button";
    media.dataset.anuncioId = anuncio.id;
    media.style.backgroundImage = `url("${imagemUrl}")`;
    media.style.backgroundPosition = "center";
    media.style.backgroundSize = "cover";
    media.setAttribute("aria-label", `Ampliar imagem de ${anuncio.nome}`);

    const dica = criarElemento("span", "dica-ampliar", "Ampliar imagem");
    media.append(dica);
  } else {
    const emoji = criarElemento(
      "span",
      classe === "card-media" ? "card-emoji" : "",
      obterDadosVisuaisCategoria(anuncio.categoria).emoji,
    );

    media.append(emoji);
    media.setAttribute("aria-hidden", "true");
  }

  return media;
}

function abrirImagemDoAnuncio(id, elementoAcionador) {
  const anuncio = [...cacheCatalogoApi, ...cacheAnunciosUsuarioApi].find(
    (item) => String(item.id) === String(id),
  );
  const imagemUrl = anuncio ? obterImagemDoAnuncio(anuncio) : "";

  if (!imagemUrl || !modalImagem || !imagemAmpliada || !tituloModalImagem) {
    return;
  }

  modalImagem.elementoAcionador = elementoAcionador;
  imagemAmpliada.src = imagemUrl;
  imagemAmpliada.alt = `Imagem ampliada de ${anuncio.nome}`;
  tituloModalImagem.textContent = anuncio.nome;
  document.body.classList.add("modal-aberto");
  modalImagem.showModal();
}

function fecharImagemAmpliada() {
  if (modalImagem?.open) {
    modalImagem.close();
  }
}

function inicializarVisualizacaoDeImagens() {
  if (!modalImagem || !botaoFecharModalImagem) {
    return;
  }

  [listaAnuncios, listaMeusAnuncios].forEach((lista) => {
    lista?.addEventListener("click", (evento) => {
      const botaoImagem = evento.target.closest(".botao-ampliar-imagem");

      if (botaoImagem && lista.contains(botaoImagem)) {
        abrirImagemDoAnuncio(botaoImagem.dataset.anuncioId, botaoImagem);
      }
    });
  });

  botaoFecharModalImagem.addEventListener("click", fecharImagemAmpliada);

  modalImagem.addEventListener("click", (evento) => {
    const clicouNoConteudo =
      evento.target.closest("#imagem-ampliada, #fechar-modal-imagem, #modal-imagem-titulo");

    if (!clicouNoConteudo) {
      fecharImagemAmpliada();
    }
  });

  modalImagem.addEventListener("close", () => {
    document.body.classList.remove("modal-aberto");
    imagemAmpliada.removeAttribute("src");
    modalImagem.elementoAcionador?.focus();
    modalImagem.elementoAcionador = null;
  });
}

function criarCardDaVitrine(anuncio) {
  const categoria = obterDadosVisuaisCategoria(anuncio.categoria);
  const card = criarElemento("article", "card-anuncio");
  const media = criarMediaDoAnuncio(anuncio, "card-media");
  const autor = criarElemento("div", "card-creators");
  const avatar = document.createElement("img");
  const categoriaTexto = criarElemento("p", "card-cat", categoria.nome);
  const titulo = criarElemento("h3", "", anuncio.nome);
  const informacoes = criarElemento(
    "p",
    "card-info",
    `${nomesCondicoes[anuncio.condicao] || anuncio.condicao} · ${anuncio.localizacao} · Por ${anuncio.usuarioNome}`,
  );
  const preco = criarElemento(
    "p",
    "card-price",
    anuncio.modalidade === "doacao"
      ? "Doação"
      : formatadorMoeda.format(anuncio.valor),
  );
  const detalhes = criarElemento("a", "btn-detalhes", "Ver detalhes");

  card.dataset.id = anuncio.id;
  card.dataset.categoria = anuncio.categoria;
  card.dataset.condicao = anuncio.condicao;
  card.dataset.modalidade = anuncio.modalidade;
  card.dataset.preco = String(anuncio.valor);

  avatar.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(anuncio.usuarioNome)}`;
  avatar.alt = "";
  autor.append(avatar);
  media.append(autor);

  detalhes.href = "#vitrine";
  card.append(media, categoriaTexto, titulo, informacoes, preco, detalhes);

  return card;
}

function criarCardDoUsuario(anuncio) {
  const card = criarElemento("article", "card-meu-anuncio");
  const media = criarMediaDoAnuncio(anuncio, "meu-anuncio-media");
  const detalhes = criarElemento("div", "meu-anuncio-detalhes");
  const status = criarElemento(
    "span",
    `status-badge ${anuncio.modalidade === "doacao" ? "doacao" : "ativo"}`,
    anuncio.modalidade === "doacao" ? "Doação" : "Ativo",
  );
  const titulo = criarElemento("h3", "", anuncio.nome);
  const preco =
    anuncio.modalidade === "doacao"
      ? "Grátis (Doação)"
      : formatadorMoeda.format(anuncio.valor);
  const informacoes = criarElemento(
    "p",
    "",
    `Preço: ${preco} · ${anuncio.localizacao}`,
  );
  const acoes = criarElemento("div", "meu-anuncio-acoes");
  const botaoExcluir = criarElemento("button", "btn-excluir", "Excluir");

  card.dataset.id = anuncio.id;
  botaoExcluir.type = "button";
  botaoExcluir.dataset.id = anuncio.id;
  botaoExcluir.setAttribute("aria-label", `Excluir ${anuncio.nome}`);

  detalhes.append(status, titulo, informacoes);
  acoes.append(botaoExcluir);
  card.append(media, detalhes, acoes);

  return card;
}

function criarEstadoVazio(mensagem) {
  return criarElemento("p", "estado-vazio", mensagem);
}

function normalizarTexto(texto) {
  return String(texto)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

function obterAnunciosVisiveis() {
  const termoNormalizado = normalizarTexto(termoBuscaVitrine);
  let itens = cacheCatalogoApi.map((anuncio, indice) => ({
    anuncio,
    indice,
  }));

  if (abaCatalogoAtiva === "recentes") {
    const primeiroIndiceRecente = Math.max(0, cacheCatalogoApi.length - 3);
    itens = itens.filter(({ indice }) => indice >= primeiroIndiceRecente);
  } else if (abaCatalogoAtiva === "venda" || abaCatalogoAtiva === "doacao") {
    itens = itens.filter(
      ({ anuncio }) => anuncio.modalidade === abaCatalogoAtiva,
    );
  }

  if (termoNormalizado) {
    itens = itens.filter(({ anuncio }) => {
      const categoria = obterDadosVisuaisCategoria(anuncio.categoria).nome;
      const condicao = nomesCondicoes[anuncio.condicao] || anuncio.condicao;
      const modalidade =
        anuncio.modalidade === "doacao" ? "Doação" : "Venda";
      const conteudoPesquisavel = [
        anuncio.nome,
        anuncio.descricao,
        anuncio.localizacao,
        anuncio.usuarioNome,
        categoria,
        condicao,
        modalidade,
      ]
        .map(normalizarTexto)
        .join(" ");

      return conteudoPesquisavel.includes(termoNormalizado);
    });
  }

  itens.sort((itemA, itemB) => {
    if (ordenacaoAtiva === "menor-preco") {
      return itemA.anuncio.valor - itemB.anuncio.valor;
    }

    if (ordenacaoAtiva === "maior-preco") {
      return itemB.anuncio.valor - itemA.anuncio.valor;
    }

    if (ordenacaoAtiva === "nome") {
      return ordenadorAlfabetico.compare(
        itemA.anuncio.nome,
        itemB.anuncio.nome,
      );
    }

    return itemB.indice - itemA.indice;
  });

  return itens.map(({ anuncio }) => anuncio);
}

function atualizarContadoresDosFiltros() {
  const contagensCategoria = {
    todas: cacheContagemApi.length,
    livros: 0,
    eletronicos: 0,
    casa: 0,
    moda: 0,
    outros: 0,
  };
  const contagensCondicao = {
    todas: cacheCatalogoApi.length,
    novo: 0,
    seminovo: 0,
    usado: 0,
  };
  const contagensModalidade = {
    todas: cacheCatalogoApi.length,
    venda: 0,
    doacao: 0,
  };

  cacheContagemApi.forEach((anuncio) => {
    const categoria = Object.hasOwn(categorias, anuncio.categoria)
      ? anuncio.categoria
      : "outros";

    contagensCategoria[categoria] += 1;
  });

  cacheCatalogoApi.forEach((anuncio) => {
    if (Object.hasOwn(contagensCondicao, anuncio.condicao)) {
      contagensCondicao[anuncio.condicao] += 1;
    }

    if (Object.hasOwn(contagensModalidade, anuncio.modalidade)) {
      contagensModalidade[anuncio.modalidade] += 1;
    }
  });

  filtrosCategoria.forEach((filtro) => {
    const contador = filtro.querySelector(".filtro-contagem");
    const categoria = filtro.dataset.categoriaFiltro;

    if (contador && Object.hasOwn(contagensCategoria, categoria)) {
      contador.textContent = String(contagensCategoria[categoria]);
    }
  });

  filtrosCondicao.forEach((filtro) => {
    const contador = filtro.querySelector(".filtro-contagem");
    const condicao = filtro.dataset.condicaoFiltro;

    if (contador && Object.hasOwn(contagensCondicao, condicao)) {
      contador.textContent = String(contagensCondicao[condicao]);
    }
  });

  filtrosModalidade.forEach((filtro) => {
    const contador = filtro.querySelector(".filtro-contagem");
    const modalidade = filtro.dataset.modalidadeFiltro;

    if (contador && Object.hasOwn(contagensModalidade, modalidade)) {
      contador.textContent = String(contagensModalidade[modalidade]);
    }
  });
}

function renderizarAnuncios() {
  if (!listaAnuncios) {
    return;
  }

  const anunciosVisiveis = obterAnunciosVisiveis();
  listaAnuncios.replaceChildren();

  if (anunciosVisiveis.length === 0) {
    const mensagem = termoBuscaVitrine
      ? `Nenhum anúncio encontrado para “${termoBuscaVitrine.trim()}”.`
      : "Nenhum anúncio disponível nesta seleção.";

    listaAnuncios.append(criarEstadoVazio(mensagem));
  } else {
    const fragmento = document.createDocumentFragment();

    anunciosVisiveis.forEach((anuncio) => {
      fragmento.append(criarCardDaVitrine(anuncio));
    });

    listaAnuncios.append(fragmento);
  }

  if (resultadosContagem) {
    const totalVisivel = anunciosVisiveis.length;
    const totalGeral = cacheCatalogoApi.length;

    if (totalVisivel === totalGeral) {
      resultadosContagem.textContent =
        totalVisivel === 1
          ? "Mostrando 1 resultado"
          : `Mostrando ${totalVisivel} resultados`;
    } else {
      resultadosContagem.textContent = `Mostrando ${totalVisivel} de ${totalGeral} resultados`;
    }
  }

  atualizarContadoresDosFiltros();
}

function inicializarControlesDaVitrine() {
  formularioBuscaVitrine?.addEventListener("submit", (evento) => {
    evento.preventDefault();
  });

  campoBuscaVitrine?.addEventListener("input", () => {
    termoBuscaVitrine = campoBuscaVitrine.value;
    renderizarAnuncios();
  });

  ordenacaoVitrine?.addEventListener("change", () => {
    ordenacaoAtiva = ordenacaoVitrine.value;
    renderizarAnuncios();
  });

  filtrosCategoria.forEach((filtro) => {
    filtro.addEventListener("click", (evento) => {
      evento.preventDefault();
      categoriaFiltroAtiva = filtro.dataset.categoriaFiltro;

      filtrosCategoria.forEach((item) => {
        const estaAtivo = item === filtro;
        item.classList.toggle("active", estaAtivo);

        if (estaAtivo) {
          item.setAttribute("aria-current", "true");
        } else {
          item.removeAttribute("aria-current");
        }
      });

      void carregarAnunciosDaApi();
    });
  });

  abasCatalogo.forEach((aba) => {
    aba.addEventListener("click", () => {
      abaCatalogoAtiva = aba.dataset.abaCatalogo;

      abasCatalogo.forEach((item) => {
        const estaAtiva = item === aba;
        item.classList.toggle("active", estaAtiva);
        item.setAttribute("aria-pressed", String(estaAtiva));
      });

      renderizarAnuncios();
    });
  });

  botoesLayout.forEach((botao) => {
    botao.addEventListener("click", () => {
      const visualizacaoEmLista = botao.dataset.layout === "lista";
      listaAnuncios?.classList.toggle(
        "visualizacao-lista",
        visualizacaoEmLista,
      );

      botoesLayout.forEach((item) => {
        const estaAtivo = item === botao;
        item.classList.toggle("active", estaAtivo);
        item.setAttribute("aria-pressed", String(estaAtivo));
      });
    });
  });
}

function renderizarMeusAnuncios() {
  if (!listaMeusAnuncios) {
    return;
  }

  listaMeusAnuncios.replaceChildren();

  if (!usuarioAtual) {
    listaMeusAnuncios.append(
      criarEstadoVazio("Entre para acompanhar os seus anúncios."),
    );
    return;
  }

  if (cacheAnunciosUsuarioApi.length === 0) {
    listaMeusAnuncios.append(
      criarEstadoVazio("Você ainda não publicou nenhum anúncio."),
    );
    return;
  }

  const fragmento = document.createDocumentFragment();

  cacheAnunciosUsuarioApi.forEach((anuncio) => {
    fragmento.append(criarCardDoUsuario(anuncio));
  });

  listaMeusAnuncios.append(fragmento);
}

async function criarAnuncio() {
  if (publicacaoEmAndamento) {
    return false;
  }

  if (!usuarioAtual) {
    mostrarFeedback("Entre na sua conta para publicar um anúncio.");
    botaoContaUsuario?.focus();
    return false;
  }

  const usuarioDoAnuncio = usuarioAtual;
  const dados = new FormData(formularioNovoAnuncio);
  const arquivoImagem = dados.get("imagem");
  const modalidade = dados.get("modalidade");
  const valor =
    modalidade === "doacao" ? 0 : obterValorNumerico(dados.get("valor"));

  if (!arquivoEhImagemPermitida(arquivoImagem)) {
    void atualizarValidacaoDaImagem({ anunciarErro: true });
    campoImagem?.focus();
    return false;
  }

  if (!Number.isFinite(valor) || valor < 0) {
    mostrarFeedback("Informe um valor válido para o anúncio.");
    valorItem.focus();
    return false;
  }

  window.clearTimeout(temporizadorAvisoBotao);
  publicacaoEmAndamento = true;
  botaoPublicarAnuncio.disabled = true;
  botaoPublicarAnuncio.setAttribute("aria-busy", "true");
  botaoPublicarAnuncio.textContent = "Publicando...";
  botaoPublicarAnuncio.classList.remove("is-warning");

  try {
    const imagemUrl = await converterArquivoParaDataUrl(arquivoImagem);
    const dadosDoAnuncio = {
      nome: dados.get("nome").trim(),
      categoria: dados.get("categoria"),
      condicao: dados.get("condicao"),
      modalidade,
      valor,
      localizacao: dados.get("localizacao").trim(),
      descricao: dados.get("descricao").trim(),
      imagemUrl,
      usuarioId: usuarioDoAnuncio.id,
      usuarioNome: usuarioDoAnuncio.nome,
    };
    const resposta = await requisitarApi("/api/anuncios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dadosDoAnuncio),
    });
    const novoAnuncio = normalizarAnuncioDaApi(resposta);

    await Promise.all([
      carregarAnunciosDaApi({ mostrarCarregamento: false }),
      carregarMeusAnunciosDaApi({ mostrarCarregamento: false }),
    ]);
    formularioNovoAnuncio.reset();
    limparErrosDosCampos();
    campoImagem?.setCustomValidity("");
    campoImagem?.classList.remove("is-invalid");
    campoImagem?.removeAttribute("aria-invalid");
    exibirErrosDaImagem([]);
    mostrarFeedback(`Anúncio “${novoAnuncio.nome}” publicado com sucesso.`);
    definirPainelAnuncioAberto(false);

    return true;
  } catch (erro) {
    console.error("Não foi possível publicar o anúncio.", erro);

    if (erro.status === 400) {
      const primeiroErroDeCampo = Object.values(
        erro.dados?.campos || {},
      ).find((mensagem) => typeof mensagem === "string");
      mostrarFeedback(
        primeiroErroDeCampo ||
          erro.dados?.erro ||
          "Revise os dados do anúncio e tente novamente.",
      );
    } else if (erro.status >= 500) {
      mostrarFeedback(
        "O servidor não conseguiu publicar o anúncio. Tente novamente.",
      );
    } else if (erro instanceof TypeError) {
      mostrarFeedback(
        "Não foi possível acessar o servidor. Verifique sua conexão e tente novamente.",
      );
    } else {
      mostrarFeedback(
        erro.message || "Não foi possível publicar o anúncio. Tente novamente.",
      );
    }

    return false;
  } finally {
    publicacaoEmAndamento = false;
    botaoPublicarAnuncio.disabled = false;
    botaoPublicarAnuncio.removeAttribute("aria-busy");
    botaoPublicarAnuncio.textContent =
      botaoPublicarAnuncio.dataset.textoOriginal;
  }
}

async function excluirAnuncio(id, botaoExcluir) {
  const idNormalizado = String(id);
  const anuncio = cacheAnunciosUsuarioApi.find(
    (item) => String(item.id) === idNormalizado,
  );

  if (!anuncio) {
    mostrarFeedback("O anúncio não foi encontrado.");
    return false;
  }

  if (!usuarioAtual || anuncio.usuarioId !== usuarioAtual.id) {
    mostrarFeedback("Você só pode excluir os seus próprios anúncios.");
    return false;
  }

  if (idsEmExclusao.has(idNormalizado)) {
    return false;
  }

  const confirmouExclusao = window.confirm(
    `Deseja excluir o anúncio “${anuncio.nome}”?`,
  );

  if (!confirmouExclusao) {
    return false;
  }

  idsEmExclusao.add(idNormalizado);

  if (botaoExcluir) {
    botaoExcluir.disabled = true;
    botaoExcluir.setAttribute("aria-busy", "true");
    botaoExcluir.textContent = "Excluindo...";
  }

  try {
    await requisitarApi(`/api/anuncios/${encodeURIComponent(idNormalizado)}`, {
      method: "DELETE",
      headers: {
        "X-Usuario-Id": usuarioAtual.id,
      },
    });

    const [catalogoAtualizado, anunciosDoUsuarioAtualizados] =
      await Promise.all([
        carregarAnunciosDaApi({ mostrarCarregamento: false }),
        carregarMeusAnunciosDaApi({ mostrarCarregamento: false }),
      ]);

    mostrarFeedback(
      catalogoAtualizado && anunciosDoUsuarioAtualizados
        ? `Anúncio “${anuncio.nome}” excluído.`
        : `Anúncio “${anuncio.nome}” excluído, mas não foi possível atualizar todas as listas.`,
    );
    return true;
  } catch (erro) {
    console.error("Não foi possível excluir o anúncio.", erro);

    if (erro.status === 400) {
      mostrarFeedback("O ID do anúncio é inválido.");
    } else if (erro.status === 401) {
      mostrarFeedback("Entre na sua conta para excluir um anúncio.");
    } else if (erro.status === 403) {
      mostrarFeedback("Você só pode excluir os seus próprios anúncios.");
    } else if (erro.status === 404) {
      mostrarFeedback(
        "Este anúncio não foi encontrado no servidor. Atualize a lista e tente novamente.",
      );
    } else if (erro.status >= 500) {
      mostrarFeedback(
        "O servidor não conseguiu excluir o anúncio. Tente novamente.",
      );
    } else if (erro instanceof TypeError) {
      mostrarFeedback(
        "Não foi possível acessar o servidor. Verifique sua conexão e tente novamente.",
      );
    } else {
      mostrarFeedback(
        erro.message || "Não foi possível excluir o anúncio. Tente novamente.",
      );
    }

    return false;
  } finally {
    idsEmExclusao.delete(idNormalizado);

    if (botaoExcluir?.isConnected) {
      botaoExcluir.disabled = false;
      botaoExcluir.removeAttribute("aria-busy");
      botaoExcluir.textContent = "Excluir";
    }
  }
}

function inicializarFormularioDeAnuncio() {
  if (!formularioNovoAnuncio || !botaoPublicarAnuncio) {
    return;
  }

  botaoPublicarAnuncio.dataset.textoOriginal =
    botaoPublicarAnuncio.textContent;

  campoImagem?.addEventListener("change", () => {
    void atualizarValidacaoDaImagem({ anunciarErro: true });
  });

  formularioNovoAnuncio.addEventListener("input", (evento) => {
    const campo = evento.target;

    if (
      campo instanceof HTMLInputElement ||
      campo instanceof HTMLSelectElement ||
      campo instanceof HTMLTextAreaElement
    ) {
      if (campo.type !== "file" && campo.getAttribute("aria-invalid") === "true") {
        validarCampo(campo);
      }

      if (
        campo === valorItem &&
        modalidadeVenda?.getAttribute("aria-invalid") === "true"
      ) {
        validarCampo(modalidadeVenda);
      }
    }
  });

  formularioNovoAnuncio.addEventListener("change", (evento) => {
    const campo = evento.target;

    if (
      (campo instanceof HTMLInputElement ||
        campo instanceof HTMLSelectElement) &&
      campo.type !== "file"
    ) {
      validarCampo(campo);

      if (
        campo.type === "radio" &&
        valorItem?.getAttribute("aria-invalid") === "true"
      ) {
        validarCampo(valorItem);
      }
    }
  });

  formularioNovoAnuncio.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const primeiroCampoIncompleto = validarCamposDoFormulario();
    const imagemValida = await atualizarValidacaoDaImagem({
      imagemObrigatoria: true,
    });

    if (primeiroCampoIncompleto || !imagemValida) {
      const primeiroCampoComErro =
        primeiroCampoIncompleto || campoImagem;
      primeiroCampoComErro?.focus();
      mostrarAvisoNoBotao();
      mostrarFeedback(
        primeiroCampoIncompleto
          ? "Revise os campos destacados e tente publicar novamente."
          : campoImagem.validationMessage || MENSAGEM_IMAGEM_INVALIDA,
      );
      return;
    }

    formatarValorComoMoeda();
    await criarAnuncio();
  });
}

function definirPainelAnuncioAberto(aberto, { moverFoco = true } = {}) {
  if (!painelNovoAnuncio || !botaoAbrirAnuncio) {
    return;
  }

  painelNovoAnuncio.hidden = !aberto;
  botaoAbrirAnuncio.setAttribute("aria-expanded", String(aberto));
  botaoAbrirAnuncio.textContent = aberto ? "Fechar formulário" : "Anunciar";

  if (!moverFoco) {
    return;
  }

  if (aberto) {
    const reduzirMovimento = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    painelNovoAnuncio.scrollIntoView({
      behavior: reduzirMovimento ? "auto" : "smooth",
      block: "start",
    });
    document.querySelector("#nome-item")?.focus({ preventScroll: true });
  } else {
    botaoAbrirAnuncio.focus();
  }
}

function mostrarFeedbackDaColecao(mensagem, { persistente = false } = {}) {
  if (!feedbackColecao) {
    return;
  }

  feedbackColecao.textContent = mensagem;
  window.clearTimeout(temporizadorFeedbackColecao);

  if (!persistente) {
    temporizadorFeedbackColecao = window.setTimeout(() => {
      feedbackColecao.textContent = "";
    }, 5000);
  }
}

function atualizarNumeracaoDosItens() {
  const itens = [...listaItensColecao.querySelectorAll(".item-colecao-linha")];
  const unicoItem = itens.length === 1;

  itens.forEach((item, indice) => {
    const numero = indice + 1;
    const titulo = item.querySelector(".item-colecao-titulo");
    const botaoRemover = item.querySelector(".botao-remover-item-colecao");

    if (titulo) {
      titulo.textContent = `Item ${numero}`;
    }

    if (botaoRemover) {
      botaoRemover.disabled = unicoItem;
      botaoRemover.setAttribute(
        "aria-label",
        unicoItem
          ? "Mantenha ao menos um item na coleção"
          : `Remover item ${numero}`,
      );
    }
  });
}

function criarLinhaDeItemColecao() {
  sequenciaItemColecao += 1;
  const identificador = sequenciaItemColecao;
  const linha = criarElemento("div", "item-colecao-linha");
  const cabecalho = criarElemento("div", "item-colecao-cabecalho");
  const titulo = criarElemento("h4", "item-colecao-titulo");
  const botaoRemover = criarElemento(
    "button",
    "botao-remover-item-colecao",
    "Remover",
  );
  const campos = criarElemento("div", "item-colecao-campos");
  const grupoNome = document.createElement("div");
  const rotuloNome = document.createElement("label");
  const campoNome = document.createElement("input");
  const erroNome = criarElemento("p", "erro-campo-colecao");
  const grupoCategoria = document.createElement("div");
  const rotuloCategoria = document.createElement("label");
  const campoCategoria = document.createElement("select");
  const erroCategoria = criarElemento("p", "erro-campo-colecao");
  const opcoesCategoria = [
    ["", "Selecione uma categoria"],
    ["livros", "Livros e papelaria"],
    ["eletronicos", "Eletrônicos"],
    ["casa", "Casa e decoração"],
    ["moda", "Moda e acessórios"],
    ["outros", "Outros"],
  ];
  const idNome = `nome-item-colecao-${identificador}`;
  const idCategoria = `categoria-item-colecao-${identificador}`;
  const idErroNome = `erro-${idNome}`;
  const idErroCategoria = `erro-${idCategoria}`;

  linha.dataset.itemColecao = String(identificador);
  botaoRemover.type = "button";
  rotuloNome.htmlFor = idNome;
  rotuloNome.textContent = "Nome do item";
  campoNome.id = idNome;
  campoNome.name = `itemNome-${identificador}`;
  campoNome.type = "text";
  campoNome.required = true;
  campoNome.maxLength = 80;
  campoNome.autocomplete = "off";
  campoNome.setAttribute("autocapitalize", "sentences");
  campoNome.placeholder = "Ex.: Livro de cálculo";
  campoNome.dataset.tipoCampoColecao = "nomeItem";
  campoNome.setAttribute("aria-describedby", idErroNome);
  erroNome.id = idErroNome;
  erroNome.hidden = true;

  rotuloCategoria.htmlFor = idCategoria;
  rotuloCategoria.textContent = "Categoria";
  campoCategoria.id = idCategoria;
  campoCategoria.name = `itemCategoria-${identificador}`;
  campoCategoria.required = true;
  campoCategoria.dataset.tipoCampoColecao = "categoriaItem";
  campoCategoria.setAttribute("aria-describedby", idErroCategoria);
  erroCategoria.id = idErroCategoria;
  erroCategoria.hidden = true;

  opcoesCategoria.forEach(([valor, texto]) => {
    const opcao = document.createElement("option");
    opcao.value = valor;
    opcao.textContent = texto;

    if (!valor) {
      opcao.disabled = true;
      opcao.selected = true;
    }

    campoCategoria.append(opcao);
  });

  cabecalho.append(titulo, botaoRemover);
  grupoNome.append(rotuloNome, campoNome, erroNome);
  grupoCategoria.append(rotuloCategoria, campoCategoria, erroCategoria);
  campos.append(grupoNome, grupoCategoria);
  linha.append(cabecalho, campos);

  return linha;
}

function adicionarLinhaDeItemColecao({ moverFoco = true } = {}) {
  if (!listaItensColecao) {
    return;
  }

  const linha = criarLinhaDeItemColecao();
  listaItensColecao.append(linha);
  atualizarNumeracaoDosItens();

  if (moverFoco) {
    linha.querySelector("input")?.focus();
    mostrarFeedbackDaColecao("Novo item adicionado à coleção.");
  }
}

function removerLinhaDeItemColecao(botaoRemover) {
  const linhas = [...listaItensColecao.querySelectorAll(".item-colecao-linha")];

  if (linhas.length <= 1) {
    return;
  }

  const linha = botaoRemover.closest(".item-colecao-linha");
  const indice = linhas.indexOf(linha);
  linha?.remove();
  atualizarNumeracaoDosItens();

  const linhasRestantes = [
    ...listaItensColecao.querySelectorAll(".item-colecao-linha"),
  ];
  const linhaParaFoco =
    linhasRestantes[Math.min(indice, linhasRestantes.length - 1)];
  linhaParaFoco?.querySelector("input")?.focus();
  mostrarFeedbackDaColecao("Item removido da coleção.");
}

function definirErroDoCampoColecao(campo, mensagem) {
  const idErro = (campo.getAttribute("aria-describedby") || "")
    .split(/\s+/)
    .find((id) => id.startsWith("erro-"));
  const elementoErro = idErro ? document.getElementById(idErro) : null;

  campo.setCustomValidity(mensagem);
  campo.toggleAttribute("aria-invalid", Boolean(mensagem));

  if (elementoErro) {
    elementoErro.textContent = mensagem;
    elementoErro.hidden = !mensagem;
  }
}

function validarCampoDaColecao(campo) {
  const mensagens = {
    nomeColecao: "Informe o nome da coleção.",
    nomeItem: "Informe o nome deste item.",
    categoriaItem: "Selecione a categoria deste item.",
  };
  const tipo = campo.dataset.tipoCampoColecao || "nomeColecao";
  const mensagem = campo.value.trim() ? "" : mensagens[tipo];
  definirErroDoCampoColecao(campo, mensagem);
  return !mensagem;
}

function validarFormularioDaColecao() {
  let primeiroCampoInvalido = null;

  formularioNovaColecao
    .querySelectorAll("input[required], select[required]")
    .forEach((campo) => {
      if (!validarCampoDaColecao(campo) && !primeiroCampoInvalido) {
        primeiroCampoInvalido = campo;
      }
    });

  return primeiroCampoInvalido;
}

function limparFormularioDaColecao() {
  formularioNovaColecao.reset();
  formularioNovaColecao
    .querySelectorAll('[aria-invalid="true"]')
    .forEach((campo) => {
      campo.removeAttribute("aria-invalid");
      campo.setCustomValidity("");
    });
  listaItensColecao.replaceChildren();
  adicionarLinhaDeItemColecao({ moverFoco: false });
}

function criarColecao() {
  if (!usuarioAtual) {
    mostrarFeedbackDaColecao(
      "Entre na sua conta para criar uma coleção.",
      { persistente: true },
    );
    botaoContaUsuario?.focus();
    return false;
  }

  const itens = [
    ...listaItensColecao.querySelectorAll(".item-colecao-linha"),
  ].map((linha) => ({
    nome: linha.querySelector("input").value.trim(),
    categoria: linha.querySelector("select").value,
  }));
  const colecao = {
    id: gerarId("colecao"),
    usuarioId: usuarioAtual.id,
    usuarioNome: usuarioAtual.nome,
    nome: campoNomeColecao.value.trim(),
    itens,
    criadaEm: new Date().toISOString(),
  };
  const colecoes = lerColecoesSalvas();

  colecoes.push(colecao);

  if (!salvarColecoes(colecoes)) {
    mostrarFeedbackDaColecao(
      "Não foi possível salvar a coleção. Verifique o espaço disponível no navegador.",
      { persistente: true },
    );
    return false;
  }

  renderizarColecoesDoUsuario();
  limparFormularioDaColecao();
  mostrarFeedbackDaColecao(`Coleção “${colecao.nome}” criada com sucesso.`);

  const reduzirMovimento = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  secaoColecoes?.scrollIntoView({
    behavior: reduzirMovimento ? "auto" : "smooth",
    block: "start",
  });

  return true;
}

function definirPainelColecaoAberto(aberto, { moverFoco = true } = {}) {
  if (!painelNovaColecao || !botaoCriarColecao) {
    return;
  }

  painelNovaColecao.hidden = !aberto;
  botaoCriarColecao.setAttribute("aria-expanded", String(aberto));
  botaoCriarColecao.textContent = aberto
    ? "Fechar coleção"
    : "Criar Coleção";

  if (!moverFoco) {
    return;
  }

  if (aberto) {
    const reduzirMovimento = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    painelNovaColecao.scrollIntoView({
      behavior: reduzirMovimento ? "auto" : "smooth",
      block: "start",
    });
    campoNomeColecao?.focus({ preventScroll: true });
  } else {
    botaoCriarColecao.focus();
  }
}

function inicializarFormularioDaColecao() {
  if (
    !formularioNovaColecao ||
    !listaItensColecao ||
    !botaoAdicionarItemColecao ||
    !botaoSalvarColecao
  ) {
    return;
  }

  adicionarLinhaDeItemColecao({ moverFoco: false });

  botaoAdicionarItemColecao.addEventListener("click", () => {
    adicionarLinhaDeItemColecao();
  });

  listaItensColecao.addEventListener("click", (evento) => {
    const botaoRemover = evento.target.closest(
      ".botao-remover-item-colecao",
    );

    if (botaoRemover && listaItensColecao.contains(botaoRemover)) {
      removerLinhaDeItemColecao(botaoRemover);
    }
  });

  formularioNovaColecao.addEventListener("input", (evento) => {
    const campo = evento.target.closest(
      "input[required], select[required]",
    );

    if (campo && formularioNovaColecao.contains(campo)) {
      validarCampoDaColecao(campo);
    }
  });

  formularioNovaColecao.addEventListener("change", (evento) => {
    const campo = evento.target.closest(
      "input[required], select[required]",
    );

    if (campo && formularioNovaColecao.contains(campo)) {
      validarCampoDaColecao(campo);
    }
  });

  formularioNovaColecao.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const primeiroCampoInvalido = validarFormularioDaColecao();

    if (primeiroCampoInvalido) {
      mostrarFeedbackDaColecao(
        "Revise os campos destacados antes de criar a coleção.",
      );
      primeiroCampoInvalido.focus();
      return;
    }

    criarColecao();
  });
}

function inicializarPainelNovoAnuncio() {
  if (!painelNovoAnuncio || !botaoAbrirAnuncio) {
    return;
  }

  botaoAbrirAnuncio.addEventListener("click", () => {
    if (painelNovoAnuncio.hidden) {
      definirPainelColecaoAberto(false, { moverFoco: false });
    }
    definirPainelAnuncioAberto(painelNovoAnuncio.hidden);
  });

  botaoFecharAnuncio?.addEventListener("click", () => {
    definirPainelAnuncioAberto(false);
  });

  botaoCriarColecao?.addEventListener("click", () => {
    const deveAbrir = painelNovaColecao?.hidden;

    if (deveAbrir) {
      definirPainelAnuncioAberto(false, { moverFoco: false });
    }

    definirPainelColecaoAberto(Boolean(deveAbrir));
  });

  botaoFecharColecao?.addEventListener("click", () => {
    definirPainelColecaoAberto(false);
  });

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && !painelNovoAnuncio.hidden) {
      definirPainelAnuncioAberto(false);
    } else if (evento.key === "Escape" && !painelNovaColecao?.hidden) {
      definirPainelColecaoAberto(false);
    }
  });

}

function inicializarExclusaoDeAnuncios() {
  if (!listaMeusAnuncios) {
    return;
  }

  listaMeusAnuncios.addEventListener("click", (evento) => {
    const botaoExcluir = evento.target.closest(".btn-excluir");

    if (!botaoExcluir || !listaMeusAnuncios.contains(botaoExcluir)) {
      return;
    }

    void excluirAnuncio(botaoExcluir.dataset.id, botaoExcluir);
  });
}

function definirMenuPrincipalAberto(aberto, { devolverFoco = false } = {}) {
  if (!botaoMenuPrincipal || !navegacaoPrincipal) {
    return;
  }

  const menuCompactoAtivo = mediaMenuCompacto.matches;
  const menuDeveAbrir = menuCompactoAtivo && aberto;

  botaoMenuPrincipal.hidden = !menuCompactoAtivo;
  botaoMenuPrincipal.setAttribute("aria-expanded", String(menuDeveAbrir));
  botaoMenuPrincipal.setAttribute(
    "aria-label",
    menuDeveAbrir ? "Fechar menu principal" : "Abrir menu principal",
  );
  navegacaoPrincipal.hidden = menuCompactoAtivo && !menuDeveAbrir;

  if (devolverFoco && menuCompactoAtivo) {
    botaoMenuPrincipal.focus();
  }
}

function inicializarNavegacaoResponsiva() {
  if (!headerPrincipal || !botaoMenuPrincipal || !navegacaoPrincipal) {
    return;
  }

  botaoMenuPrincipal.addEventListener("click", () => {
    const menuEstaAberto =
      botaoMenuPrincipal.getAttribute("aria-expanded") === "true";
    definirMenuPrincipalAberto(!menuEstaAberto);
  });

  navegacaoPrincipal.addEventListener("click", (evento) => {
    if (evento.target.closest("a")) {
      definirMenuPrincipalAberto(false);
    }
  });

  document.addEventListener("click", (evento) => {
    const menuEstaAberto =
      botaoMenuPrincipal.getAttribute("aria-expanded") === "true";

    if (
      menuEstaAberto &&
      !navegacaoPrincipal.contains(evento.target) &&
      !botaoMenuPrincipal.contains(evento.target)
    ) {
      definirMenuPrincipalAberto(false);
    }
  });

  document.addEventListener("keydown", (evento) => {
    if (
      evento.key === "Escape" &&
      botaoMenuPrincipal.getAttribute("aria-expanded") === "true"
    ) {
      definirMenuPrincipalAberto(false, { devolverFoco: true });
    }
  });

  mediaMenuCompacto.addEventListener("change", () => {
    definirMenuPrincipalAberto(false);
  });

  definirMenuPrincipalAberto(false);
}

function atualizarEstadoDoHeader() {
  if (!headerPrincipal) {
    return;
  }

  headerPrincipal.classList.toggle("is-scrolled", window.scrollY > 50);
  scrollHeaderAgendado = false;
}

function inicializarHeaderFixo() {
  if (!headerPrincipal) {
    return;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (scrollHeaderAgendado) {
        return;
      }

      scrollHeaderAgendado = true;
      window.requestAnimationFrame(atualizarEstadoDoHeader);
    },
    { passive: true },
  );

  atualizarEstadoDoHeader();
}

sincronizarModalidadeComValor();
inicializarContaUsuario();
inicializarPainelNovoAnuncio();
inicializarFormularioDeAnuncio();
inicializarFormularioDaColecao();
inicializarExclusaoDeAnuncios();
inicializarVisualizacaoDeImagens();
inicializarControlesDaVitrine();
inicializarNavegacaoResponsiva();
inicializarHeaderFixo();
renderizarColecoesDoUsuario();
void carregarAnunciosDaApi();
void carregarMeusAnunciosDaApi();
