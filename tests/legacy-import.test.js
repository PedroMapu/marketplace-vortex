const test = require("node:test");
const assert = require("node:assert/strict");

const ID_LEGADO = "usuario-local-1700000000000";
const UUID_AUTENTICADO = "a26d852b-df50-4201-82f3-082575dfbb87";

test("reassocia somente coleções do legado e preserva as demais entradas", async () => {
  const { reassociarColecoesLegadas } = await import(
    "../src/legacy-import.mjs"
  );
  const colecaoLegada = {
    id: "colecao-antiga",
    usuarioId: ID_LEGADO,
    usuarioNome: "Nome antigo",
    nome: "Reuso",
    itens: [{ nome: "Caderno", categoria: "livros" }],
    criadaEm: "2026-01-01T00:00:00.000Z",
    campoDesconhecido: "preservado",
  };
  const colecaoDeOutraPessoa = {
    id: "colecao-outra",
    usuarioId: "outra-identidade",
    usuarioNome: "Outra pessoa",
  };
  const entradaDesconhecida = "conteúdo preservado";
  const origem = [
    colecaoLegada,
    colecaoDeOutraPessoa,
    entradaDesconhecida,
  ];

  const resultado = reassociarColecoesLegadas(origem, ID_LEGADO, {
    id: UUID_AUTENTICADO,
    nome: "Nome autenticado",
  });

  assert.equal(resultado.quantidade, 1);
  assert.deepEqual(resultado.colecoes[0], {
    ...colecaoLegada,
    usuarioId: UUID_AUTENTICADO,
    usuarioNome: "Nome autenticado",
  });
  assert.equal(resultado.colecoes[1], colecaoDeOutraPessoa);
  assert.equal(resultado.colecoes[2], entradaDesconhecida);
  assert.equal(origem[0], colecaoLegada, "não deve alterar a origem");
});

test("marcador é específico ao par legado e conta autenticada", async () => {
  const {
    criarChaveDecisaoImportacao,
    criarMarcadorDecisaoImportacao,
    marcadorCorrespondeACombinacao,
  } = await import("../src/legacy-import.mjs");
  const prefixo = "marketplace-vortex:importacao-colecoes:v1";
  const marcador = criarMarcadorDecisaoImportacao(
    "mantida",
    ID_LEGADO,
    UUID_AUTENTICADO,
  );

  assert.equal(
    criarChaveDecisaoImportacao(prefixo, ID_LEGADO, UUID_AUTENTICADO),
    `${prefixo}:${encodeURIComponent(ID_LEGADO)}:${UUID_AUTENTICADO}`,
  );
  assert.equal(
    marcadorCorrespondeACombinacao(
      marcador,
      ID_LEGADO,
      UUID_AUTENTICADO,
    ),
    true,
  );
  assert.equal(
    marcadorCorrespondeACombinacao(
      marcador,
      ID_LEGADO,
      "1e13aa06-51d0-412c-b082-657f39c4e43e",
    ),
    false,
  );
  assert.equal(
    marcadorCorrespondeACombinacao(
      { ...marcador, versao: 2 },
      ID_LEGADO,
      UUID_AUTENTICADO,
    ),
    false,
  );
});
