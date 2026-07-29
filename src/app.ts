import {
  ehAbaCatalogo,
  ehCategoria,
  ehCategoriaFiltro,
  ehCondicao,
  ehModalidade,
  ehOrdenacaoCatalogo,
  type AbaCatalogo,
  type Anuncio,
  type Categoria,
  type CategoriaFiltro,
  type Colecao,
  type Condicao,
  type ErroApi,
  type ErroApiLegado,
  type IdentidadeUsuarioLegada,
  type ItemColecao,
  type MapaCategorias,
  type Modalidade,
  type NovoAnuncio,
  type OrdenacaoCatalogo,
  type RespostaExclusaoAnuncio,
  type Sessao,
  respostaEhOffline,
} from "./types";
import {
  contarColecoesLegadas,
  criarChaveDecisaoImportacao,
  criarMarcadorDecisaoImportacao,
  marcadorCorrespondeACombinacao,
  reassociarColecoesLegadas,
  type DecisaoImportacao,
} from "./legacy-import.mjs";
import { invalidarCacheCatalogoPublico } from "./pwa";

type CampoFormulario =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;
type CampoColecao = HTMLInputElement | HTMLSelectElement;
type DecodificadorResposta<T> = (dados: unknown) => T;
type DadosErroApi = ErroApi | ErroApiLegado;

interface ResultadoApi<T> {
  dados: T;
  offline: boolean;
}

interface ContextoImportacaoLegada {
  identidadeLegada: IdentidadeUsuarioLegada;
  usuarioAutenticado: Sessao["usuario"];
  quantidadeColecoes: number;
}

type ModoAutenticacao = "login" | "cadastro";
type EstadoBannerConectividade =
  | "offline"
  | "dados-salvos"
  | "reconectado";

class ErroRequisicaoApi extends Error {
  readonly name = "ErroRequisicaoApi";

  constructor(
    readonly status: number,
    readonly dados: DadosErroApi,
    readonly offline: boolean,
  ) {
    super(dados.erro);
  }
}

function ehErroRequisicaoApi(
  erro: unknown,
): erro is ErroRequisicaoApi {
  return erro instanceof ErroRequisicaoApi;
}

type DialogImagem = HTMLDialogElement & {
  elementoAcionador: HTMLElement | null;
};

const valorItem = document.querySelector<HTMLInputElement>("#valor-item");
const modalidadeVenda =
  document.querySelector<HTMLInputElement>("#modalidade-venda");
const modalidadeDoacao =
  document.querySelector<HTMLInputElement>("#modalidade-doacao");
const campoImagem =
  document.querySelector<HTMLInputElement>("#imagem-item");
const errosImagem = document.querySelector<HTMLElement>("#erro-imagem");
const formularioNovoAnuncio = document.querySelector<HTMLFormElement>(
  "#formulario-novo-anuncio",
);
const botaoPublicarAnuncio =
  document.querySelector<HTMLButtonElement>("#botao-publicar-anuncio");
const painelNovoAnuncio =
  document.querySelector<HTMLElement>("#painel-novo-anuncio");
const botaoAbrirAnuncio =
  document.querySelector<HTMLButtonElement>("#botao-abrir-anuncio");
const botaoFecharAnuncio =
  document.querySelector<HTMLButtonElement>("#botao-fechar-anuncio");
const botaoCriarColecao =
  document.querySelector<HTMLButtonElement>("#botao-criar-colecao");
const painelNovaColecao =
  document.querySelector<HTMLElement>("#painel-nova-colecao");
const botaoFecharColecao =
  document.querySelector<HTMLButtonElement>("#botao-fechar-colecao");
const formularioNovaColecao = document.querySelector<HTMLFormElement>(
  "#formulario-nova-colecao",
);
const campoNomeColecao =
  document.querySelector<HTMLInputElement>("#nome-colecao");
const listaItensColecao =
  document.querySelector<HTMLElement>("#lista-itens-colecao");
const botaoAdicionarItemColecao = document.querySelector<HTMLButtonElement>(
  "#botao-adicionar-item-colecao",
);
const botaoSalvarColecao =
  document.querySelector<HTMLButtonElement>("#botao-salvar-colecao");
const feedbackColecao =
  document.querySelector<HTMLElement>("#feedback-colecao");
const secaoColecoes =
  document.querySelector<HTMLElement>("#colecoes-destaque");
const gradeColecoes =
  secaoColecoes?.querySelector<HTMLElement>(".colecoes-grid");
const listaAnuncios =
  document.querySelector<HTMLElement>("#lista-anuncios");
const listaMeusAnuncios =
  document.querySelector<HTMLElement>("#lista-meus-anuncios");
const resultadosContagem =
  document.querySelector<HTMLElement>("#resultados-contagem");
const feedbackAnuncio =
  document.querySelector<HTMLElement>("#feedback-anuncio");
const botaoContaUsuario =
  document.querySelector<HTMLButtonElement>("#nome-usuario");
const containerContaUsuario =
  document.querySelector<HTMLElement>(".conta-usuario");
const menuContaUsuario =
  document.querySelector<HTMLElement>("#menu-conta");
const botaoSairConta =
  document.querySelector<HTMLButtonElement>("#botao-sair-conta");
const dialogoAutenticacao =
  document.querySelector<HTMLDialogElement>("#dialogo-autenticacao");
const botaoFecharAutenticacao =
  document.querySelector<HTMLButtonElement>("#fechar-dialogo-autenticacao");
const botoesModoAutenticacao =
  document.querySelectorAll<HTMLButtonElement>("[data-modo-autenticacao]");
const formulariosAutenticacao =
  document.querySelectorAll<HTMLFormElement>("[data-formulario-autenticacao]");
const feedbackAutenticacao =
  document.querySelector<HTMLElement>("#feedback-autenticacao");
const dialogoImportacaoLegada =
  document.querySelector<HTMLDialogElement>("#dialogo-importacao-legada");
const nomeIdentidadeLegada =
  document.querySelector<HTMLElement>("#nome-identidade-legada");
const resumoImportacaoLegada =
  document.querySelector<HTMLElement>("#resumo-importacao-legada");
const feedbackImportacaoLegada =
  document.querySelector<HTMLElement>("#feedback-importacao-legada");
const botaoImportarColecoesLegadas =
  document.querySelector<HTMLButtonElement>("#importar-colecoes-legadas");
const botaoManterColecoesLegadas =
  document.querySelector<HTMLButtonElement>("#manter-colecoes-legadas");
const headerPrincipal = document.querySelector<HTMLElement>("header");
const botaoMenuPrincipal =
  document.querySelector<HTMLButtonElement>("#botao-menu-principal");
const navegacaoPrincipal =
  document.querySelector<HTMLElement>("#navegacao-principal");
const mediaMenuCompacto = window.matchMedia("(max-width: 68rem)");
const formularioBuscaVitrine =
  document.querySelector<HTMLFormElement>("#formulario-busca-vitrine");
const campoBuscaVitrine =
  document.querySelector<HTMLInputElement>("#busca-vitrine");
const ordenacaoVitrine =
  document.querySelector<HTMLSelectElement>("#ordenacao-vitrine");
const abasCatalogo =
  document.querySelectorAll<HTMLElement>("[data-aba-catalogo]");
const botoesLayout =
  document.querySelectorAll<HTMLButtonElement>("[data-layout]");
const filtrosCategoria =
  document.querySelectorAll<HTMLElement>("[data-categoria-filtro]");
const filtrosCondicao =
  document.querySelectorAll<HTMLElement>("[data-condicao-filtro]");
const filtrosModalidade =
  document.querySelectorAll<HTMLElement>("[data-modalidade-filtro]");
const modalImagem =
  document.querySelector<DialogImagem>("#modal-imagem");
const imagemAmpliada =
  document.querySelector<HTMLImageElement>("#imagem-ampliada");
const tituloModalImagem =
  document.querySelector<HTMLElement>("#modal-imagem-titulo");
const botaoFecharModalImagem =
  document.querySelector<HTMLButtonElement>("#fechar-modal-imagem");
const bannerConectividade =
  document.querySelector<HTMLElement>("#banner-conectividade");
const tituloBannerConectividade = document.querySelector<HTMLElement>(
  "#banner-conectividade-titulo",
);
const mensagemBannerConectividade = document.querySelector<HTMLElement>(
  "#banner-conectividade-mensagem",
);

const CHAVE_USUARIO = "marketplace-vortex:usuario";
const CHAVE_COLECOES = "marketplace-vortex:colecoes";
const CHAVE_SESSAO = "marketplace-vortex:sessao";
const PREFIXO_DECISAO_IMPORTACAO =
  "marketplace-vortex:importacao-colecoes:v1";
const URL_BASE_API = (import.meta.env.VITE_API_URL ?? "")
  .trim()
  .replace(/\/+$/, "");
const MENSAGEM_API_GRATUITA_INICIANDO = "A API gratuita está iniciando";
const ATRASO_AVISO_API_GRATUITA_MS = 1_500;
const MENSAGEM_IMAGEM_OBRIGATORIA = "Escolha uma imagem para o anúncio.";
const MENSAGEM_IMAGEM_INVALIDA = "Envie uma imagem PNG, JPG ou JPEG.";
const TAMANHO_MAXIMO_IMAGEM_BYTES = 5 * 1024 * 1024;
const MENSAGEM_TAMANHO_IMAGEM_INVALIDO =
  "Envie uma imagem de até 5 MB.";
const IMAGEM_PADRAO_ANUNCIO =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80";
  
const categorias: MapaCategorias = {
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
const nomesCondicoes: Record<Condicao, string> = {
  novo: "Novo",
  seminovo: "Seminovo",
  usado: "Usado",
};

let temporizadorAvisoBotao: number | undefined;
let temporizadorFeedback: number | undefined;
let scrollHeaderAgendado = false;
let termoBuscaVitrine = "";
let abaCatalogoAtiva: AbaCatalogo = "todos";
let categoriaFiltroAtiva: CategoriaFiltro = "todas";
let ordenacaoAtiva: OrdenacaoCatalogo = "recentes";
// Snapshots de leitura preenchidos exclusivamente pelas respostas da API.
// Toda alteração persistente deve ser seguida por um novo carregamento do servidor.
let cacheCatalogoApi: Anuncio[] = [];
let cacheAnunciosUsuarioApi: Anuncio[] = [];
let cacheContagemApi: Anuncio[] = [];
let sequenciaRequisicaoCatalogo = 0;
let sequenciaRequisicaoUsuario = 0;
const idsEmExclusao = new Set<string>();
let publicacaoEmAndamento = false;
let sequenciaItemColecao = 0;
let temporizadorFeedbackColecao: number | undefined;
let temporizadorBannerConectividade: number | undefined;
let reconexaoEmAndamento = false;
let catalogoUsaDadosSalvos = false;
let autenticacaoEmAndamento = false;
let elementoFocadoAntesDaAutenticacao: HTMLElement | null = null;

const formatadorMoeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
const ordenadorAlfabetico = new Intl.Collator("pt-BR", {
  sensitivity: "base",
});

function exibirBannerConectividade(
  estado: EstadoBannerConectividade,
  titulo: string,
  mensagem: string,
  { temporario = false }: { temporario?: boolean } = {},
): void {
  if (
    !bannerConectividade ||
    !tituloBannerConectividade ||
    !mensagemBannerConectividade
  ) {
    return;
  }

  window.clearTimeout(temporizadorBannerConectividade);
  tituloBannerConectividade.textContent = titulo;
  mensagemBannerConectividade.textContent = mensagem;
  bannerConectividade.dataset.estado = estado;
  bannerConectividade.hidden = false;

  if (temporario) {
    temporizadorBannerConectividade = window.setTimeout(() => {
      bannerConectividade.hidden = true;
      bannerConectividade.removeAttribute("data-estado");
    }, 4_000);
  }
}

function registrarOrigemDoCatalogo(offline: boolean): void {
  const usavaDadosSalvos = catalogoUsaDadosSalvos;
  catalogoUsaDadosSalvos = offline;

  if (offline) {
    exibirBannerConectividade(
      "dados-salvos",
      "Catálogo salvo no dispositivo",
      "Você está vendo dados salvos. Eles podem estar desatualizados até a conexão voltar.",
    );
    return;
  }

  if (usavaDadosSalvos && !reconexaoEmAndamento) {
    exibirBannerConectividade(
      "reconectado",
      "Conexão restabelecida",
      "O catálogo foi atualizado com os dados mais recentes.",
      { temporario: true },
    );
  }
}

function registrarFalhaOffline(): void {
  exibirBannerConectividade(
    "offline",
    "Você está offline",
    "O que já foi carregado continua disponível. Algumas ações precisam de conexão.",
  );
}

function agendarAvisoApiGratuita(exibirAviso: () => void): () => void {
  const temporizador = window.setTimeout(
    exibirAviso,
    ATRASO_AVISO_API_GRATUITA_MS,
  );

  return () => {
    window.clearTimeout(temporizador);
  };
}

async function requisitarApi<T>(
  caminho: string,
  decodificar: DecodificadorResposta<T>,
  opcoes: RequestInit = {},
): Promise<ResultadoApi<T>> {
  const cabecalhos = new Headers(opcoes.headers);
  if (!cabecalhos.has("Accept")) {
    cabecalhos.set("Accept", "application/json");
  }

  const resposta = await fetch(`${URL_BASE_API}${caminho}`, {
    ...opcoes,
    headers: cabecalhos,
  });
  const offline = respostaEhOffline(resposta);

  let dados: unknown = null;

  try {
    dados = await resposta.json();
  } catch {
    // O decodificador ou o erro HTTP produz uma mensagem segura abaixo.
  }

  if (!resposta.ok) {
    if (offline) {
      registrarFalhaOffline();
    }

    throw new ErroRequisicaoApi(
      resposta.status,
      normalizarErroDaApi(dados),
      offline,
    );
  }

  return {
    dados: decodificar(dados),
    offline,
  };
}

async function requisitarApiAutenticada<T>(
  caminho: string,
  decodificar: DecodificadorResposta<T>,
  opcoes: RequestInit = {},
  sessao: Sessao | null = sessaoAtual,
): Promise<ResultadoApi<T>> {
  if (!sessao) {
    throw new Error("É necessário entrar na conta para continuar.");
  }

  const cabecalhos = new Headers(opcoes.headers);
  cabecalhos.set("Authorization", `Bearer ${sessao.token}`);

  try {
    return await requisitarApi(caminho, decodificar, {
      ...opcoes,
      headers: cabecalhos,
    });
  } catch (erro) {
    if (ehErroRequisicaoApi(erro) && erro.status === 401) {
      invalidarSessaoPorResposta401(sessao.token);
    }

    throw erro;
  }
}

function ehRegistro(valor: unknown): valor is Record<string, unknown> {
  return Boolean(valor) && typeof valor === "object" && !Array.isArray(valor);
}

function ehUuid(valor: unknown): valor is string {
  return (
    typeof valor === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu.test(
      valor,
    )
  );
}

function normalizarCamposDoErro(
  campos: unknown,
): ErroApi["campos"] {
  if (!ehRegistro(campos)) {
    return undefined;
  }

  const entradasValidas = Object.entries(campos).filter(
    (entrada): entrada is [string, string] =>
      typeof entrada[1] === "string",
  );

  return entradasValidas.length > 0
    ? Object.fromEntries(entradasValidas)
    : undefined;
}

function normalizarErroDaApi(dados: unknown): DadosErroApi {
  const mensagemPadrao = "Não foi possível concluir a solicitação.";

  if (!ehRegistro(dados)) {
    return { erro: mensagemPadrao };
  }

  const erro =
    typeof dados.erro === "string" && dados.erro.trim()
      ? dados.erro
      : mensagemPadrao;
  const campos = normalizarCamposDoErro(dados.campos);

  if (typeof dados.codigo === "string" && dados.codigo.trim()) {
    return {
      erro,
      codigo: dados.codigo,
      ...(campos ? { campos } : {}),
    };
  }

  return {
    erro,
    ...(campos ? { campos } : {}),
  };
}

function normalizarSessaoDaApi(dados: unknown): Sessao {
  if (!ehRegistro(dados) || !ehRegistro(dados.usuario)) {
    throw new TypeError("A API retornou uma sessão inválida.");
  }

  const usuario = dados.usuario;

  if (
    typeof dados.token !== "string" ||
    !dados.token.trim() ||
    !ehUuid(usuario.id) ||
    typeof usuario.nome !== "string" ||
    !usuario.nome.trim() ||
    typeof usuario.email !== "string" ||
    !usuario.email.trim()
  ) {
    throw new TypeError("A API retornou uma sessão inválida.");
  }

  return {
    token: dados.token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
    },
  };
}

function normalizarUsuarioAutenticadoDaApi(
  dados: unknown,
): Sessao["usuario"] {
  if (!ehRegistro(dados) || !ehRegistro(dados.usuario)) {
    throw new TypeError("A API retornou uma identidade inválida.");
  }

  const usuario = dados.usuario;

  if (
    !ehUuid(usuario.id) ||
    typeof usuario.nome !== "string" ||
    !usuario.nome.trim() ||
    typeof usuario.email !== "string" ||
    !usuario.email.trim()
  ) {
    throw new TypeError("A API retornou uma identidade inválida.");
  }

  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
  };
}

function obterTextoDoAnuncio(
  dados: Record<string, unknown>,
  campo: keyof Pick<
    Anuncio,
    | "nome"
    | "localizacao"
    | "descricao"
    | "imagemUrl"
    | "usuarioId"
    | "usuarioNome"
    | "criadoEm"
  >,
): string {
  const valor = dados[campo];

  if (typeof valor !== "string") {
    throw new TypeError(
      `A API retornou um anúncio com ${campo} inválido.`,
    );
  }

  return valor;
}

function normalizarAnuncioDaApi(anuncio: unknown): Anuncio {
  if (!ehRegistro(anuncio)) {
    throw new TypeError("A API retornou um anúncio inválido.");
  }

  const dados = anuncio;
  const id = Number(dados.id);
  const valor = Number(dados.valor);

  if (!Number.isInteger(id) || id <= 0) {
    throw new TypeError("A API retornou um anúncio com ID inválido.");
  }

  if (!Number.isFinite(valor) || valor < 0) {
    throw new TypeError("A API retornou um anúncio com valor inválido.");
  }

  if (!ehCategoria(dados.categoria)) {
    throw new TypeError(
      "A API retornou um anúncio com categoria inválida.",
    );
  }

  if (!ehCondicao(dados.condicao)) {
    throw new TypeError(
      "A API retornou um anúncio com condição inválida.",
    );
  }

  if (!ehModalidade(dados.modalidade)) {
    throw new TypeError(
      "A API retornou um anúncio com modalidade inválida.",
    );
  }

  return {
    id,
    nome: obterTextoDoAnuncio(dados, "nome"),
    categoria: dados.categoria,
    condicao: dados.condicao,
    modalidade: dados.modalidade,
    valor,
    localizacao: obterTextoDoAnuncio(dados, "localizacao"),
    descricao: obterTextoDoAnuncio(dados, "descricao"),
    imagemUrl: obterTextoDoAnuncio(dados, "imagemUrl"),
    usuarioId: obterTextoDoAnuncio(dados, "usuarioId"),
    usuarioNome: obterTextoDoAnuncio(dados, "usuarioNome"),
    criadoEm: obterTextoDoAnuncio(dados, "criadoEm"),
  };
}

function criarUrlDaApiDeAnuncios(
  {
    categoria,
    usuarioId,
  }: { categoria?: CategoriaFiltro; usuarioId?: string } = {},
): string {
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

function normalizarListaDeAnuncios(resposta: unknown): Anuncio[] {
  if (!Array.isArray(resposta)) {
    throw new TypeError("A API retornou uma lista de anúncios inválida.");
  }

  // A API entrega os mais recentes primeiro; o cache mantém a ordem histórica
  // esperada pelas rotinas atuais de renderização.
  return resposta.map(normalizarAnuncioDaApi).reverse();
}

function normalizarRespostaDeExclusao(
  resposta: unknown,
): RespostaExclusaoAnuncio {
  if (!ehRegistro(resposta)) {
    throw new TypeError(
      "A API retornou uma confirmação de exclusão inválida.",
    );
  }

  const id = Number(resposta.id);

  if (
    typeof resposta.mensagem !== "string" ||
    !Number.isInteger(id) ||
    id <= 0
  ) {
    throw new TypeError(
      "A API retornou uma confirmação de exclusão inválida.",
    );
  }

  return {
    mensagem: resposta.mensagem,
    id,
  };
}

function criarSkeletonDoCatalogo(): HTMLDivElement {
  const grupo = criarElemento(
    "div",
    "skeleton-catalogo",
  );
  grupo.setAttribute("aria-hidden", "true");

  for (let indice = 0; indice < 3; indice += 1) {
    const card = criarElemento("div", "skeleton-card-anuncio");
    card.append(
      criarElemento("span", "skeleton-bloco skeleton-card-media"),
      criarElemento("span", "skeleton-bloco skeleton-linha skeleton-categoria"),
      criarElemento("span", "skeleton-bloco skeleton-linha skeleton-titulo"),
      criarElemento("span", "skeleton-bloco skeleton-linha skeleton-informacao"),
      criarElemento("span", "skeleton-bloco skeleton-linha skeleton-preco"),
      criarElemento("span", "skeleton-bloco skeleton-botao"),
    );
    grupo.append(card);
  }

  return grupo;
}

function criarSkeletonDosAnunciosDoUsuario(): HTMLDivElement {
  const grupo = criarElemento(
    "div",
    "skeleton-anuncios-usuario",
  );
  grupo.setAttribute("aria-hidden", "true");

  for (let indice = 0; indice < 2; indice += 1) {
    const card = criarElemento("div", "skeleton-card-usuario");
    const detalhes = criarElemento("div", "skeleton-detalhes-usuario");
    detalhes.append(
      criarElemento("span", "skeleton-bloco skeleton-status"),
      criarElemento("span", "skeleton-bloco skeleton-linha skeleton-titulo"),
      criarElemento("span", "skeleton-bloco skeleton-linha skeleton-informacao"),
    );
    card.append(
      criarElemento("span", "skeleton-bloco skeleton-usuario-media"),
      detalhes,
      criarElemento("span", "skeleton-bloco skeleton-usuario-acao"),
    );
    grupo.append(card);
  }

  return grupo;
}

function criarEstadoDeCarregamento(
  texto: string,
  skeleton: HTMLElement,
): HTMLDivElement {
  const estado = criarElemento("div", "estado-carregamento");
  const mensagem = criarElemento(
    "p",
    "somente-leitor",
    texto,
  );

  mensagem.setAttribute("role", "status");
  estado.append(mensagem, skeleton);
  return estado;
}

function exibirEstadoDeCarregamento(
  texto = "Carregando anúncios...",
): void {
  listaAnuncios?.replaceChildren(
    texto === MENSAGEM_API_GRATUITA_INICIANDO
      ? criarEstadoVazio(texto)
      : criarEstadoDeCarregamento(texto, criarSkeletonDoCatalogo()),
  );
  listaAnuncios?.setAttribute("aria-busy", "true");

  if (resultadosContagem) {
    resultadosContagem.textContent = "Carregando resultados...";
  }
}

function exibirEstadoDeCarregamentoDoUsuario(
  texto = "Carregando seus anúncios...",
): void {
  if (listaMeusAnuncios) {
    listaMeusAnuncios.replaceChildren(
      texto === MENSAGEM_API_GRATUITA_INICIANDO
        ? criarEstadoVazio(texto)
        : criarEstadoDeCarregamento(
            texto,
            criarSkeletonDosAnunciosDoUsuario(),
          ),
    );
    listaMeusAnuncios.setAttribute("aria-busy", "true");
  }
}

function exibirErroAoCarregarAnuncios(erro?: unknown) {
  const offlineSemCache =
    ehErroRequisicaoApi(erro) &&
    erro.offline &&
    "codigo" in erro.dados &&
    erro.dados.codigo === "OFFLINE_SEM_CACHE";

  if (listaAnuncios) {
    const estado = criarElemento("div", "estado-vazio");
    const mensagem = criarElemento(
      "p",
      "",
      offlineSemCache
        ? "Este catálogo ainda não foi salvo neste dispositivo. Conecte-se à internet e carregue esta consulta antes de usá-la offline."
        : "Não foi possível carregar os anúncios. Verifique sua conexão e tente novamente.",
    );
    const botaoTentarNovamente = criarElemento(
      "button",
      "btn-detalhes",
      "Tentar novamente",
    );

    botaoTentarNovamente.type = "button";
    botaoTentarNovamente.addEventListener("click", () => {
      void carregarAnunciosDaApi();
    });
    estado.append(mensagem, botaoTentarNovamente);
    listaAnuncios.replaceChildren(estado);
    listaAnuncios.removeAttribute("aria-busy");
  }

  if (resultadosContagem) {
    resultadosContagem.textContent = offlineSemCache
      ? "Catálogo indisponível offline"
      : "Anúncios indisponíveis";
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
      () => {
        void carregarMeusAnunciosDaApi();
      },
    );
    estado.append(mensagem, botaoTentarNovamente);
    listaMeusAnuncios.replaceChildren(estado);
    listaMeusAnuncios.removeAttribute("aria-busy");
  }
}

async function carregarAnunciosDaApi(
  { mostrarCarregamento = true }: { mostrarCarregamento?: boolean } = {},
): Promise<boolean> {
  const sequenciaDestaRequisicao = ++sequenciaRequisicaoCatalogo;
  const categoria = categoriaFiltroAtiva;

  if (mostrarCarregamento) {
    exibirEstadoDeCarregamento();
  }

  const cancelarAvisoApiGratuita = mostrarCarregamento
    ? agendarAvisoApiGratuita(() => {
        if (sequenciaDestaRequisicao === sequenciaRequisicaoCatalogo) {
          exibirEstadoDeCarregamento(MENSAGEM_API_GRATUITA_INICIANDO);
        }
      })
    : () => {};

  try {
    const urlCatalogo = criarUrlDaApiDeAnuncios({ categoria });
    const precisaCarregarContagensGerais = categoria !== "todas";
    const [resultadoCatalogo, resultadoParaContagem] = await Promise.all([
      requisitarApi(urlCatalogo, normalizarListaDeAnuncios),
      precisaCarregarContagensGerais
        ? requisitarApi(
            criarUrlDaApiDeAnuncios(),
            normalizarListaDeAnuncios,
          )
        : Promise.resolve(null),
    ]);

    if (sequenciaDestaRequisicao !== sequenciaRequisicaoCatalogo) {
      return false;
    }

    cacheCatalogoApi = resultadoCatalogo.dados;
    cacheContagemApi = resultadoParaContagem
      ? resultadoParaContagem.dados
      : [...cacheCatalogoApi];
    registrarOrigemDoCatalogo(
      resultadoCatalogo.offline ||
        resultadoParaContagem?.offline === true,
    );
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
    exibirErroAoCarregarAnuncios(erro);
    return false;
  } finally {
    cancelarAvisoApiGratuita();
  }
}

async function carregarMeusAnunciosDaApi(
  { mostrarCarregamento = true }: { mostrarCarregamento?: boolean } = {},
): Promise<boolean> {
  const sequenciaDestaRequisicao = ++sequenciaRequisicaoUsuario;
  const sessaoDaRequisicao = sessaoAtual;
  const usuarioDaRequisicao = usuarioAtual;

  if (!sessaoDaRequisicao || !usuarioDaRequisicao) {
    cacheAnunciosUsuarioApi = [];
    listaMeusAnuncios?.removeAttribute("aria-busy");
    renderizarMeusAnuncios();
    return true;
  }

  if (mostrarCarregamento) {
    exibirEstadoDeCarregamentoDoUsuario();
  }

  const cancelarAvisoApiGratuita = mostrarCarregamento
    ? agendarAvisoApiGratuita(() => {
        if (
          sequenciaDestaRequisicao === sequenciaRequisicaoUsuario &&
          usuarioAtual?.id === usuarioDaRequisicao.id &&
          sessaoAtual?.token === sessaoDaRequisicao.token
        ) {
          exibirEstadoDeCarregamentoDoUsuario(
            MENSAGEM_API_GRATUITA_INICIANDO,
          );
        }
      })
    : () => {};

  try {
    const resultado = await requisitarApiAutenticada(
      "/api/anuncios/me",
      normalizarListaDeAnuncios,
      {},
      sessaoDaRequisicao,
    );

    if (
      sequenciaDestaRequisicao !== sequenciaRequisicaoUsuario ||
      usuarioAtual?.id !== usuarioDaRequisicao.id ||
      sessaoAtual?.token !== sessaoDaRequisicao.token
    ) {
      return false;
    }

    cacheAnunciosUsuarioApi = resultado.dados;
    listaMeusAnuncios?.removeAttribute("aria-busy");
    renderizarMeusAnuncios();
    return true;
  } catch (erro) {
    if (
      sequenciaDestaRequisicao !== sequenciaRequisicaoUsuario ||
      usuarioAtual?.id !== usuarioDaRequisicao.id ||
      sessaoAtual?.token !== sessaoDaRequisicao.token
    ) {
      return false;
    }

    console.error("Não foi possível carregar os anúncios do usuário.", erro);
    cacheAnunciosUsuarioApi = [];
    exibirErroAoCarregarAnunciosDoUsuario();
    return false;
  } finally {
    cancelarAvisoApiGratuita();
  }
}

function gerarId(prefixo: string): string {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return `${prefixo}-${window.crypto.randomUUID()}`;
  }

  return `${prefixo}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function usuarioSalvoEhValido(
  usuario: unknown,
): usuario is IdentidadeUsuarioLegada {
  if (!usuario || typeof usuario !== "object") {
    return false;
  }

  const candidato = usuario as Record<string, unknown>;

  return (
    typeof candidato.id === "string" &&
    candidato.id.trim() !== "" &&
    typeof candidato.nome === "string" &&
    candidato.nome.trim() !== ""
  );
}

function lerUsuarioSalvo(): IdentidadeUsuarioLegada | null {
  try {
    const usuarioSalvo = window.localStorage.getItem(CHAVE_USUARIO);

    if (!usuarioSalvo) {
      return null;
    }

    const usuario: unknown = JSON.parse(usuarioSalvo);
    return usuarioSalvoEhValido(usuario) ? usuario : null;
  } catch (erro) {
    console.warn("Não foi possível recuperar o usuário salvo.", erro);
    return null;
  }
}

function salvarUsuario(usuario: IdentidadeUsuarioLegada): void {
  try {
    window.localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario));
  } catch (erro) {
    console.warn("Não foi possível salvar o usuário neste navegador.", erro);
  }
}

function removerUsuarioSalvo(): void {
  try {
    window.localStorage.removeItem(CHAVE_USUARIO);
  } catch (erro) {
    console.warn("Não foi possível remover o usuário salvo.", erro);
  }
}

function sessaoSalvaEhValida(sessao: unknown): sessao is Sessao {
  if (!ehRegistro(sessao) || !ehRegistro(sessao.usuario)) {
    return false;
  }

  return (
    typeof sessao.token === "string" &&
    sessao.token.trim() !== "" &&
    ehUuid(sessao.usuario.id) &&
    typeof sessao.usuario.nome === "string" &&
    sessao.usuario.nome.trim() !== "" &&
    typeof sessao.usuario.email === "string" &&
    sessao.usuario.email.trim() !== ""
  );
}

function lerSessaoSalva(): Sessao | null {
  try {
    const conteudoSalvo = window.sessionStorage.getItem(CHAVE_SESSAO);

    if (!conteudoSalvo) {
      return null;
    }

    const sessao: unknown = JSON.parse(conteudoSalvo);

    if (!sessaoSalvaEhValida(sessao)) {
      console.warn("A sessão salva tem uma estrutura inválida.");
      return null;
    }

    return {
      token: sessao.token,
      usuario: {
        id: sessao.usuario.id,
        nome: sessao.usuario.nome,
        email: sessao.usuario.email,
      },
    };
  } catch (erro) {
    console.warn("Não foi possível recuperar a sessão desta aba.", erro);
    return null;
  }
}

function salvarSessao(sessao: Sessao): void {
  try {
    window.sessionStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
  } catch (erro) {
    console.warn("Não foi possível salvar a sessão nesta aba.", erro);
  }
}

function removerSessaoSalva(): void {
  try {
    window.sessionStorage.removeItem(CHAVE_SESSAO);
  } catch (erro) {
    console.warn("Não foi possível remover a sessão desta aba.", erro);
  }
}

let sessaoAtual = lerSessaoSalva();
// A identidade local anterior à autenticação continua preservada em
// CHAVE_USUARIO somente para o fluxo explícito de importação. Sem Bearer
// válido nesta aba, não existe usuário ativo.
let usuarioAtual = sessaoAtual?.usuario ?? null;

function invalidarSessaoPorResposta401(tokenRejeitado: string): void {
  if (sessaoAtual?.token !== tokenRejeitado) {
    return;
  }

  sessaoAtual = null;
  usuarioAtual = null;
  removerSessaoSalva();
  sequenciaRequisicaoUsuario += 1;
  cacheAnunciosUsuarioApi = [];
  fecharMenuConta();
  atualizarContaNoHeader();
  renderizarMeusAnuncios();
  renderizarColecoesDoUsuario();
  abrirDialogoAutenticacao();
  definirFeedbackAutenticacao(
    "Sua sessão expirou. Entre novamente para continuar.",
    "erro",
  );
}
let contextoImportacaoLegada: ContextoImportacaoLegada | null = null;

function colecaoSalvaEhValida(colecao: unknown): colecao is Colecao {
  if (!colecao || typeof colecao !== "object") {
    return false;
  }

  const candidata = colecao as Record<string, unknown>;

  return (
    typeof candidata.id === "string" &&
    typeof candidata.usuarioId === "string" &&
    typeof candidata.usuarioNome === "string" &&
    typeof candidata.nome === "string" &&
    candidata.nome.trim() !== "" &&
    typeof candidata.criadaEm === "string" &&
    Array.isArray(candidata.itens) &&
    candidata.itens.length > 0 &&
    candidata.itens.every((item: unknown) => {
      if (!item || typeof item !== "object") {
        return false;
      }

      const candidato = item as Record<string, unknown>;
      return (
        typeof candidato.nome === "string" &&
        candidato.nome.trim() !== "" &&
        ehCategoria(candidato.categoria)
      );
    })
  );
}

function lerColecoesSalvas(): Colecao[] {
  try {
    const conteudoSalvo = window.localStorage.getItem(CHAVE_COLECOES);

    if (!conteudoSalvo) {
      return [];
    }

    const colecoes: unknown = JSON.parse(conteudoSalvo);
    return Array.isArray(colecoes)
      ? colecoes.filter(colecaoSalvaEhValida)
      : [];
  } catch (erro) {
    console.warn("Não foi possível recuperar as coleções salvas.", erro);
    return [];
  }
}

function salvarColecoes(colecoes: readonly Colecao[]): boolean {
  try {
    window.localStorage.setItem(CHAVE_COLECOES, JSON.stringify(colecoes));
    return true;
  } catch (erro) {
    console.warn("Não foi possível salvar a coleção neste navegador.", erro);
    return false;
  }
}

function lerColecoesBrutas(): unknown[] | null {
  try {
    const conteudoSalvo = window.localStorage.getItem(CHAVE_COLECOES);

    if (!conteudoSalvo) {
      return [];
    }

    const colecoes: unknown = JSON.parse(conteudoSalvo);
    return Array.isArray(colecoes) ? colecoes : null;
  } catch (erro) {
    console.warn(
      "Não foi possível inspecionar as coleções antigas.",
      erro,
    );
    return null;
  }
}

function criarContextoImportacaoLegada(
  usuarioAutenticado: Sessao["usuario"],
): ContextoImportacaoLegada | null {
  const identidadeLegada = lerUsuarioSalvo();

  if (
    !identidadeLegada ||
    identidadeLegada.id === usuarioAutenticado.id
  ) {
    return null;
  }

  const colecoes = lerColecoesBrutas();

  if (!colecoes) {
    return null;
  }

  const quantidadeColecoes = contarColecoesLegadas(
    colecoes,
    identidadeLegada.id,
  );

  if (quantidadeColecoes === 0) {
    return null;
  }

  const chaveDecisao = criarChaveDecisaoImportacao(
    PREFIXO_DECISAO_IMPORTACAO,
    identidadeLegada.id,
    usuarioAutenticado.id,
  );

  try {
    const conteudoMarcador = window.localStorage.getItem(chaveDecisao);
    const marcador: unknown = conteudoMarcador
      ? JSON.parse(conteudoMarcador)
      : null;

    if (
      marcadorCorrespondeACombinacao(
        marcador,
        identidadeLegada.id,
        usuarioAutenticado.id,
      )
    ) {
      return null;
    }
  } catch (erro) {
    console.warn(
      "Não foi possível recuperar a decisão de importação.",
      erro,
    );
  }

  return {
    identidadeLegada,
    usuarioAutenticado,
    quantidadeColecoes,
  };
}

function definirFeedbackImportacaoLegada(
  mensagem: string,
  tipo: "erro" | "neutro" = "neutro",
): void {
  if (!feedbackImportacaoLegada) {
    return;
  }

  feedbackImportacaoLegada.textContent = mensagem;
  feedbackImportacaoLegada.dataset.tipo = tipo;
}

function oferecerImportacaoLegada(
  usuarioAutenticado: Sessao["usuario"],
): void {
  const contexto = criarContextoImportacaoLegada(usuarioAutenticado);

  if (
    !contexto ||
    !dialogoImportacaoLegada ||
    dialogoImportacaoLegada.open
  ) {
    return;
  }

  contextoImportacaoLegada = contexto;

  if (nomeIdentidadeLegada) {
    nomeIdentidadeLegada.textContent = contexto.identidadeLegada.nome;
  }

  if (resumoImportacaoLegada) {
    const quantidade = contexto.quantidadeColecoes;
    resumoImportacaoLegada.textContent =
      `${quantidade} ${quantidade === 1 ? "coleção foi encontrada" : "coleções foram encontradas"} ` +
      "neste navegador.";
  }

  definirFeedbackImportacaoLegada("");
  dialogoImportacaoLegada.showModal();
  document.body.classList.add("modal-aberto");
  window.requestAnimationFrame(() => {
    botaoImportarColecoesLegadas?.focus();
  });
}

function agendarOfertaImportacaoLegada(
  usuarioAutenticado: Sessao["usuario"],
): void {
  window.requestAnimationFrame(() => {
    if (sessaoAtual?.usuario.id === usuarioAutenticado.id) {
      oferecerImportacaoLegada(usuarioAutenticado);
    }
  });
}

function fecharDialogoImportacaoLegada(): void {
  if (dialogoImportacaoLegada?.open) {
    dialogoImportacaoLegada.close();
  }
}

function registrarDecisaoImportacao(
  contexto: ContextoImportacaoLegada,
  decisao: DecisaoImportacao,
): string {
  const chave = criarChaveDecisaoImportacao(
    PREFIXO_DECISAO_IMPORTACAO,
    contexto.identidadeLegada.id,
    contexto.usuarioAutenticado.id,
  );
  const marcador = criarMarcadorDecisaoImportacao(
    decisao,
    contexto.identidadeLegada.id,
    contexto.usuarioAutenticado.id,
  );

  window.localStorage.setItem(chave, JSON.stringify(marcador));
  return chave;
}

function manterColecoesLegadas(): void {
  const contexto = contextoImportacaoLegada;

  if (!contexto) {
    fecharDialogoImportacaoLegada();
    return;
  }

  try {
    registrarDecisaoImportacao(contexto, "mantida");
  } catch (erro) {
    console.warn("Não foi possível guardar a decisão de importação.", erro);
    definirFeedbackImportacaoLegada(
      "Não foi possível guardar sua escolha. Libere espaço no navegador e tente novamente.",
      "erro",
    );
    return;
  }

  fecharDialogoImportacaoLegada();
  mostrarFeedback(
    "As coleções antigas foram mantidas sem alterações neste navegador.",
  );
}

function importarColecoesLegadas(): void {
  const contexto = contextoImportacaoLegada;

  if (!contexto) {
    fecharDialogoImportacaoLegada();
    return;
  }

  const colecoes = lerColecoesBrutas();

  if (!colecoes) {
    definirFeedbackImportacaoLegada(
      "As coleções antigas não puderam ser lidas. Nenhum dado foi alterado.",
      "erro",
    );
    return;
  }

  const resultado = reassociarColecoesLegadas(
    colecoes,
    contexto.identidadeLegada.id,
    contexto.usuarioAutenticado,
  );
  let chaveDecisao: string | null = null;

  try {
    chaveDecisao = registrarDecisaoImportacao(contexto, "importada");
    window.localStorage.setItem(
      CHAVE_COLECOES,
      JSON.stringify(resultado.colecoes),
    );
  } catch (erro) {
    if (chaveDecisao) {
      try {
        window.localStorage.removeItem(chaveDecisao);
      } catch {
        // A coleção original continua intacta se a gravação falhar.
      }
    }

    console.warn("Não foi possível importar as coleções antigas.", erro);
    definirFeedbackImportacaoLegada(
      "Não foi possível importar agora. Nenhum dado antigo foi apagado.",
      "erro",
    );
    return;
  }

  fecharDialogoImportacaoLegada();
  renderizarColecoesDoUsuario();
  const quantidade = resultado.quantidade;
  mostrarFeedback(
    `${quantidade} ${quantidade === 1 ? "coleção importada" : "coleções importadas"} para sua conta.`,
  );
}

function criarCardColecaoUsuario(colecao: Colecao): HTMLElement {
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

  const usuarioAutenticado = sessaoAtual?.usuario;

  if (!usuarioAutenticado || !ehUuid(usuarioAutenticado.id)) {
    return;
  }

  const idUsuarioAtual = usuarioAutenticado.id;
  const colecoesDoUsuario = lerColecoesSalvas()
    .filter((colecao) => colecao.usuarioId === idUsuarioAtual)
    .reverse();
  const fragmento = document.createDocumentFragment();

  colecoesDoUsuario.forEach((colecao) => {
    fragmento.append(criarCardColecaoUsuario(colecao));
  });

  gradeColecoes.insertBefore(fragmento, gradeColecoes.firstChild);
}

function obterIniciaisDoUsuario(nome: string): string {
  return nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join("");
}

function fecharMenuConta(
  { devolverFoco = false }: { devolverFoco?: boolean } = {},
): void {
  if (!menuContaUsuario || !botaoContaUsuario) {
    return;
  }

  menuContaUsuario.hidden = true;
  botaoContaUsuario.setAttribute("aria-expanded", "false");

  if (devolverFoco) {
    botaoContaUsuario.focus();
  }
}

function atualizarContaNoHeader(): void {
  if (!botaoContaUsuario || !menuContaUsuario) {
    return;
  }

  const usuarioEstaLogado = usuarioAtual !== null;
  botaoContaUsuario.replaceChildren();
  botaoContaUsuario.classList.toggle("is-autenticado", usuarioEstaLogado);
  botaoContaUsuario.setAttribute("aria-expanded", "false");

  if (!usuarioAtual) {
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

function ehModoAutenticacao(valor: string | undefined): valor is ModoAutenticacao {
  return valor === "login" || valor === "cadastro";
}

function definirFeedbackAutenticacao(
  mensagem: string,
  tipo: "neutro" | "erro" = "neutro",
): void {
  if (!feedbackAutenticacao) {
    return;
  }

  feedbackAutenticacao.textContent = mensagem;
  feedbackAutenticacao.dataset.tipo = tipo;
  feedbackAutenticacao.setAttribute(
    "role",
    tipo === "erro" ? "alert" : "status",
  );
}

function limparErrosAutenticacao(formulario: HTMLFormElement): void {
  formulario
    .querySelectorAll<HTMLElement>("[data-erro-campo]")
    .forEach((erroCampo) => {
      erroCampo.textContent = "";
    });

  formulario
    .querySelectorAll<HTMLInputElement>("[aria-invalid='true']")
    .forEach((campo) => {
      campo.removeAttribute("aria-invalid");
      const idsErro = [
        ...formulario.querySelectorAll<HTMLElement>("[data-erro-campo]"),
      ].map((erroCampo) => erroCampo.id);
      const descricoes = (campo.getAttribute("aria-describedby") ?? "")
        .split(/\s+/)
        .filter((id) => id && !idsErro.includes(id));

      if (descricoes.length > 0) {
        campo.setAttribute("aria-describedby", descricoes.join(" "));
      } else {
        campo.removeAttribute("aria-describedby");
      }
    });
}

function mostrarErroDeCampoAutenticacao(
  formulario: HTMLFormElement,
  campo: string,
  mensagem: string,
): HTMLInputElement | null {
  const entrada = formulario.elements.namedItem(campo);
  const erroCampo = [
    ...formulario.querySelectorAll<HTMLElement>("[data-erro-campo]"),
  ].find((elemento) => elemento.dataset.erroCampo === campo);

  if (!(entrada instanceof HTMLInputElement) || !erroCampo) {
    return null;
  }

  erroCampo.textContent = mensagem;
  entrada.setAttribute("aria-invalid", "true");
  const descricoes = new Set(
    (entrada.getAttribute("aria-describedby") ?? "")
      .split(/\s+/)
      .filter(Boolean),
  );
  descricoes.add(erroCampo.id);
  entrada.setAttribute("aria-describedby", [...descricoes].join(" "));
  return entrada;
}

function definirModoAutenticacao(
  modo: ModoAutenticacao,
  { moverFoco = false }: { moverFoco?: boolean } = {},
): void {
  if (autenticacaoEmAndamento) {
    return;
  }

  botoesModoAutenticacao.forEach((botao) => {
    const selecionado = botao.dataset.modoAutenticacao === modo;
    botao.setAttribute("aria-selected", String(selecionado));
    botao.tabIndex = selecionado ? 0 : -1;
  });

  formulariosAutenticacao.forEach((formulario) => {
    formulario.hidden =
      formulario.dataset.formularioAutenticacao !== modo;
  });
  definirFeedbackAutenticacao("");

  if (moverFoco) {
    const formularioAtivo = [...formulariosAutenticacao].find(
      (formulario) => formulario.dataset.formularioAutenticacao === modo,
    );
    formularioAtivo?.querySelector<HTMLInputElement>("input")?.focus();
  }
}

function abrirDialogoAutenticacao(): void {
  if (!dialogoAutenticacao || dialogoAutenticacao.open) {
    return;
  }

  elementoFocadoAntesDaAutenticacao =
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
  formulariosAutenticacao.forEach((formulario) => {
    formulario.reset();
    limparErrosAutenticacao(formulario);
  });
  definirModoAutenticacao("login");
  dialogoAutenticacao.showModal();
  document.body.classList.add("modal-aberto");
  window.requestAnimationFrame(() => {
    dialogoAutenticacao
      .querySelector<HTMLInputElement>("#login-email")
      ?.focus();
  });
}

function fecharDialogoAutenticacao(
  { aposSucesso = false }: { aposSucesso?: boolean } = {},
): void {
  if (autenticacaoEmAndamento && !aposSucesso) {
    return;
  }

  if (dialogoAutenticacao?.open) {
    dialogoAutenticacao.close();
  }
}

function definirBloqueioAutenticacao(
  formulario: HTMLFormElement,
  botaoEnviar: HTMLButtonElement | null,
  bloqueado: boolean,
): void {
  autenticacaoEmAndamento = bloqueado;
  dialogoAutenticacao?.setAttribute("aria-busy", String(bloqueado));
  formulario.setAttribute("aria-busy", String(bloqueado));

  if (botaoEnviar) {
    botaoEnviar.disabled = bloqueado;
    botaoEnviar.setAttribute("aria-disabled", String(bloqueado));
  }

  if (botaoFecharAutenticacao) {
    botaoFecharAutenticacao.disabled = bloqueado;
    botaoFecharAutenticacao.setAttribute(
      "aria-disabled",
      String(bloqueado),
    );
  }

  botoesModoAutenticacao.forEach((botao) => {
    botao.disabled = bloqueado;
    botao.setAttribute("aria-disabled", String(bloqueado));
  });
}

function obterMensagemErroAutenticacao(
  erro: unknown,
): string {
  if (!ehErroRequisicaoApi(erro)) {
    return "Não foi possível conectar ao serviço. Verifique sua conexão e tente novamente.";
  }

  const codigo = "codigo" in erro.dados ? erro.dados.codigo : undefined;

  if (erro.offline) {
    return "Você está offline. Conecte-se à internet para acessar sua conta.";
  }

  if (erro.status === 401 || codigo === "CREDENCIAIS_INVALIDAS") {
    return "E-mail ou senha incorretos. Confira os dados e tente novamente.";
  }

  if (erro.status === 409 || codigo === "EMAIL_EM_USO") {
    return "Este e-mail já está cadastrado. Entre na sua conta ou use outro e-mail.";
  }

  if (erro.status >= 500) {
    return "Servidor indisponível no momento. A API pode estar iniciando; aguarde alguns instantes e tente novamente.";
  }

  return erro.message;
}

async function enviarFormularioAutenticacao(
  formulario: HTMLFormElement,
): Promise<void> {
  const modo = formulario.dataset.formularioAutenticacao;

  if (
    autenticacaoEmAndamento ||
    !ehModoAutenticacao(modo) ||
    !formulario.reportValidity()
  ) {
    return;
  }

  limparErrosAutenticacao(formulario);
  definirFeedbackAutenticacao(
    modo === "login" ? "Entrando na sua conta..." : "Criando sua conta...",
  );

  const dadosFormulario = new FormData(formulario);
  const email = String(dadosFormulario.get("email") ?? "").trim();
  const senha = String(dadosFormulario.get("senha") ?? "");
  const corpo =
    modo === "cadastro"
      ? {
          nome: String(dadosFormulario.get("nome") ?? "").trim(),
          email,
          senha,
        }
      : { email, senha };
  const botaoEnviar =
    formulario.querySelector<HTMLButtonElement>("[type='submit']");
  const rotuloOriginal = botaoEnviar?.textContent ?? "";

  definirBloqueioAutenticacao(formulario, botaoEnviar, true);

  if (botaoEnviar) {
    botaoEnviar.textContent =
      modo === "login" ? "Entrando..." : "Criando conta...";
  }
  const cancelarAvisoApiGratuita = agendarAvisoApiGratuita(() => {
    definirFeedbackAutenticacao(MENSAGEM_API_GRATUITA_INICIANDO);
  });

  try {
    const resultado = await requisitarApi(
      `/api/auth/${modo === "login" ? "login" : "register"}`,
      normalizarSessaoDaApi,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(corpo),
      },
    );

    sessaoAtual = resultado.dados;
    usuarioAtual = resultado.dados.usuario;
    salvarSessao(resultado.dados);
    atualizarContaNoHeader();
    renderizarColecoesDoUsuario();
    void carregarMeusAnunciosDaApi();
    fecharDialogoAutenticacao({ aposSucesso: true });
    agendarOfertaImportacaoLegada(resultado.dados.usuario);
    mostrarFeedback(
      modo === "login"
        ? `Olá, ${usuarioAtual.nome}. Você entrou na sua conta.`
        : `Conta criada. Boas-vindas, ${usuarioAtual.nome}.`,
    );
  } catch (erro) {
    if (ehErroRequisicaoApi(erro)) {
      let primeiroCampoComErro: HTMLInputElement | null = null;

      for (const [campo, mensagem] of Object.entries(
        erro.dados.campos ?? {},
      )) {
        const entrada = mostrarErroDeCampoAutenticacao(
          formulario,
          campo,
          mensagem,
        );
        primeiroCampoComErro ??= entrada;
      }
      if (
        (erro.status === 409 ||
          ("codigo" in erro.dados &&
            erro.dados.codigo === "EMAIL_EM_USO")) &&
        !primeiroCampoComErro
      ) {
        primeiroCampoComErro = mostrarErroDeCampoAutenticacao(
          formulario,
          "email",
          "Este e-mail já está cadastrado.",
        );
      }
      definirFeedbackAutenticacao(
        obterMensagemErroAutenticacao(erro),
        "erro",
      );
      primeiroCampoComErro?.focus();
    } else {
      console.error("Não foi possível autenticar a conta.", erro);
      definirFeedbackAutenticacao(
        obterMensagemErroAutenticacao(erro),
        "erro",
      );
    }
  } finally {
    cancelarAvisoApiGratuita();
    definirBloqueioAutenticacao(formulario, botaoEnviar, false);

    if (botaoEnviar) {
      botaoEnviar.textContent = rotuloOriginal;
    }
  }
}

function sairDaConta(): void {
  sessaoAtual = null;
  removerSessaoSalva();
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

async function validarSessaoSalva(): Promise<void> {
  const sessaoParaValidar = sessaoAtual;

  if (!sessaoParaValidar) {
    await carregarMeusAnunciosDaApi();
    return;
  }

  try {
    const { dados: usuarioValidado } = await requisitarApiAutenticada(
      "/api/auth/me",
      normalizarUsuarioAutenticadoDaApi,
      {},
      sessaoParaValidar,
    );

    if (sessaoAtual?.token !== sessaoParaValidar.token) {
      return;
    }

    sessaoAtual = {
      token: sessaoParaValidar.token,
      usuario: usuarioValidado,
    };
    usuarioAtual = usuarioValidado;
    salvarSessao(sessaoAtual);
    atualizarContaNoHeader();
    renderizarColecoesDoUsuario();
    agendarOfertaImportacaoLegada(usuarioValidado);
  } catch (erro) {
    if (ehErroRequisicaoApi(erro) && erro.status === 401) {
      // O helper Bearer já invalidou a sessão atual. Uma resposta de uma
      // sessão obsoleta não deve afetar a conta que entrou depois.
      return;
    }

    // Falhas de rede, indisponibilidade e respostas diferentes de 401 não
    // invalidam uma sessão que ainda pode ser válida no servidor.
    console.warn("Não foi possível validar a sessão salva agora.", erro);
  }

  if (sessaoAtual?.token === sessaoParaValidar.token) {
    await carregarMeusAnunciosDaApi();
  }
}

function inicializarContaUsuario(): void {
  if (!botaoContaUsuario || !menuContaUsuario) {
    return;
  }

  botaoContaUsuario.addEventListener("click", () => {
    if (!usuarioAtual) {
      abrirDialogoAutenticacao();
      return;
    }

    const menuEstaAberto = !menuContaUsuario.hidden;
    menuContaUsuario.hidden = menuEstaAberto;
    botaoContaUsuario.setAttribute("aria-expanded", String(!menuEstaAberto));
  });

  botaoSairConta?.addEventListener("click", sairDaConta);
  botaoFecharAutenticacao?.addEventListener(
    "click",
    () => fecharDialogoAutenticacao(),
  );

  botoesModoAutenticacao.forEach((botao, indice) => {
    botao.addEventListener("click", () => {
      if (autenticacaoEmAndamento) {
        return;
      }

      const modo = botao.dataset.modoAutenticacao;

      if (ehModoAutenticacao(modo)) {
        definirModoAutenticacao(modo, { moverFoco: true });
      }
    });

    botao.addEventListener("keydown", (evento) => {
      if (autenticacaoEmAndamento) {
        return;
      }

      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(evento.key)) {
        return;
      }

      evento.preventDefault();
      const ultimoIndice = botoesModoAutenticacao.length - 1;
      const proximoIndice =
        evento.key === "Home"
          ? 0
          : evento.key === "End"
            ? ultimoIndice
            : evento.key === "ArrowRight"
              ? (indice + 1) % botoesModoAutenticacao.length
              : (indice - 1 + botoesModoAutenticacao.length) %
                botoesModoAutenticacao.length;
      botoesModoAutenticacao[proximoIndice]?.click();
      botoesModoAutenticacao[proximoIndice]?.focus();
    });
  });

  formulariosAutenticacao.forEach((formulario) => {
    formulario.addEventListener("input", () => {
      limparErrosAutenticacao(formulario);
      definirFeedbackAutenticacao("");
    });
    formulario.addEventListener("submit", (evento) => {
      evento.preventDefault();
      void enviarFormularioAutenticacao(formulario);
    });
  });

  dialogoAutenticacao?.addEventListener("click", (evento) => {
    if (
      evento.target === dialogoAutenticacao &&
      !autenticacaoEmAndamento
    ) {
      fecharDialogoAutenticacao();
    }
  });
  dialogoAutenticacao?.addEventListener("cancel", (evento) => {
    if (autenticacaoEmAndamento) {
      evento.preventDefault();
    }
  });
  dialogoAutenticacao?.addEventListener("close", () => {
    document.body.classList.remove("modal-aberto");
    const elementoParaRestaurar = elementoFocadoAntesDaAutenticacao;
    elementoFocadoAntesDaAutenticacao = null;

    if (elementoParaRestaurar?.isConnected) {
      elementoParaRestaurar.focus({ preventScroll: true });
    }
  });

  document.addEventListener("click", (evento) => {
    if (
      usuarioAtual &&
      !menuContaUsuario.hidden &&
      !containerContaUsuario?.contains(
        evento.target instanceof Node ? evento.target : null,
      )
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

function inicializarImportacaoLegada(): void {
  botaoImportarColecoesLegadas?.addEventListener(
    "click",
    importarColecoesLegadas,
  );
  botaoManterColecoesLegadas?.addEventListener(
    "click",
    manterColecoesLegadas,
  );
  dialogoImportacaoLegada?.addEventListener("close", () => {
    contextoImportacaoLegada = null;

    if (!document.querySelector("dialog[open]")) {
      document.body.classList.remove("modal-aberto");
    }

    botaoContaUsuario?.focus();
  });
}

function obterValorNumerico(valor: string): number {
  const valorNormalizado = valor
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  if (valorNormalizado === "") {
    return NaN;
  }

  return Number(valorNormalizado);
}

function formatarValorComoMoeda(): void {
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

function sincronizarModalidadeComValor(): void {
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

function campoEstaPreenchido(campo: CampoFormulario): boolean {
  if (campo instanceof HTMLInputElement && campo.type === "file") {
    return Boolean(campo.files?.length);
  }

  if (campo === valorItem) {
    const valorNumerico = obterValorNumerico(campo.value);
    return campo.value.trim() !== "" && Number.isFinite(valorNumerico);
  }

  return campo.value.trim() !== "";
}

function obterMensagemDeCampo(campo: CampoFormulario): string {
  const mensagensObrigatorias: Record<string, string> = {
    nome: "Informe o nome do item.",
    categoria: "Selecione uma categoria.",
    condicao: "Selecione a condição do item.",
    modalidade: "Escolha entre venda e doação.",
    valor: "Informe o valor do anúncio.",
    localizacao: "Informe o local de retirada.",
    descricao: "Descreva o estado e a utilidade do item.",
  };

  if (campo.type === "radio") {
    const selecionado = formularioNovoAnuncio?.querySelector(
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

function obterCamposRelacionados(campo: CampoFormulario): CampoFormulario[] {
  if (campo.type !== "radio") {
    return [campo];
  }

  return [
    ...formularioNovoAnuncio?.querySelectorAll<CampoFormulario>(
      `input[name="${campo.name}"]`,
    ) ?? [],
  ];
}

function obterElementoErroCampo(campo: CampoFormulario): HTMLElement {
  const identificador = campo.type === "radio" ? campo.name : campo.id;
  const idErro = `erro-${identificador}`;
  let elementoErro =
    formularioNovoAnuncio?.querySelector<HTMLElement>(`#${idErro}`) ?? null;

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

function definirErroCampo(
  campo: CampoFormulario,
  mensagem: string,
): void {
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

function validarCampo(campo: CampoFormulario): boolean {
  const mensagem = obterMensagemDeCampo(campo);
  definirErroCampo(campo, mensagem);
  return mensagem === "";
}

function validarCamposDoFormulario(): CampoFormulario | null {
  let primeiroCampoInvalido: CampoFormulario | null = null;
  const gruposValidados = new Set<string>();

  if (!formularioNovoAnuncio) {
    return null;
  }

  for (const campo of formularioNovoAnuncio.elements) {
    if (
      !(
        campo instanceof HTMLInputElement ||
        campo instanceof HTMLSelectElement ||
        campo instanceof HTMLTextAreaElement
      ) ||
      campo.type === "file"
    ) {
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

function limparErrosDosCampos(): void {
  formularioNovoAnuncio
    ?.querySelectorAll<HTMLElement>(".erro-campo")
    .forEach((elementoErro) => {
      elementoErro.textContent = "";
      elementoErro.hidden = true;
    });

  formularioNovoAnuncio
    ?.querySelectorAll<CampoFormulario>(
      '[aria-invalid="true"]:not(#imagem-item)',
    )
    .forEach((campo) => {
      campo.removeAttribute("aria-invalid");
      campo.setCustomValidity("");
    });
}

function mostrarAvisoNoBotao(): void {
  if (!botaoPublicarAnuncio) {
    return;
  }

  const textoOriginal =
    botaoPublicarAnuncio.dataset.textoOriginal ?? "";

  botaoPublicarAnuncio.textContent = "Revise os campos destacados";
  botaoPublicarAnuncio.classList.add("is-warning");

  window.clearTimeout(temporizadorAvisoBotao);
  temporizadorAvisoBotao = window.setTimeout(() => {
    botaoPublicarAnuncio.textContent = textoOriginal;
    botaoPublicarAnuncio.classList.remove("is-warning");
  }, 2600);
}

function mostrarFeedback(mensagem: string): void {
  if (!feedbackAnuncio) {
    return;
  }

  feedbackAnuncio.textContent = mensagem;
  window.clearTimeout(temporizadorFeedback);
  temporizadorFeedback = window.setTimeout(() => {
    feedbackAnuncio.textContent = "";
  }, 5000);
}

function arquivoEhImagemPermitida(arquivo: unknown): arquivo is File {
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

function converterArquivoParaDataUrl(arquivo: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
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
  arquivo: File | undefined,
  { imagemObrigatoria = false }: { imagemObrigatoria?: boolean } = {},
): Promise<string[]> {
  if (!arquivo) {
    return imagemObrigatoria ? [MENSAGEM_IMAGEM_OBRIGATORIA] : [];
  }

  const erros: string[] = [];
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

function exibirErrosDaImagem(erros: readonly string[]): void {
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
  {
    anunciarErro = false,
    imagemObrigatoria = false,
  }: { anunciarErro?: boolean; imagemObrigatoria?: boolean } = {},
): Promise<boolean> {
  if (!campoImagem) {
    return false;
  }

  const arquivo = campoImagem.files?.[0];
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

function criarElemento<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  classe = "",
  texto?: string,
): HTMLElementTagNameMap[K] {
  const elemento = document.createElement(tag);

  if (classe) {
    elemento.className = classe;
  }

  if (texto !== undefined) {
    elemento.textContent = texto;
  }

  return elemento;
}

function obterDadosVisuaisCategoria(
  categoria: unknown,
): MapaCategorias[Categoria] {
  return (ehCategoria(categoria) && categorias[categoria]) || {
    nome: "Outros",
    emoji: "♻️",
    imagemPadrao: IMAGEM_PADRAO_ANUNCIO,
  };
}

function obterImagemDoAnuncio(anuncio: Anuncio): string {
  if (typeof anuncio.imagemUrl === "string" && anuncio.imagemUrl.trim() !== "") {
    return anuncio.imagemUrl;
  }

  return obterDadosVisuaisCategoria(anuncio.categoria).imagemPadrao;
}

function criarMediaDoAnuncio(
  anuncio: Anuncio,
  classe: string,
): HTMLElement {
  const imagemUrl = obterImagemDoAnuncio(anuncio);
  const media = imagemUrl
    ? criarElemento("button", `${classe} botao-ampliar-imagem`)
    : criarElemento("div", classe);

  if (imagemUrl) {
    if (media instanceof HTMLButtonElement) {
      media.type = "button";
    }
    media.dataset.anuncioId = String(anuncio.id);
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

function abrirImagemDoAnuncio(
  id: string | undefined,
  elementoAcionador: HTMLElement,
): void {
  const anuncio = [...cacheCatalogoApi, ...cacheAnunciosUsuarioApi].find(
    (item) => String(item.id) === String(id),
  );
  const imagemUrl = anuncio ? obterImagemDoAnuncio(anuncio) : "";

  if (
    !anuncio ||
    !imagemUrl ||
    !modalImagem ||
    !imagemAmpliada ||
    !tituloModalImagem
  ) {
    return;
  }

  modalImagem.elementoAcionador = elementoAcionador;
  imagemAmpliada.src = imagemUrl;
  imagemAmpliada.alt = `Imagem ampliada de ${anuncio.nome}`;
  tituloModalImagem.textContent = anuncio.nome;
  document.body.classList.add("modal-aberto");
  modalImagem.showModal();
}

function fecharImagemAmpliada(): void {
  if (modalImagem?.open) {
    modalImagem.close();
  }
}

function inicializarVisualizacaoDeImagens(): void {
  if (!modalImagem || !botaoFecharModalImagem) {
    return;
  }

  [listaAnuncios, listaMeusAnuncios].forEach((lista) => {
    lista?.addEventListener("click", (evento) => {
      const botaoImagem =
        evento.target instanceof Element
          ? evento.target.closest<HTMLElement>(".botao-ampliar-imagem")
          : null;

      if (botaoImagem && lista.contains(botaoImagem)) {
        abrirImagemDoAnuncio(botaoImagem.dataset.anuncioId, botaoImagem);
      }
    });
  });

  botaoFecharModalImagem.addEventListener("click", fecharImagemAmpliada);

  modalImagem.addEventListener("click", (evento) => {
    const clicouNoConteudo =
      evento.target instanceof Element
        ? evento.target.closest(
            "#imagem-ampliada, #fechar-modal-imagem, #modal-imagem-titulo",
          )
        : null;

    if (!clicouNoConteudo) {
      fecharImagemAmpliada();
    }
  });

  modalImagem.addEventListener("close", () => {
    document.body.classList.remove("modal-aberto");
    imagemAmpliada?.removeAttribute("src");
    modalImagem.elementoAcionador?.focus();
    modalImagem.elementoAcionador = null;
  });
}

function criarCardDaVitrine(anuncio: Anuncio): HTMLElement {
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

  card.dataset.id = String(anuncio.id);
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

function criarCardDoUsuario(anuncio: Anuncio): HTMLElement {
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

  card.dataset.id = String(anuncio.id);
  botaoExcluir.type = "button";
  botaoExcluir.dataset.id = String(anuncio.id);
  botaoExcluir.setAttribute("aria-label", `Excluir ${anuncio.nome}`);

  detalhes.append(status, titulo, informacoes);
  acoes.append(botaoExcluir);
  card.append(media, detalhes, acoes);

  return card;
}

function criarEstadoVazio(mensagem: string): HTMLParagraphElement {
  return criarElemento("p", "estado-vazio", mensagem);
}

function normalizarTexto(texto: unknown): string {
  return String(texto)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

function obterAnunciosVisiveis(): Anuncio[] {
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

function atualizarContadoresDosFiltros(): void {
  const contagensCategoria: Record<CategoriaFiltro, number> = {
    todas: cacheContagemApi.length,
    livros: 0,
    eletronicos: 0,
    casa: 0,
    moda: 0,
    outros: 0,
  };
  const contagensCondicao: Record<Condicao | "todas", number> = {
    todas: cacheCatalogoApi.length,
    novo: 0,
    seminovo: 0,
    usado: 0,
  };
  const contagensModalidade: Record<Modalidade | "todas", number> = {
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

    if (contador && ehCategoriaFiltro(categoria)) {
      contador.textContent = String(contagensCategoria[categoria]);
    }
  });

  filtrosCondicao.forEach((filtro) => {
    const contador = filtro.querySelector(".filtro-contagem");
    const condicao = filtro.dataset.condicaoFiltro;

    if (
      contador &&
      (condicao === "todas" || ehCondicao(condicao))
    ) {
      contador.textContent = String(contagensCondicao[condicao]);
    }
  });

  filtrosModalidade.forEach((filtro) => {
    const contador = filtro.querySelector(".filtro-contagem");
    const modalidade = filtro.dataset.modalidadeFiltro;

    if (
      contador &&
      (modalidade === "todas" || ehModalidade(modalidade))
    ) {
      contador.textContent = String(contagensModalidade[modalidade]);
    }
  });
}

function renderizarAnuncios(): void {
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

function inicializarControlesDaVitrine(): void {
  formularioBuscaVitrine?.addEventListener("submit", (evento) => {
    evento.preventDefault();
  });

  campoBuscaVitrine?.addEventListener("input", () => {
    termoBuscaVitrine = campoBuscaVitrine.value;
    renderizarAnuncios();
  });

  ordenacaoVitrine?.addEventListener("change", () => {
    if (ehOrdenacaoCatalogo(ordenacaoVitrine.value)) {
      ordenacaoAtiva = ordenacaoVitrine.value;
      renderizarAnuncios();
    }
  });

  filtrosCategoria.forEach((filtro) => {
    filtro.addEventListener("click", (evento) => {
      evento.preventDefault();
      const categoria = filtro.dataset.categoriaFiltro;

      if (!ehCategoriaFiltro(categoria)) {
        return;
      }

      categoriaFiltroAtiva = categoria;

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
      const proximaAba = aba.dataset.abaCatalogo;

      if (!ehAbaCatalogo(proximaAba)) {
        return;
      }

      abaCatalogoAtiva = proximaAba;

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

function renderizarMeusAnuncios(): void {
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

async function criarAnuncio(): Promise<boolean> {
  if (publicacaoEmAndamento) {
    return false;
  }

  if (!sessaoAtual || !usuarioAtual) {
    mostrarFeedback("Entre na sua conta para publicar um anúncio.");
    botaoContaUsuario?.focus();
    return false;
  }

  if (
    !formularioNovoAnuncio ||
    !botaoPublicarAnuncio ||
    !valorItem
  ) {
    return false;
  }

  const dados = new FormData(formularioNovoAnuncio);
  const arquivoImagem = dados.get("imagem");
  const modalidadeRecebida = dados.get("modalidade");
  const modalidade = ehModalidade(modalidadeRecebida)
    ? modalidadeRecebida
    : null;
  const valorRecebido = dados.get("valor");
  const valor =
    modalidade === "doacao"
      ? 0
      : obterValorNumerico(
          typeof valorRecebido === "string" ? valorRecebido : "",
        );

  if (!arquivoEhImagemPermitida(arquivoImagem) || !modalidade) {
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
    const nome = dados.get("nome");
    const categoria = dados.get("categoria");
    const condicao = dados.get("condicao");
    const localizacao = dados.get("localizacao");
    const descricao = dados.get("descricao");

    if (
      typeof nome !== "string" ||
      !ehCategoria(categoria) ||
      !ehCondicao(condicao) ||
      typeof localizacao !== "string" ||
      typeof descricao !== "string"
    ) {
      mostrarFeedback(
        "Revise os dados do anúncio e tente novamente.",
      );
      return false;
    }

    const dadosDoAnuncio: NovoAnuncio = {
      nome: nome.trim(),
      categoria,
      condicao,
      modalidade,
      valor,
      localizacao: localizacao.trim(),
      descricao: descricao.trim(),
      imagemUrl,
    };
    const { dados: novoAnuncio } = await requisitarApiAutenticada(
      "/api/anuncios",
      normalizarAnuncioDaApi,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosDoAnuncio),
      },
    );

    await invalidarCacheCatalogoPublico();
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

    if (ehErroRequisicaoApi(erro) && erro.status === 400) {
      const primeiroErroDeCampo = Object.values(
        erro.dados.campos || {},
      ).find((mensagem) => typeof mensagem === "string");
      mostrarFeedback(
        primeiroErroDeCampo ||
          erro.dados.erro ||
          "Revise os dados do anúncio e tente novamente.",
      );
    } else if (ehErroRequisicaoApi(erro) && erro.status >= 500) {
      mostrarFeedback(
        "O servidor não conseguiu publicar o anúncio. Tente novamente.",
      );
    } else if (erro instanceof TypeError) {
      mostrarFeedback(
        "Não foi possível acessar o servidor. Verifique sua conexão e tente novamente.",
      );
    } else {
      mostrarFeedback(
        (erro instanceof Error ? erro.message : "") ||
          "Não foi possível publicar o anúncio. Tente novamente.",
      );
    }

    return false;
  } finally {
    publicacaoEmAndamento = false;
    botaoPublicarAnuncio.disabled = false;
    botaoPublicarAnuncio.removeAttribute("aria-busy");
    botaoPublicarAnuncio.textContent =
      botaoPublicarAnuncio.dataset.textoOriginal ?? "";
  }
}

async function excluirAnuncio(
  id: string | undefined,
  botaoExcluir: HTMLButtonElement | null,
): Promise<boolean> {
  const idNormalizado = String(id);
  const anuncio = cacheAnunciosUsuarioApi.find(
    (item) => String(item.id) === idNormalizado,
  );

  if (!anuncio) {
    mostrarFeedback("O anúncio não foi encontrado.");
    return false;
  }

  if (
    !sessaoAtual ||
    !usuarioAtual ||
    anuncio.usuarioId !== usuarioAtual.id
  ) {
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
    await requisitarApiAutenticada(
      `/api/anuncios/${encodeURIComponent(idNormalizado)}`,
      normalizarRespostaDeExclusao,
      {
        method: "DELETE",
      },
    );

    await invalidarCacheCatalogoPublico();
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

    if (ehErroRequisicaoApi(erro) && erro.status === 400) {
      mostrarFeedback("O ID do anúncio é inválido.");
    } else if (ehErroRequisicaoApi(erro) && erro.status === 401) {
      mostrarFeedback("Entre na sua conta para excluir um anúncio.");
    } else if (ehErroRequisicaoApi(erro) && erro.status === 403) {
      mostrarFeedback("Você só pode excluir os seus próprios anúncios.");
    } else if (ehErroRequisicaoApi(erro) && erro.status === 404) {
      mostrarFeedback(
        "Este anúncio não foi encontrado no servidor. Atualize a lista e tente novamente.",
      );
    } else if (ehErroRequisicaoApi(erro) && erro.status >= 500) {
      mostrarFeedback(
        "O servidor não conseguiu excluir o anúncio. Tente novamente.",
      );
    } else if (erro instanceof TypeError) {
      mostrarFeedback(
        "Não foi possível acessar o servidor. Verifique sua conexão e tente novamente.",
      );
    } else {
      mostrarFeedback(
        (erro instanceof Error ? erro.message : "") ||
          "Não foi possível excluir o anúncio. Tente novamente.",
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

function inicializarFormularioDeAnuncio(): void {
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
          : campoImagem?.validationMessage || MENSAGEM_IMAGEM_INVALIDA,
      );
      return;
    }

    formatarValorComoMoeda();
    await criarAnuncio();
  });
}

function definirPainelAnuncioAberto(
  aberto: boolean,
  { moverFoco = true }: { moverFoco?: boolean } = {},
): void {
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
    document
      .querySelector<HTMLInputElement>("#nome-item")
      ?.focus({ preventScroll: true });
  } else {
    botaoAbrirAnuncio.focus();
  }
}

function mostrarFeedbackDaColecao(
  mensagem: string,
  { persistente = false }: { persistente?: boolean } = {},
): void {
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

function atualizarNumeracaoDosItens(): void {
  if (!listaItensColecao) {
    return;
  }

  const itens = [
    ...listaItensColecao.querySelectorAll<HTMLElement>(
      ".item-colecao-linha",
    ),
  ];
  const unicoItem = itens.length === 1;

  itens.forEach((item, indice) => {
    const numero = indice + 1;
    const titulo =
      item.querySelector<HTMLElement>(".item-colecao-titulo");
    const botaoRemover =
      item.querySelector<HTMLButtonElement>(
        ".botao-remover-item-colecao",
      );

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

function criarLinhaDeItemColecao(): HTMLDivElement {
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
  const opcoesCategoria: ReadonlyArray<readonly [string, string]> = [
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

function adicionarLinhaDeItemColecao(
  { moverFoco = true }: { moverFoco?: boolean } = {},
): void {
  if (!listaItensColecao) {
    return;
  }

  const linha = criarLinhaDeItemColecao();
  listaItensColecao.append(linha);
  atualizarNumeracaoDosItens();

  if (moverFoco) {
    linha.querySelector<HTMLInputElement>("input")?.focus();
    mostrarFeedbackDaColecao("Novo item adicionado à coleção.");
  }
}

function removerLinhaDeItemColecao(
  botaoRemover: HTMLButtonElement,
): void {
  if (!listaItensColecao) {
    return;
  }

  const linhas = [
    ...listaItensColecao.querySelectorAll<HTMLElement>(
      ".item-colecao-linha",
    ),
  ];

  if (linhas.length <= 1) {
    return;
  }

  const linha = botaoRemover.closest<HTMLElement>(".item-colecao-linha");

  if (!linha) {
    return;
  }

  const indice = linhas.indexOf(linha);
  linha.remove();
  atualizarNumeracaoDosItens();

  const linhasRestantes = [
    ...listaItensColecao.querySelectorAll<HTMLElement>(
      ".item-colecao-linha",
    ),
  ];
  const linhaParaFoco =
    linhasRestantes[Math.min(indice, linhasRestantes.length - 1)];
  linhaParaFoco?.querySelector<HTMLInputElement>("input")?.focus();
  mostrarFeedbackDaColecao("Item removido da coleção.");
}

function definirErroDoCampoColecao(
  campo: CampoColecao,
  mensagem: string,
): void {
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

function validarCampoDaColecao(campo: CampoColecao): boolean {
  const mensagens: Record<string, string> = {
    nomeColecao: "Informe o nome da coleção.",
    nomeItem: "Informe o nome deste item.",
    categoriaItem: "Selecione a categoria deste item.",
  };
  const tipo = campo.dataset.tipoCampoColecao || "nomeColecao";
  const mensagem = campo.value.trim() ? "" : mensagens[tipo];
  definirErroDoCampoColecao(campo, mensagem);
  return !mensagem;
}

function validarFormularioDaColecao(): CampoColecao | null {
  let primeiroCampoInvalido: CampoColecao | null = null;

  if (!formularioNovaColecao) {
    return null;
  }

  formularioNovaColecao
    .querySelectorAll<CampoColecao>("input[required], select[required]")
    .forEach((campo) => {
      if (!validarCampoDaColecao(campo) && !primeiroCampoInvalido) {
        primeiroCampoInvalido = campo;
      }
    });

  return primeiroCampoInvalido;
}

function limparFormularioDaColecao(): void {
  if (!formularioNovaColecao || !listaItensColecao) {
    return;
  }

  formularioNovaColecao.reset();
  formularioNovaColecao
    .querySelectorAll<CampoColecao>('[aria-invalid="true"]')
    .forEach((campo) => {
      campo.removeAttribute("aria-invalid");
      campo.setCustomValidity("");
    });
  listaItensColecao.replaceChildren();
  adicionarLinhaDeItemColecao({ moverFoco: false });
}

function criarColecao(): boolean {
  const usuarioAutenticado = sessaoAtual?.usuario;

  if (!usuarioAutenticado || !ehUuid(usuarioAutenticado.id)) {
    mostrarFeedbackDaColecao(
      "Entre na sua conta para criar uma coleção.",
      { persistente: true },
    );
    botaoContaUsuario?.focus();
    return false;
  }

  if (!listaItensColecao || !campoNomeColecao) {
    return false;
  }

  const itens = [
    ...listaItensColecao.querySelectorAll<HTMLElement>(
      ".item-colecao-linha",
    ),
  ].flatMap((linha): ItemColecao[] => {
    const campoNome = linha.querySelector<HTMLInputElement>("input");
    const campoCategoria = linha.querySelector<HTMLSelectElement>("select");

    if (
      !campoNome ||
      !campoCategoria ||
      !ehCategoria(campoCategoria.value)
    ) {
      return [];
    }

    return [{
      nome: campoNome.value.trim(),
      categoria: campoCategoria.value,
    }];
  });
  const colecao: Colecao = {
    id: gerarId("colecao"),
    usuarioId: usuarioAutenticado.id,
    usuarioNome: usuarioAutenticado.nome,
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

function definirPainelColecaoAberto(
  aberto: boolean,
  { moverFoco = true }: { moverFoco?: boolean } = {},
): void {
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

function inicializarFormularioDaColecao(): void {
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
    const botaoRemover =
      evento.target instanceof Element
        ? evento.target.closest<HTMLButtonElement>(
            ".botao-remover-item-colecao",
          )
        : null;

    if (botaoRemover && listaItensColecao.contains(botaoRemover)) {
      removerLinhaDeItemColecao(botaoRemover);
    }
  });

  formularioNovaColecao.addEventListener("input", (evento) => {
    const campo =
      evento.target instanceof Element
        ? evento.target.closest<CampoColecao>(
            "input[required], select[required]",
          )
        : null;

    if (campo && formularioNovaColecao.contains(campo)) {
      validarCampoDaColecao(campo);
    }
  });

  formularioNovaColecao.addEventListener("change", (evento) => {
    const campo =
      evento.target instanceof Element
        ? evento.target.closest<CampoColecao>(
            "input[required], select[required]",
          )
        : null;

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

function inicializarPainelNovoAnuncio(): void {
  if (!painelNovoAnuncio || !botaoAbrirAnuncio) {
    return;
  }

  botaoAbrirAnuncio.addEventListener("click", () => {
    if (painelNovoAnuncio.hidden) {
      definirPainelColecaoAberto(false, { moverFoco: false });
    }
    definirPainelAnuncioAberto(Boolean(painelNovoAnuncio.hidden));
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

function inicializarExclusaoDeAnuncios(): void {
  if (!listaMeusAnuncios) {
    return;
  }

  listaMeusAnuncios.addEventListener("click", (evento) => {
    const botaoExcluir =
      evento.target instanceof Element
        ? evento.target.closest<HTMLButtonElement>(".btn-excluir")
        : null;

    if (!botaoExcluir || !listaMeusAnuncios.contains(botaoExcluir)) {
      return;
    }

    void excluirAnuncio(botaoExcluir.dataset.id, botaoExcluir);
  });
}

function definirMenuPrincipalAberto(
  aberto: boolean,
  { devolverFoco = false }: { devolverFoco?: boolean } = {},
): void {
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

function inicializarNavegacaoResponsiva(): void {
  if (!headerPrincipal || !botaoMenuPrincipal || !navegacaoPrincipal) {
    return;
  }

  botaoMenuPrincipal.addEventListener("click", () => {
    const menuEstaAberto =
      botaoMenuPrincipal.getAttribute("aria-expanded") === "true";
    definirMenuPrincipalAberto(!menuEstaAberto);
  });

  navegacaoPrincipal.addEventListener("click", (evento) => {
    if (
      evento.target instanceof Element &&
      evento.target.closest("a")
    ) {
      definirMenuPrincipalAberto(false);
    }
  });

  document.addEventListener("click", (evento) => {
    const menuEstaAberto =
      botaoMenuPrincipal.getAttribute("aria-expanded") === "true";

    if (
      menuEstaAberto &&
      !navegacaoPrincipal.contains(
        evento.target instanceof Node ? evento.target : null,
      ) &&
      !botaoMenuPrincipal.contains(
        evento.target instanceof Node ? evento.target : null,
      )
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

function atualizarEstadoDoHeader(): void {
  if (!headerPrincipal) {
    return;
  }

  headerPrincipal.classList.toggle("is-scrolled", window.scrollY > 50);
  scrollHeaderAgendado = false;
}

function inicializarHeaderFixo(): void {
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

function inicializarBannerConectividade(): void {
  window.addEventListener("offline", () => {
    reconexaoEmAndamento = false;
    registrarFalhaOffline();
  });

  window.addEventListener("online", () => {
    reconexaoEmAndamento = true;
    exibirBannerConectividade(
      "reconectado",
      "Conexão restabelecida",
      "Atualizando o catálogo com os dados mais recentes.",
    );

    void carregarAnunciosDaApi({ mostrarCarregamento: false }).then(
      (catalogoAtualizado) => {
        if (!reconexaoEmAndamento) {
          return;
        }

        reconexaoEmAndamento = false;

        if (!catalogoAtualizado) {
          exibirBannerConectividade(
            "offline",
            "Não foi possível atualizar",
            "A conexão ainda parece instável. Tente novamente em alguns instantes.",
          );
          return;
        }

        if (catalogoUsaDadosSalvos) {
          return;
        }

        exibirBannerConectividade(
          "reconectado",
          "Conexão restabelecida",
          "O catálogo foi atualizado com os dados mais recentes.",
          { temporario: true },
        );
      },
    );
  });

  if (!navigator.onLine) {
    registrarFalhaOffline();
  }
}

sincronizarModalidadeComValor();
inicializarBannerConectividade();
inicializarContaUsuario();
inicializarImportacaoLegada();
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
void validarSessaoSalva();
