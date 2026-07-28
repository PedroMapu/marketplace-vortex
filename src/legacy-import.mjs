const VERSAO_DECISAO_IMPORTACAO = 1;

function ehRegistro(valor) {
  return Boolean(valor) && typeof valor === "object" && !Array.isArray(valor);
}

export function contarColecoesLegadas(colecoes, usuarioIdLegado) {
  return colecoes.filter(
    (colecao) =>
      ehRegistro(colecao) && colecao.usuarioId === usuarioIdLegado,
  ).length;
}

export function reassociarColecoesLegadas(
  colecoes,
  usuarioIdLegado,
  usuarioAutenticado,
) {
  let quantidade = 0;
  const colecoesAtualizadas = colecoes.map((colecao) => {
    if (
      !ehRegistro(colecao) ||
      colecao.usuarioId !== usuarioIdLegado
    ) {
      return colecao;
    }

    quantidade += 1;
    return {
      ...colecao,
      usuarioId: usuarioAutenticado.id,
      usuarioNome: usuarioAutenticado.nome,
    };
  });

  return { colecoes: colecoesAtualizadas, quantidade };
}

export function criarChaveDecisaoImportacao(
  prefixo,
  usuarioIdLegado,
  usuarioIdAutenticado,
) {
  return `${prefixo}:${encodeURIComponent(usuarioIdLegado)}:${usuarioIdAutenticado}`;
}

export function criarMarcadorDecisaoImportacao(
  decisao,
  usuarioIdLegado,
  usuarioIdAutenticado,
) {
  return {
    versao: VERSAO_DECISAO_IMPORTACAO,
    decisao,
    usuarioIdLegado,
    usuarioIdAutenticado,
    decididaEm: new Date().toISOString(),
  };
}

export function marcadorCorrespondeACombinacao(
  marcador,
  usuarioIdLegado,
  usuarioIdAutenticado,
) {
  return (
    ehRegistro(marcador) &&
    marcador.versao === VERSAO_DECISAO_IMPORTACAO &&
    (marcador.decisao === "importada" || marcador.decisao === "mantida") &&
    marcador.usuarioIdLegado === usuarioIdLegado &&
    marcador.usuarioIdAutenticado === usuarioIdAutenticado
  );
}
