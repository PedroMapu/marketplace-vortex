const assert = require("node:assert/strict");
const { once } = require("node:events");
const test = require("node:test");

const caminhoApi = require.resolve("../api");
const caminhoDatabase = require.resolve("../database");
const USUARIO_ID = "ea11c83e-a7b1-4ba4-9d27-1bbf94a6e945";

function carregarApiComDatabaseMock(sobrescritas = {}) {
  const databaseMock = {
    listarAnuncios: async () => [],
    criarAnuncio: async (anuncio) => anuncio,
    buscarAnuncioPorId: async () => undefined,
    excluirAnuncioPorId: async () => false,
    verificarConexao: async () => true,
    ...sobrescritas,
  };
  const moduloDatabaseOriginal = require.cache[caminhoDatabase];

  require.cache[caminhoDatabase] = {
    id: caminhoDatabase,
    filename: caminhoDatabase,
    loaded: true,
    exports: databaseMock,
  };
  delete require.cache[caminhoApi];

  try {
    return {
      app: require(caminhoApi),
      databaseMock,
    };
  } finally {
    delete require.cache[caminhoApi];

    if (moduloDatabaseOriginal) {
      require.cache[caminhoDatabase] = moduloDatabaseOriginal;
    } else {
      delete require.cache[caminhoDatabase];
    }
  }
}

async function requisitar(app, caminho, opcoes = {}) {
  const servidor = app.listen(0, "127.0.0.1");
  await once(servidor, "listening");

  try {
    const { port } = servidor.address();
    const resposta = await fetch(`http://127.0.0.1:${port}${caminho}`, {
      method: opcoes.method ?? "GET",
      headers: {
        ...(opcoes.body === undefined
          ? {}
          : { "Content-Type": "application/json" }),
        ...opcoes.headers,
      },
      body:
        opcoes.body === undefined ? undefined : JSON.stringify(opcoes.body),
    });

    return {
      status: resposta.status,
      body: await resposta.json(),
    };
  } finally {
    servidor.close();
    await once(servidor, "close");
  }
}

test("GET /api/status aguarda o healthcheck e preserva a resposta de sucesso", async () => {
  let liberarHealthcheck;
  const healthcheckPendente = new Promise((resolve) => {
    liberarHealthcheck = resolve;
  });
  const { app } = carregarApiComDatabaseMock({
    verificarConexao: () => healthcheckPendente,
  });
  const requisicao = requisitar(app, "/api/status");
  let finalizada = false;

  requisicao.finally(() => {
    finalizada = true;
  });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(finalizada, false);

  liberarHealthcheck(true);

  assert.deepEqual(await requisicao, {
    status: 200,
    body: {
      mensagem: "API do Marketplace Vortex funcionando.",
    },
  });
});

test("GET /api/status responde 503 sem expor a falha do PostgreSQL", async () => {
  const { app } = carregarApiComDatabaseMock({
    verificarConexao: async () => {
      throw new Error("senha-secreta postgres://usuario:senha@host");
    },
  });

  assert.deepEqual(await requisitar(app, "/api/status"), {
    status: 503,
    body: {
      erro: "Banco de dados temporariamente indisponível.",
    },
  });
});

test("GET /api/anuncios aguarda a consulta e encaminha os filtros", async () => {
  const anuncio = {
    id: 12,
    nome: "Calculadora",
    categoria: "eletronicos",
    condicao: "usado",
    modalidade: "venda",
    valor: 25.5,
    localizacao: "Fortaleza",
    descricao: "Funcionando",
    imagemUrl: "",
    usuarioId: "usuario-1",
    usuarioNome: "Pedro",
    criadoEm: "2026-07-28T12:00:00.000Z",
  };
  let filtrosRecebidos;
  const { app } = carregarApiComDatabaseMock({
    listarAnuncios: async (filtros) => {
      filtrosRecebidos = filtros;
      return [anuncio];
    },
  });

  assert.deepEqual(
    await requisitar(
      app,
      `/api/anuncios?categoria=eletronicos&usuarioId=${USUARIO_ID}`,
    ),
    {
      status: 200,
      body: [anuncio],
    },
  );
  assert.deepEqual(filtrosRecebidos, {
    categoria: "eletronicos",
    usuarioId: USUARIO_ID,
  });
});

test("POST /api/anuncios aguarda a criação e mantém normalização e DTO", async () => {
  const entrada = {
    nome: "  Mesa lateral  ",
    categoria: "casa",
    condicao: "usado",
    modalidade: "venda",
    valor: 125.5,
    localizacao: "  Fortaleza  ",
    descricao: "  Madeira maciça  ",
    imagemUrl: "  data:image/png;base64,abc  ",
    usuarioId: `  ${USUARIO_ID}  `,
    usuarioNome: "  Ana  ",
  };
  const anuncioCriado = {
    id: 13,
    nome: "Mesa lateral",
    categoria: "casa",
    condicao: "usado",
    modalidade: "venda",
    valor: 125.5,
    localizacao: "Fortaleza",
    descricao: "Madeira maciça",
    imagemUrl: "data:image/png;base64,abc",
    usuarioId: USUARIO_ID,
    usuarioNome: "Ana",
    criadoEm: "2026-07-28T12:30:00.000Z",
  };
  let dadosRecebidos;
  const { app } = carregarApiComDatabaseMock({
    criarAnuncio: async (dados) => {
      dadosRecebidos = dados;
      return anuncioCriado;
    },
  });

  assert.deepEqual(
    await requisitar(app, "/api/anuncios", {
      method: "POST",
      body: entrada,
    }),
    {
      status: 201,
      body: anuncioCriado,
    },
  );
  assert.deepEqual(dadosRecebidos, {
    nome: "Mesa lateral",
    categoria: "casa",
    condicao: "usado",
    modalidade: "venda",
    valor: 125.5,
    localizacao: "Fortaleza",
    descricao: "Madeira maciça",
    imagemUrl: "data:image/png;base64,abc",
    usuarioId: USUARIO_ID,
    usuarioNome: "Ana",
  });
});

test("DELETE /api/anuncios/:id aguarda leitura e exclusão", async () => {
  const chamadas = [];
  const { app } = carregarApiComDatabaseMock({
    buscarAnuncioPorId: async (id) => {
      chamadas.push(["buscar", id]);
      return { id, usuarioId: USUARIO_ID };
    },
    excluirAnuncioPorId: async (id, usuarioId) => {
      chamadas.push(["excluir", id, usuarioId]);
      return true;
    },
  });

  assert.deepEqual(
    await requisitar(app, "/api/anuncios/14", {
      method: "DELETE",
      headers: { "X-Usuario-Id": ` ${USUARIO_ID} ` },
    }),
    {
      status: 200,
      body: {
        mensagem: "Anúncio excluído com sucesso.",
        id: 14,
      },
    },
  );
  assert.deepEqual(chamadas, [
    ["buscar", 14],
    ["excluir", 14, USUARIO_ID],
  ]);
});

test("DELETE rejeita identificação legada antes de consultar o anúncio", async () => {
  let buscas = 0;
  const { app } = carregarApiComDatabaseMock({
    buscarAnuncioPorId: async () => {
      buscas += 1;
      return undefined;
    },
  });

  assert.deepEqual(
    await requisitar(app, "/api/anuncios/14", {
      method: "DELETE",
      headers: { "X-Usuario-Id": "usuario-legado" },
    }),
    {
      status: 400,
      body: {
        erro: "O ID do usuário deve ser um UUID válido.",
      },
    },
  );
  assert.equal(buscas, 0);
});

test("rejeita usuarioId incompatível com a coluna UUID antes de consultar o banco", async () => {
  let consultas = 0;
  const { app } = carregarApiComDatabaseMock({
    listarAnuncios: async () => {
      consultas += 1;
      return [];
    },
  });

  assert.deepEqual(
    await requisitar(app, "/api/anuncios?usuarioId=usuario-legado"),
    {
      status: 400,
      body: {
        erro: "Filtros de anúncios inválidos.",
        campos: {
          usuarioId: "O ID do usuário deve ser um UUID válido.",
        },
      },
    },
  );
  assert.equal(consultas, 0);
});

test("rejeições assíncronas do banco chegam ao middleware de erro do Express 5", async () => {
  const { app } = carregarApiComDatabaseMock({
    listarAnuncios: async () => {
      throw new Error("detalhe interno que não pode vazar");
    },
  });
  const consoleErrorOriginal = console.error;

  console.error = () => {};

  try {
    assert.deepEqual(await requisitar(app, "/api/anuncios"), {
      status: 500,
      body: {
        erro: "Não foi possível processar a solicitação.",
      },
    });
  } finally {
    console.error = consoleErrorOriginal;
  }
});
