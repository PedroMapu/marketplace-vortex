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
const secaoColecoes = document.querySelector("#colecoes-destaque");
const listaAnuncios = document.querySelector("#lista-anuncios");
const listaMeusAnuncios = document.querySelector("#lista-meus-anuncios");
const resultadosContagem = document.querySelector("#resultados-contagem");
const feedbackAnuncio = document.querySelector("#feedback-anuncio");
const botaoContaUsuario = document.querySelector("#nome-usuario");
const containerContaUsuario = document.querySelector(".conta-usuario");
const menuContaUsuario = document.querySelector("#menu-conta");
const botaoSairConta = document.querySelector("#botao-sair-conta");
const headerPrincipal = document.querySelector("header");
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
const MENSAGEM_IMAGEM_OBRIGATORIA = "Escolha uma imagem para o anúncio.";
const MENSAGEM_IMAGEM_INVALIDA = "Envie uma imagem PNG, JPG ou JPEG.";
const TAMANHO_MAXIMO_IMAGEM_BYTES = 5 * 1024 * 1024;
const MENSAGEM_TAMANHO_IMAGEM_INVALIDO =
  "Envie uma imagem de até 5 MB.";
const PROPORCAO_MINIMA_IMAGEM = 1;
const MENSAGEM_PROPORCAO_IMAGEM_INVALIDA =
  "Use uma imagem menos vertical. Proporção mínima visível: 1:1.";
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
    imagemUrl:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
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
    imagemUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
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
    imagemUrl:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80",
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
    imagemUrl:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
    usuarioId: "usuario-lucas",
    usuarioNome: "Lucas",
  },
];

const formatadorMoeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
const ordenadorAlfabetico = new Intl.Collator("pt-BR", {
  sensitivity: "base",
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

function removerUsuarioSalvo() {
  try {
    window.localStorage.removeItem(CHAVE_USUARIO);
  } catch (erro) {
    console.warn("Não foi possível remover o usuário salvo.", erro);
  }
}

let usuarioAtual = lerUsuarioSalvo();

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
  renderizarMeusAnuncios();
  mostrarFeedback(`Olá, ${usuarioAtual.nome}. Você entrou na sua conta.`);
}

function sairDaConta() {
  removerUsuarioSalvo();
  usuarioAtual = null;
  fecharMenuConta();
  atualizarContaNoHeader();
  renderizarMeusAnuncios();
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

function obterPrimeiroCampoIncompleto() {
  const camposObrigatorios = formularioNovoAnuncio.querySelectorAll(
    "input[required]:not([type='radio']), select[required], textarea[required]",
  );
  const modalidadeSelecionada = formularioNovoAnuncio.querySelector(
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

function lerDimensoesDaImagem(arquivo) {
  return new Promise((resolve, reject) => {
    const imagem = new Image();
    const url = URL.createObjectURL(arquivo);

    imagem.addEventListener(
      "load",
      () => {
        URL.revokeObjectURL(url);
        resolve({
          altura: imagem.naturalHeight,
          largura: imagem.naturalWidth,
        });
      },
      { once: true },
    );

    imagem.addEventListener(
      "error",
      () => {
        URL.revokeObjectURL(url);
        reject(new Error("Não foi possível ler as dimensões da imagem."));
      },
      { once: true },
    );

    imagem.src = url;
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

  try {
    const { altura, largura } = await lerDimensoesDaImagem(arquivo);
    const proporcao = largura / altura;

    if (!Number.isFinite(proporcao) || proporcao < PROPORCAO_MINIMA_IMAGEM) {
      erros.push(MENSAGEM_PROPORCAO_IMAGEM_INVALIDA);
    }
  } catch (erro) {
    console.warn("Não foi possível validar a proporção da imagem.", erro);
    erros.push(
      "Não foi possível validar a imagem. Escolha outro arquivo PNG, JPG ou JPEG.",
    );
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
  const anuncio = anuncios.find((item) => item.id === String(id));
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
  let itens = anuncios.map((anuncio, indice) => ({ anuncio, indice }));

  if (categoriaFiltroAtiva !== "todas") {
    itens = itens.filter(({ anuncio }) => {
      const categoriaDoAnuncio = Object.hasOwn(categorias, anuncio.categoria)
        ? anuncio.categoria
        : "outros";

      return categoriaDoAnuncio === categoriaFiltroAtiva;
    });
  }

  if (abaCatalogoAtiva === "recentes") {
    const primeiroIndiceRecente = Math.max(0, anuncios.length - 3);
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
    todas: anuncios.length,
    livros: 0,
    eletronicos: 0,
    casa: 0,
    moda: 0,
    outros: 0,
  };
  const contagensCondicao = {
    todas: anuncios.length,
    novo: 0,
    seminovo: 0,
    usado: 0,
  };
  const contagensModalidade = {
    todas: anuncios.length,
    venda: 0,
    doacao: 0,
  };

  anuncios.forEach((anuncio) => {
    const categoria = Object.hasOwn(categorias, anuncio.categoria)
      ? anuncio.categoria
      : "outros";

    contagensCategoria[categoria] += 1;

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
    const totalGeral = anuncios.length;

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

      renderizarAnuncios();
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

  const meusAnuncios = anuncios.filter(
    (anuncio) => anuncio.usuarioId === usuarioAtual.id,
  );

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
  if (!usuarioAtual) {
    mostrarFeedback("Entre na sua conta para publicar um anúncio.");
    botaoContaUsuario?.focus();
    return false;
  }

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
  formularioNovoAnuncio.reset();
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

  if (!usuarioAtual || anuncio.usuarioId !== usuarioAtual.id) {
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

  if (
    typeof anuncio.imagemUrl === "string" &&
    anuncio.imagemUrl.startsWith("blob:")
  ) {
    URL.revokeObjectURL(anuncio.imagemUrl);
  }

  renderizarAnuncios();
  renderizarMeusAnuncios();
  mostrarFeedback(`Anúncio “${anuncio.nome}” excluído.`);

  return true;
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

  formularioNovoAnuncio.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    if (!(await atualizarValidacaoDaImagem({ imagemObrigatoria: true }))) {
      mostrarFeedback(
        campoImagem.validationMessage || MENSAGEM_IMAGEM_INVALIDA,
      );
      campoImagem.focus();
      campoImagem.reportValidity();
      return;
    }

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

function inicializarPainelNovoAnuncio() {
  if (!painelNovoAnuncio || !botaoAbrirAnuncio) {
    return;
  }

  botaoAbrirAnuncio.addEventListener("click", () => {
    definirPainelAnuncioAberto(painelNovoAnuncio.hidden);
  });

  botaoFecharAnuncio?.addEventListener("click", () => {
    definirPainelAnuncioAberto(false);
  });

  botaoCriarColecao?.addEventListener("click", () => {
    const reduzirMovimento = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    secaoColecoes?.scrollIntoView({
      behavior: reduzirMovimento ? "auto" : "smooth",
      block: "start",
    });
  });

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && !painelNovoAnuncio.hidden) {
      definirPainelAnuncioAberto(false);
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

window.addEventListener("beforeunload", () => {
  anuncios.forEach((anuncio) => {
    if (
      typeof anuncio.imagemUrl === "string" &&
      anuncio.imagemUrl.startsWith("blob:")
    ) {
      URL.revokeObjectURL(anuncio.imagemUrl);
    }
  });
});

sincronizarModalidadeComValor();
inicializarContaUsuario();
inicializarPainelNovoAnuncio();
inicializarFormularioDeAnuncio();
inicializarExclusaoDeAnuncios();
inicializarVisualizacaoDeImagens();
inicializarControlesDaVitrine();
inicializarHeaderFixo();
renderizarAnuncios();
renderizarMeusAnuncios();
