export type DecisaoImportacao = "importada" | "mantida";

export interface AutoriaColecao {
  usuarioId: string;
  usuarioNome: string;
}

export interface DestinoImportacao {
  id: string;
  nome: string;
}

export interface ResultadoReassociacao {
  colecoes: unknown[];
  quantidade: number;
}

export function contarColecoesLegadas(
  colecoes: readonly unknown[],
  usuarioIdLegado: string,
): number;

export function reassociarColecoesLegadas(
  colecoes: readonly unknown[],
  usuarioIdLegado: string,
  usuarioAutenticado: DestinoImportacao,
): ResultadoReassociacao;

export function criarChaveDecisaoImportacao(
  prefixo: string,
  usuarioIdLegado: string,
  usuarioIdAutenticado: string,
): string;

export function criarMarcadorDecisaoImportacao(
  decisao: DecisaoImportacao,
  usuarioIdLegado: string,
  usuarioIdAutenticado: string,
): {
  versao: 1;
  decisao: DecisaoImportacao;
  usuarioIdLegado: string;
  usuarioIdAutenticado: string;
  decididaEm: string;
};

export function marcadorCorrespondeACombinacao(
  marcador: unknown,
  usuarioIdLegado: string,
  usuarioIdAutenticado: string,
): boolean;
