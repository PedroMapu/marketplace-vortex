const assert = require("node:assert/strict");
const { once } = require("node:events");
const test = require("node:test");

const caminhoApi = require.resolve("../api");
const caminhoDatabase = require.resolve("../database");
const caminhoMiddlewareAuth = require.resolve("../middleware-auth");
const USUARIO_ID = "ea11c83e-a7b1-4ba4-9d27-1bbf94a6e945";
const USUARIO_AUTENTICADO = {
  id: USUARIO_ID,
  nome: "Ana",
  email: "ana@example.com",
};
const USUARIO_ID_FALSIFICADO = "4dc9a1ff-4be3-4d35-9ef7-514a7a3a19f5";

function carregarApiComDatabaseMock(sobrescritas = {}, opcoes = {}) {
  const databaseMock = {
    buscarFotoPerfilUsuarioPorId: async () => undefined,
    listarAnuncios: async () => [],
    listarPaginaAnuncios: async () => ({
      anuncios: [],
      proximoCursor: null,
    }),
    criarAnuncio: async (anuncio) => anuncio,
    atualizarAnuncioPorId: async () => undefined,
    buscarAnuncioPorId: async () => undefined,
    buscarImagemAnuncioPorId: async () => undefined,
    excluirAnuncioPorId: async () => false,
    registrarCliqueDetalhes: async () => undefined,
    verificarConexao: async () => true,
    ...sobrescritas,
  };
  const moduloDatabaseOriginal = require.cache[caminhoDatabase];
  const moduloMiddlewareOriginal = require.cache[caminhoMiddlewareAuth];

  require.cache[caminhoDatabase] = {
    id: caminhoDatabase,
    filename: caminhoDatabase,
    loaded: true,
    exports: databaseMock,
  };
  require.cache[caminhoMiddlewareAuth] = {
    id: caminhoMiddlewareAuth,
    filename: caminhoMiddlewareAuth,
    loaded: true,
    exports: {
      autenticarBearer:
        opcoes.autenticarBearer ??
        ((request, response, next) => {
          request.usuario = USUARIO_AUTENTICADO;
          return next();
        }),
    },
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

    if (moduloMiddlewareOriginal) {
      require.cache[caminhoMiddlewareAuth] = moduloMiddlewareOriginal;
    } else {
      delete require.cache[caminhoMiddlewareAuth];
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

async function requisitarBinario(app, caminho, headers = {}) {
  const servidor = app.listen(0, "127.0.0.1");
  await once(servidor, "listening");

  try {
    const { port } = servidor.address();
    const resposta = await fetch(`http://127.0.0.1:${port}${caminho}`, {
      headers,
    });

    return {
      status: resposta.status,
      contentType: resposta.headers.get("content-type"),
      cacheControl: resposta.headers.get("cache-control"),
      nosniff: resposta.headers.get("x-content-type-options"),
      etag: resposta.headers.get("etag"),
      body: Buffer.from(await resposta.arrayBuffer()),
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
      codigo: "SERVICO_INDISPONIVEL",
    },
  });
});

test("GET /api/usuarios/:id/foto entrega a foto real do perfil", async () => {
  const foto = Buffer.from("iVBORw0KGgo=", "base64");
  let usuarioConsultado;
  const { app } = carregarApiComDatabaseMock({
    buscarFotoPerfilUsuarioPorId: async (id) => {
      usuarioConsultado = id;
      return {
        fotoPerfilUrl: "data:image/png;base64,iVBORw0KGgo=",
        versao: "abc123",
      };
    },
  });

  assert.deepEqual(
    await requisitarBinario(
      app,
      `/api/usuarios/${USUARIO_ID}/foto?v=abc123`,
    ),
    {
      status: 200,
      contentType: "image/png",
      cacheControl: "public, max-age=31536000, immutable",
      nosniff: "nosniff",
      etag: '"abc123"',
      body: foto,
    },
  );
  assert.equal(usuarioConsultado, USUARIO_ID);
});

test("GET /api/anuncios/:id/imagem entrega mídia versionada sem incluí-la no DTO", async () => {
  const imagem = Buffer.from("/9j/", "base64");
  let anuncioConsultado;
  const { app } = carregarApiComDatabaseMock({
    buscarImagemAnuncioPorId: async (id) => {
      anuncioConsultado = id;
      return {
        imagemUrl: "data:image/jpeg;base64,/9j/",
        versao: "def456",
      };
    },
  });

  assert.deepEqual(
    await requisitarBinario(app, "/api/anuncios/42/imagem?v=def456"),
    {
      status: 200,
      contentType: "image/jpeg",
      cacheControl: "public, max-age=31536000, immutable",
      nosniff: "nosniff",
      etag: '"def456"',
      body: imagem,
    },
  );
  assert.equal(anuncioConsultado, 42);
});

test("GET /api/usuarios/:id/foto usa 404 quando o perfil não tem foto", async () => {
  const { app } = carregarApiComDatabaseMock({
    buscarFotoPerfilUsuarioPorId: async () => ({ fotoPerfilUrl: null }),
  });

  assert.deepEqual(
    await requisitar(app, `/api/usuarios/${USUARIO_ID}/foto`),
    {
      status: 404,
      body: {
        erro: "Foto de perfil não encontrada.",
        codigo: "FOTO_PERFIL_NAO_ENCONTRADA",
      },
    },
  );
});

test("GET /api/usuarios/:id/foto rejeita ID inválido antes do banco", async () => {
  let consultas = 0;
  const { app } = carregarApiComDatabaseMock({
    buscarFotoPerfilUsuarioPorId: async () => {
      consultas += 1;
      return undefined;
    },
  });

  assert.deepEqual(await requisitar(app, "/api/usuarios/invalido/foto"), {
    status: 400,
    body: {
      erro: "Parâmetro de usuário inválido.",
      codigo: "VALIDACAO",
      campos: {
        id: "O ID do usuário deve ser um UUID válido.",
      },
    },
  });
  assert.equal(consultas, 0);
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

test("GET /api/anuncios pagina por cursor sem repetir o catálogo inteiro", async () => {
  const anuncio = {
    id: 12,
    nome: "Calculadora",
    criadoEm: "2026-07-28T12:00:00.000Z",
  };
  const filtrosRecebidos = [];
  const { app } = carregarApiComDatabaseMock({
    listarPaginaAnuncios: async (filtros) => {
      filtrosRecebidos.push(filtros);
      return filtros.cursor
        ? { anuncios: [], proximoCursor: null }
        : {
            anuncios: [anuncio],
            proximoCursor: {
              criadoEm: anuncio.criadoEm,
              id: anuncio.id,
            },
          };
    },
  });

  const primeiraPagina = await requisitar(
    app,
    "/api/anuncios?categoria=eletronicos&limite=12",
  );

  assert.equal(primeiraPagina.status, 200);
  assert.deepEqual(primeiraPagina.body.anuncios, [anuncio]);
  assert.equal(typeof primeiraPagina.body.proximoCursor, "string");

  const segundaPagina = await requisitar(
    app,
    `/api/anuncios?categoria=eletronicos&limite=12&cursor=${primeiraPagina.body.proximoCursor}`,
  );

  assert.deepEqual(segundaPagina, {
    status: 200,
    body: { anuncios: [], proximoCursor: null },
  });
  assert.deepEqual(filtrosRecebidos, [
    { categoria: "eletronicos", limite: 12, cursor: null },
    {
      categoria: "eletronicos",
      limite: 12,
      cursor: { criadoEm: anuncio.criadoEm, id: anuncio.id },
    },
  ]);
});

test("GET /api/anuncios rejeita cursor de paginação adulterado", async () => {
  const { app } = carregarApiComDatabaseMock();

  assert.deepEqual(
    await requisitar(app, "/api/anuncios?limite=12&cursor=nao-e-json"),
    {
      status: 400,
      body: {
        erro: "Cursor de paginação inválido.",
        codigo: "VALIDACAO",
        campos: { cursor: "O cursor de paginação é inválido." },
      },
    },
  );
});

test("GET /api/anuncios/:id entrega um anúncio público ativo", async () => {
  const anuncio = {
    id: 12,
    nome: "Calculadora",
    concluidoEm: null,
  };
  const consultas = [];
  const { app } = carregarApiComDatabaseMock({
    buscarAnuncioPorId: async (id) => {
      consultas.push(id);
      return anuncio;
    },
  });

  assert.deepEqual(await requisitar(app, "/api/anuncios/12"), {
    status: 200,
    body: anuncio,
  });
  assert.deepEqual(consultas, [12]);
});

test("GET /api/anuncios/:id não publica anúncios concluídos", async () => {
  const { app } = carregarApiComDatabaseMock({
    buscarAnuncioPorId: async () => ({
      id: 12,
      nome: "Calculadora",
      concluidoEm: "2026-08-12T12:00:00.000Z",
    }),
  });

  assert.deepEqual(await requisitar(app, "/api/anuncios/12"), {
    status: 404,
    body: {
      erro: "Anúncio não encontrado.",
      codigo: "ANUNCIO_NAO_ENCONTRADO",
    },
  });
});

test("GET /api/anuncios/:id valida o identificador antes de consultar o banco", async () => {
  let consultas = 0;
  const { app } = carregarApiComDatabaseMock({
    buscarAnuncioPorId: async () => {
      consultas += 1;
      return undefined;
    },
  });

  assert.deepEqual(await requisitar(app, "/api/anuncios/invalido"), {
    status: 400,
    body: {
      erro: "Parâmetro de anúncio inválido.",
      codigo: "VALIDACAO",
      campos: {
        id: "O ID deve ser um número inteiro positivo.",
      },
    },
  });
  assert.equal(consultas, 0);
});

test("POST /api/anuncios deriva autoria exclusivamente de request.usuario", async () => {
  const entrada = {
    nome: "  Mesa lateral  ",
    categoria: "casa",
    condicao: "usado",
    modalidade: "venda",
    valor: 125.5,
    localizacao: "  Fortaleza  ",
    descricao: "  Madeira maciça  ",
    imagemUrl: "  data:image/png;base64,iVBORw0KGgo=  ",
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
    imagemUrl: "data:image/png;base64,iVBORw0KGgo=",
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
    await requisitar(
      app,
      `/api/anuncios?usuarioId=${USUARIO_ID_FALSIFICADO}`,
      {
        method: "POST",
        body: entrada,
        headers: {
          Authorization: "Bearer token-valido",
          "X-Usuario-Id": USUARIO_ID_FALSIFICADO,
        },
      },
    ),
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
    imagemUrl: "data:image/png;base64,iVBORw0KGgo=",
    usuarioId: USUARIO_ID,
    usuarioNome: "Ana",
  });
});

test("POST /api/anuncios rejeita autoria enviada no corpo antes de criar", async () => {
  let criacoes = 0;
  const { app } = carregarApiComDatabaseMock({
    criarAnuncio: async () => {
      criacoes += 1;
    },
  });

  const resposta = await requisitar(app, "/api/anuncios", {
    method: "POST",
    headers: {
      Authorization: "Bearer token-valido",
    },
    body: {
      nome: "Mesa lateral",
      categoria: "casa",
      condicao: "usado",
      modalidade: "venda",
      valor: 125.5,
      localizacao: "Fortaleza",
      descricao: "Madeira maciça",
      imagemUrl: "data:image/png;base64,iVBORw0KGgo=",
      usuarioId: USUARIO_ID_FALSIFICADO,
      usuarioNome: "Usuário falsificado",
    },
  });

  assert.deepEqual(resposta, {
    status: 400,
    body: {
      erro: "Dados do anúncio inválidos.",
      codigo: "VALIDACAO",
      campos: {
        usuarioId: "A autoria do anúncio é definida pela sessão autenticada.",
        usuarioNome: "A autoria do anúncio é definida pela sessão autenticada.",
      },
    },
  });
  assert.equal(criacoes, 0);
});

test("PATCH /api/anuncios/:id preserva a imagem quando ela não é reenviada", async () => {
  const entrada = {
    nome: "  Calculadora atualizada  ",
    categoria: "eletronicos",
    condicao: "seminovo",
    modalidade: "venda",
    valor: 75.9,
    localizacao: "  Bloco D  ",
    descricao: "  Com capa protetora.  ",
  };
  const anuncioAtualizado = {
    id: 14,
    nome: "Calculadora atualizada",
    categoria: "eletronicos",
    condicao: "seminovo",
    modalidade: "venda",
    valor: 75.9,
    localizacao: "Bloco D",
    descricao: "Com capa protetora.",
    imagemUrl: "data:image/png;base64,iVBORw0KGgo=",
    usuarioId: USUARIO_ID,
    usuarioNome: "Ana",
    criadoEm: "2026-07-28T12:30:00.000Z",
    cliquesDetalhes: 4,
  };
  const chamadas = [];
  const { app } = carregarApiComDatabaseMock({
    buscarAnuncioPorId: async (id) => ({
      id,
      usuarioId: USUARIO_ID,
    }),
    atualizarAnuncioPorId: async (id, usuarioId, dados) => {
      chamadas.push({ id, usuarioId, dados });
      return anuncioAtualizado;
    },
  });

  assert.deepEqual(
    await requisitar(app, "/api/anuncios/14", {
      method: "PATCH",
      headers: {
        Authorization: "Bearer token-valido",
        "X-Usuario-Id": USUARIO_ID_FALSIFICADO,
      },
      body: entrada,
    }),
    {
      status: 200,
      body: anuncioAtualizado,
    },
  );
  assert.deepEqual(chamadas, [
    {
      id: 14,
      usuarioId: USUARIO_ID,
      dados: {
        nome: "Calculadora atualizada",
        categoria: "eletronicos",
        condicao: "seminovo",
        modalidade: "venda",
        valor: 75.9,
        localizacao: "Bloco D",
        descricao: "Com capa protetora.",
      },
    },
  ]);
});

test("PATCH /api/anuncios/:id impede edição de anúncio alheio", async () => {
  let atualizacoes = 0;
  const { app } = carregarApiComDatabaseMock({
    buscarAnuncioPorId: async (id) => ({
      id,
      usuarioId: USUARIO_ID_FALSIFICADO,
    }),
    atualizarAnuncioPorId: async () => {
      atualizacoes += 1;
    },
  });

  const resposta = await requisitar(app, "/api/anuncios/14", {
    method: "PATCH",
    headers: {
      Authorization: "Bearer token-valido",
    },
    body: {
      nome: "Calculadora",
      categoria: "eletronicos",
      condicao: "usado",
      modalidade: "venda",
      valor: 50,
      localizacao: "Bloco D",
      descricao: "Funcionando.",
      imagemUrl: "data:image/png;base64,iVBORw0KGgo=",
    },
  });

  assert.deepEqual(resposta, {
    status: 403,
    body: {
      erro: "Você só pode editar os seus próprios anúncios.",
      codigo: "ANUNCIO_ALHEIO",
    },
  });
  assert.equal(atualizacoes, 0);
});

test("DELETE deriva identidade de request.usuario apesar de query, cabeçalho e corpo falsificados", async () => {
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
    await requisitar(
      app,
      `/api/anuncios/14?usuarioId=${USUARIO_ID_FALSIFICADO}`,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer token-valido",
          "X-Usuario-Id": USUARIO_ID_FALSIFICADO,
        },
        body: {
          usuarioId: USUARIO_ID_FALSIFICADO,
          usuarioNome: "Usuário falsificado",
        },
      },
    ),
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

test("GET /api/anuncios/me filtra exclusivamente pelo usuário autenticado", async () => {
  let filtrosRecebidos;
  const { app } = carregarApiComDatabaseMock({
    listarAnuncios: async (filtros) => {
      filtrosRecebidos = filtros;
      return [];
    },
  });

  assert.deepEqual(
    await requisitar(
      app,
      `/api/anuncios/me?usuarioId=${USUARIO_ID_FALSIFICADO}`,
      {
        headers: {
          Authorization: "Bearer token-valido",
          "X-Usuario-Id": USUARIO_ID_FALSIFICADO,
        },
      },
    ),
    {
      status: 200,
      body: [],
    },
  );
  assert.deepEqual(filtrosRecebidos, {
    usuarioId: USUARIO_ID,
    incluirConcluidos: true,
  });
});

test("POST /api/anuncios/:id/cliques-detalhes registra o interesse sem exigir login", async () => {
  const chamadas = [];
  const { app } = carregarApiComDatabaseMock({
    registrarCliqueDetalhes: async (id) => {
      chamadas.push(id);
      return { id, cliquesDetalhes: 8 };
    },
  });

  assert.deepEqual(
    await requisitar(app, "/api/anuncios/14/cliques-detalhes", {
      method: "POST",
    }),
    {
      status: 200,
      body: {
        id: 14,
        cliquesDetalhes: 8,
      },
    },
  );
  assert.deepEqual(chamadas, [14]);
});

test("POST /api/anuncios/:id/cliques-detalhes responde 404 para anúncio ausente", async () => {
  const { app } = carregarApiComDatabaseMock({
    registrarCliqueDetalhes: async () => undefined,
  });

  assert.deepEqual(
    await requisitar(app, "/api/anuncios/999/cliques-detalhes", {
      method: "POST",
    }),
    {
      status: 404,
      body: {
        erro: "Anúncio não encontrado.",
        codigo: "ANUNCIO_NAO_ENCONTRADO",
      },
    },
  );
});

test("rotas protegidas recusam requisição sem sessão antes de consultar o banco", async () => {
  let consultas = 0;
  const { app } = carregarApiComDatabaseMock(
    {
      listarAnuncios: async () => {
        consultas += 1;
        return [];
      },
      criarAnuncio: async () => {
        consultas += 1;
      },
      buscarAnuncioPorId: async () => {
        consultas += 1;
      },
    },
    {
      autenticarBearer: (request, response) =>
        response.status(401).json({
          erro: "Autenticação necessária.",
          codigo: "NAO_AUTENTICADO",
        }),
    },
  );

  for (const [caminho, opcoes] of [
    ["/api/anuncios/me", {}],
    [
      "/api/anuncios",
      {
        method: "POST",
        body: {
          nome: "Mesa",
        },
      },
    ],
    ["/api/anuncios/14", { method: "DELETE" }],
  ]) {
    assert.deepEqual(await requisitar(app, caminho, opcoes), {
      status: 401,
      body: {
        erro: "Autenticação necessária.",
        codigo: "NAO_AUTENTICADO",
      },
    });
  }

  assert.equal(consultas, 0);
});

test("DELETE retorna 403 para anúncio alheio sem tentar excluí-lo", async () => {
  let exclusoes = 0;
  const { app } = carregarApiComDatabaseMock({
    buscarAnuncioPorId: async (id) => ({
      id,
      usuarioId: "4dc9a1ff-4be3-4d35-9ef7-514a7a3a19f5",
    }),
    excluirAnuncioPorId: async () => {
      exclusoes += 1;
      return true;
    },
  });

  assert.deepEqual(
    await requisitar(app, "/api/anuncios/14", {
      method: "DELETE",
      headers: { Authorization: "Bearer token-valido" },
    }),
    {
      status: 403,
      body: {
        erro: "Você só pode excluir os seus próprios anúncios.",
        codigo: "ANUNCIO_ALHEIO",
      },
    },
  );
  assert.equal(exclusoes, 0);
});

test("DELETE retorna 404 para anúncio inexistente", async () => {
  let exclusoes = 0;
  const { app } = carregarApiComDatabaseMock({
    buscarAnuncioPorId: async () => undefined,
    excluirAnuncioPorId: async () => {
      exclusoes += 1;
      return true;
    },
  });

  assert.deepEqual(
    await requisitar(app, "/api/anuncios/14", {
      method: "DELETE",
      headers: { Authorization: "Bearer token-valido" },
    }),
    {
      status: 404,
      body: {
        erro: "Anúncio não encontrado.",
        codigo: "ANUNCIO_NAO_ENCONTRADO",
      },
    },
  );
  assert.equal(exclusoes, 0);
});

test("DELETE rejeita parâmetro inválido com 400 antes de consultar o banco", async () => {
  let consultas = 0;
  const { app } = carregarApiComDatabaseMock({
    buscarAnuncioPorId: async () => {
      consultas += 1;
    },
  });

  assert.deepEqual(
    await requisitar(app, "/api/anuncios/0", {
      method: "DELETE",
      headers: { Authorization: "Bearer token-valido" },
    }),
    {
      status: 400,
      body: {
        erro: "Parâmetro de anúncio inválido.",
        codigo: "VALIDACAO",
        campos: {
          id: "O ID deve ser um número inteiro positivo.",
        },
      },
    },
  );
  assert.equal(consultas, 0);
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
        codigo: "VALIDACAO",
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
  const registrosDeErro = [];

  console.error = (...argumentos) => {
    registrosDeErro.push(argumentos);
  };

  try {
    const resposta = await requisitar(app, "/api/anuncios");

    assert.deepEqual(resposta, {
      status: 500,
      body: {
        erro: "Não foi possível processar a solicitação.",
        codigo: "ERRO_INTERNO",
      },
    });
    assert.equal(
      JSON.stringify(resposta.body).includes(
        "detalhe interno que não pode vazar",
      ),
      false,
    );
    assert.equal("stack" in resposta.body, false);
    assert.equal(
      JSON.stringify(registrosDeErro).includes(
        "detalhe interno que não pode vazar",
      ),
      false,
    );
  } finally {
    console.error = consoleErrorOriginal;
  }
});
