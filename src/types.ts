/**
 * Valores de domínio aceitos pelo formulário e pela API.
 *
 * As tuplas são a fonte única das unions e também podem ser reutilizadas em
 * validações de dados vindos do DOM, localStorage ou HTTP.
 */
export const CATEGORIAS = [
  "livros",
  "eletronicos",
  "casa",
  "moda",
  "outros",
] as const;

export const CONDICOES = ["novo", "seminovo", "usado"] as const;

export const MODALIDADES = ["venda", "doacao"] as const;

export type Categoria = (typeof CATEGORIAS)[number];
export type Condicao = (typeof CONDICOES)[number];
export type Modalidade = (typeof MODALIDADES)[number];

const conjuntoCategorias = new Set<unknown>(CATEGORIAS);
const conjuntoCondicoes = new Set<unknown>(CONDICOES);
const conjuntoModalidades = new Set<unknown>(MODALIDADES);

export function ehCategoria(valor: unknown): valor is Categoria {
  return conjuntoCategorias.has(valor);
}

export function ehCondicao(valor: unknown): valor is Condicao {
  return conjuntoCondicoes.has(valor);
}

export function ehModalidade(valor: unknown): valor is Modalidade {
  return conjuntoModalidades.has(valor);
}

export const FILTRO_TODAS = "todas" as const;
export const ABAS_CATALOGO = [
  "todos",
  "recentes",
  ...MODALIDADES,
] as const;
export const ORDENACOES_CATALOGO = [
  "recentes",
  "menor-preco",
  "maior-preco",
  "nome",
] as const;

export type CategoriaFiltro = Categoria | typeof FILTRO_TODAS;
export type CondicaoFiltro = Condicao | typeof FILTRO_TODAS;
export type ModalidadeFiltro = Modalidade | typeof FILTRO_TODAS;
export type AbaCatalogo = (typeof ABAS_CATALOGO)[number];
export type OrdenacaoCatalogo = (typeof ORDENACOES_CATALOGO)[number];

const conjuntoAbasCatalogo = new Set<unknown>(ABAS_CATALOGO);
const conjuntoOrdenacoesCatalogo = new Set<unknown>(
  ORDENACOES_CATALOGO,
);

export function ehCategoriaFiltro(valor: unknown): valor is CategoriaFiltro {
  return valor === FILTRO_TODAS || ehCategoria(valor);
}

export function ehCondicaoFiltro(valor: unknown): valor is CondicaoFiltro {
  return valor === FILTRO_TODAS || ehCondicao(valor);
}

export function ehModalidadeFiltro(valor: unknown): valor is ModalidadeFiltro {
  return valor === FILTRO_TODAS || ehModalidade(valor);
}

export function ehAbaCatalogo(valor: unknown): valor is AbaCatalogo {
  return conjuntoAbasCatalogo.has(valor);
}

export function ehOrdenacaoCatalogo(
  valor: unknown,
): valor is OrdenacaoCatalogo {
  return conjuntoOrdenacoesCatalogo.has(valor);
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  fotoPerfilUrl: string | null;
}

/**
 * Identidade usada temporariamente pelo fluxo local anterior à autenticação.
 * O contrato público de Usuario continua exigindo e-mail.
 */
export type IdentidadeUsuarioLegada = Pick<Usuario, "id" | "nome">;

export interface Sessao {
  token: string;
  usuario: Usuario;
}

export interface Anuncio {
  id: number;
  nome: string;
  categoria: Categoria;
  condicao: Condicao;
  modalidade: Modalidade;
  valor: number;
  localizacao: string;
  descricao: string;
  imagemUrl: string;
  usuarioId: string;
  usuarioNome: string;
  criadoEm: string;
  cliquesDetalhes: number;
}

export interface Oferta {
  id: number;
  anuncioId: number;
  anuncioNome: string;
  anuncioImagemUrl?: string;
  valor: number;
  mensagem: string;
  compradorId: string;
  compradorNome: string;
  anuncianteId: string;
  anuncianteNome: string;
  criadaEm: string;
  atualizadaEm?: string;
}

export interface MensagemOferta {
  id: number;
  ofertaId: number;
  autorId: string;
  autorNome: string;
  conteudo: string;
  criadaEm: string;
}

export interface NovaOferta {
  valor: number;
  mensagem: string;
}

export interface NovaMensagemOferta {
  conteudo: string;
}

/**
 * Corpo aceito pela criação autenticada. A autoria existe apenas no DTO de
 * saída e é preenchida pela API com base no Bearer.
 */
export type NovoAnuncio = Omit<
  Anuncio,
  "id" | "criadoEm" | "usuarioId" | "usuarioNome" | "cliquesDetalhes"
>;

export interface FiltrosAnuncios {
  categoria?: Categoria;
  usuarioId?: string;
}

export type CamposErroApi = Readonly<Record<string, string>>;

export interface ErroApi {
  erro: string;
  codigo: string;
  campos?: CamposErroApi;
}

/**
 * Compatibilidade explícita com a API anterior ao envelope uniforme do plano.
 * Não torna `codigo` opcional no contrato definitivo de ErroApi.
 */
export type ErroApiLegado = Omit<ErroApi, "codigo"> & {
  codigo?: never;
};

export interface RespostaUsuario {
  usuario: Usuario;
}

export interface RespostaExclusaoAnuncio {
  mensagem: string;
  id: number;
}

export const CABECALHO_RESPOSTA_OFFLINE = "X-Vortex-Offline" as const;
export const IDENTIFICACAO_RESPOSTA_OFFLINE = "1" as const;

export type IdentificacaoOffline =
  typeof IDENTIFICACAO_RESPOSTA_OFFLINE;

export interface CabecalhosRespostaOffline extends Headers {
  get(nome: typeof CABECALHO_RESPOSTA_OFFLINE): IdentificacaoOffline;
  get(nome: string): string | null;
}

/**
 * Resposta HTTP refinada após a confirmação do cabeçalho sintético do cache.
 */
export interface RespostaOffline extends Response {
  readonly headers: CabecalhosRespostaOffline;
}

export function respostaEhOffline(
  resposta: Response,
): resposta is RespostaOffline {
  return (
    resposta.headers.get(CABECALHO_RESPOSTA_OFFLINE) ===
    IDENTIFICACAO_RESPOSTA_OFFLINE
  );
}

export interface ItemColecao {
  nome: string;
  categoria: Categoria;
}

export interface Colecao {
  id: string;
  usuarioId: string;
  usuarioNome: string;
  nome: string;
  itens: ItemColecao[];
  criadaEm: string;
}

export interface DadosVisuaisCategoria {
  nome: string;
  emoji: string;
  imagemPadrao: string;
}

export type MapaCategorias = Record<Categoria, DadosVisuaisCategoria>;
