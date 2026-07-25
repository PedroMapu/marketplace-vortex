const valorItem = document.querySelector("#valor-item");
const modalidadeVenda = document.querySelector("#modalidade-venda");
const modalidadeDoacao = document.querySelector("#modalidade-doacao");
const formularioAnuncio = document.querySelector("#formulario-anuncio");
const botaoPublicarAnuncio = document.querySelector("#botao-publicar-anuncio");
const listaAnuncios = document.querySelector("#lista-anuncios");
const listaMeusAnuncios = document.querySelector("#lista-meus-anuncios");
const resultadosContagem = document.querySelector("#resultados-contagem");
const feedbackAnuncio = document.querySelector("#feedback-anuncio");
const nomeUsuario = document.querySelector("#nome-usuario");
const headerPrincipal = document.querySelector("header");

const CHAVE_USUARIO = "marketplace-vortex:usuario";
const categorias = {
  livros: { nome: "Livros e papelaria", emoji: "📚" },
  eletronicos: { nome: "Eletrônicos", emoji: "🎧" },
  casa: { nome: "Casa e decoração", emoji: "🪴" },
  moda: { nome: "Moda e acessórios", emoji: "🎒" },
};
const nomesCondicoes = {
  novo: "Novo",
  seminovo: "Seminovo",
  usado: "Usado",
};

let temporizadorAvisoBotao;
let temporizadorFeedback;
let scrollHeaderAgendado = false;
let anuncios = [
  {
    id: "anuncio-exemplo-1",
    nome: "Kit de livros para Cálculo I",
    categoria: "livros",
    condicao: "seminovo",
    modalidade: "venda",
    valor: 45,
    localizacao: "Biblioteca Central",
    descricao: "Livros usados durante o primeiro semestre.",
    imagemUrl: "",
    usuarioId: "usuario-ana",
    usuarioNome: "Ana",
  },
  {
    id: "anuncio-exemplo-2",
    nome: "Fone de ouvido Bluetooth",
    categoria: "eletronicos",
    condicao: "usado",
    modalidade: "venda",
    valor: 220,
    localizacao: "Centro de Convivência",
    descricao: "Fone funcionando e com marcas leves de uso.",
    imagemUrl: "",
    usuarioId: "usuario-carla",
    usuarioNome: "Carla",
  },
  {
    id: "anuncio-exemplo-3",
    nome: "Vasos decorativos",
    categoria: "casa",
    condicao: "seminovo",
    modalidade: "doacao",
    valor: 0,
    localizacao: "Bloco H",
    descricao: "Conjunto de vasos disponível para doação.",
    imagemUrl: "",
    usuarioId: "usuario-elisa",
    usuarioNome: "Elisa",
  },
  {
    id: "anuncio-exemplo-4",
    nome: "Mochila para notebook",
    categoria: "moda",
    condicao: "novo",
    modalidade: "venda",
    valor: 60,
    localizacao: "Bloco Q",
    descricao: "Mochila nova com compartimento acolchoado.",
    imagemUrl: "",
    usuarioId: "usuario-lucas",
    usuarioNome: "Lucas",
  },
];

const formatadorMoeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

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

function obterUsuarioAtual() {
  const usuarioSalvo = lerUsuarioSalvo();

  if (usuarioSalvo) {
    return usuarioSalvo;
  }

  const resposta = window.prompt("Qual é o seu nome?");
  const nome = resposta?.trim() || "Visitante";
  const novoUsuario = {
    id: gerarId("usuario"),
    nome,
  };

  salvarUsuario(novoUsuario);
  return novoUsuario;
}

const usuarioAtual = obterUsuarioAtual();

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

function obterPrimeiroCampoIncompleto() {
  const camposObrigatorios = formularioAnuncio.querySelectorAll(
    "input[required]:not([type='radio']), select[required], textarea[required]",
  );
  const modalidadeSelecionada = formularioAnuncio.querySelector(
    "input[name='modalidade']:checked",
  );

  for (const campo of camposObrigatorios) {
    if (!campoEstaPreenchido(campo)) {
      return campo;
    }
  }

  if (!modalidadeSelecionada) {
    return modalidadeVenda;
  }

  return null;
}

function mostrarAvisoNoBotao() {
  const textoOriginal = botaoPublicarAnuncio.dataset.textoOriginal;

  botaoPublicarAnuncio.textContent = "Preencha tudo antes de publicar";
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
  };
}

function criarMediaDoAnuncio(anuncio, classe) {
  const media = criarElemento("div", classe);

  if (anuncio.imagemUrl) {
    media.style.backgroundImage = `url("${anuncio.imagemUrl}")`;
    media.style.backgroundPosition = "center";
    media.style.backgroundSize = "cover";
    media.setAttribute("role", "img");
    media.setAttribute("aria-label", `Imagem de ${anuncio.nome}`);
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

function renderizarAnuncios() {
  if (!listaAnuncios) {
    return;
  }

  listaAnuncios.replaceChildren();

  if (anuncios.length === 0) {
    listaAnuncios.append(criarEstadoVazio("Nenhum anúncio disponível."));
  } else {
    const fragmento = document.createDocumentFragment();

    anuncios.forEach((anuncio) => {
      fragmento.append(criarCardDaVitrine(anuncio));
    });

    listaAnuncios.append(fragmento);
  }

  if (resultadosContagem) {
    const total = anuncios.length;
    resultadosContagem.textContent =
      total === 1 ? "Mostrando 1 resultado" : `Mostrando ${total} resultados`;
  }
}

function renderizarMeusAnuncios() {
  if (!listaMeusAnuncios) {
    return;
  }

  const meusAnuncios = anuncios.filter(
    (anuncio) => anuncio.usuarioId === usuarioAtual.id,
  );

  listaMeusAnuncios.replaceChildren();

  if (meusAnuncios.length === 0) {
    listaMeusAnuncios.append(
      criarEstadoVazio("Você ainda não publicou nenhum anúncio."),
    );
    return;
  }

  const fragmento = document.createDocumentFragment();

  meusAnuncios.forEach((anuncio) => {
    fragmento.append(criarCardDoUsuario(anuncio));
  });

  listaMeusAnuncios.append(fragmento);
}

function criarAnuncio() {
  const dados = new FormData(formularioAnuncio);
  const arquivoImagem = dados.get("imagem");
  const modalidade = dados.get("modalidade");
  const valor =
    modalidade === "doacao" ? 0 : obterValorNumerico(dados.get("valor"));

  if (!(arquivoImagem instanceof File) || !arquivoImagem.type.startsWith("image/")) {
    mostrarFeedback("Escolha um arquivo de imagem válido.");
    document.querySelector("#imagem-item")?.focus();
    return false;
  }

  if (!Number.isFinite(valor) || valor < 0) {
    mostrarFeedback("Informe um valor válido para o anúncio.");
    valorItem.focus();
    return false;
  }

  const novoAnuncio = {
    id: gerarId("anuncio"),
    nome: dados.get("nome").trim(),
    categoria: dados.get("categoria"),
    condicao: dados.get("condicao"),
    modalidade,
    valor,
    localizacao: dados.get("localizacao").trim(),
    descricao: dados.get("descricao").trim(),
    imagemUrl: URL.createObjectURL(arquivoImagem),
    usuarioId: usuarioAtual.id,
    usuarioNome: usuarioAtual.nome,
  };

  anuncios.push(novoAnuncio);
  renderizarAnuncios();
  renderizarMeusAnuncios();
  formularioAnuncio.reset();
  mostrarFeedback(`Anúncio “${novoAnuncio.nome}” publicado com sucesso.`);
  botaoPublicarAnuncio.textContent =
    botaoPublicarAnuncio.dataset.textoOriginal;
  botaoPublicarAnuncio.classList.remove("is-warning");

  return true;
}

function excluirAnuncio(id) {
  const anuncio = anuncios.find((item) => item.id === String(id));

  if (!anuncio) {
    mostrarFeedback("O anúncio não foi encontrado.");
    return false;
  }

  if (anuncio.usuarioId !== usuarioAtual.id) {
    mostrarFeedback("Você só pode excluir os seus próprios anúncios.");
    return false;
  }

  const confirmouExclusao = window.confirm(
    `Deseja excluir o anúncio “${anuncio.nome}”?`,
  );

  if (!confirmouExclusao) {
    return false;
  }

  anuncios = anuncios.filter((item) => item.id !== anuncio.id);

  if (anuncio.imagemUrl.startsWith("blob:")) {
    URL.revokeObjectURL(anuncio.imagemUrl);
  }

  renderizarAnuncios();
  renderizarMeusAnuncios();
  mostrarFeedback(`Anúncio “${anuncio.nome}” excluído.`);

  return true;
}

function inicializarFormularioDeAnuncio() {
  if (!formularioAnuncio || !botaoPublicarAnuncio) {
    return;
  }

  botaoPublicarAnuncio.dataset.textoOriginal =
    botaoPublicarAnuncio.textContent;

  formularioAnuncio.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const primeiroCampoIncompleto = obterPrimeiroCampoIncompleto();

    if (primeiroCampoIncompleto) {
      primeiroCampoIncompleto.focus();
      mostrarAvisoNoBotao();
      return;
    }

    formatarValorComoMoeda();
    criarAnuncio();
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

    excluirAnuncio(botaoExcluir.dataset.id);
  });
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

if (nomeUsuario) {
  nomeUsuario.textContent = `Olá, ${usuarioAtual.nome}`;
  nomeUsuario.href = "#meus-anuncios";
}

window.addEventListener("beforeunload", () => {
  anuncios.forEach((anuncio) => {
    if (anuncio.imagemUrl.startsWith("blob:")) {
      URL.revokeObjectURL(anuncio.imagemUrl);
    }
  });
});

sincronizarModalidadeComValor();
inicializarFormularioDeAnuncio();
inicializarExclusaoDeAnuncios();
inicializarHeaderFixo();
renderizarAnuncios();
renderizarMeusAnuncios();
