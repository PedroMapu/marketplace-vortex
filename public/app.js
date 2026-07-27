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
let termoBuscaVitrine = "";
let abaCatalogoAtiva = "todos";
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
  const media = anuncio.imagemUrl
    ? criarElemento("button", `${classe} botao-ampliar-imagem`)
    : criarElemento("div", classe);

  if (anuncio.imagemUrl) {
    media.type = "button";
    media.dataset.anuncioId = anuncio.id;
    media.style.backgroundImage = `url("${anuncio.imagemUrl}")`;
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

  if (!anuncio?.imagemUrl || !modalImagem || !imagemAmpliada || !tituloModalImagem) {
    return;
  }

  modalImagem.elementoAcionador = elementoAcionador;
  imagemAmpliada.src = anuncio.imagemUrl;
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

  const arquivoEhPng =
    arquivoImagem instanceof File &&
    arquivoImagem.type === "image/png" &&
    arquivoImagem.name.toLowerCase().endsWith(".png");

  if (!arquivoEhPng) {
    mostrarFeedback("Escolha uma imagem no formato PNG.");
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
inicializarVisualizacaoDeImagens();
inicializarControlesDaVitrine();
inicializarHeaderFixo();
renderizarAnuncios();
renderizarMeusAnuncios();
