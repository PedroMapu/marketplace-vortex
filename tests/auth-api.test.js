"use strict";

const assert = require("node:assert/strict");
const { once } = require("node:events");
const test = require("node:test");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const caminhoApi = require.resolve("../api");
const caminhoDatabase = require.resolve("../database");
const caminhoMiddlewareAuth = require.resolve("../middleware-auth");
const caminhoPasswordReset = require.resolve("../password-reset");
const caminhoRotasPasswordReset = require.resolve("../password-reset-routes");
const USUARIO = {
  id: "79ce52fb-1acf-455c-8d91-54e09a77e76b",
  nome: "Ana",
  email: "ana@edu.unifor.br",
  fotoPerfilUrl: null,
};
const SEGREDO_ORIGINAL = process.env.JWT_SECRET;

function carregarApiComDatabaseMock(sobrescritas = {}) {
  const databaseMock = {
    criarUsuario: async () => USUARIO,
    buscarUsuarioPorEmail: async () => undefined,
    buscarUsuarioPorId: async () => undefined,
    buscarPerfilUsuarioPorId: async () => undefined,
    atualizarFotoPerfilUsuario: async () => undefined,
    listarAnuncios: async () => [],
    criarAnuncio: async (anuncio) => anuncio,
    buscarAnuncioPorId: async () => undefined,
    excluirAnuncioPorId: async () => false,
    verificarConexao: async () => true,
    ...sobrescritas,
  };
  const moduloDatabaseOriginal = require.cache[caminhoDatabase];
  const moduloMiddlewareOriginal = require.cache[caminhoMiddlewareAuth];
  const moduloPasswordResetOriginal = require.cache[caminhoPasswordReset];
  const moduloRotasPasswordResetOriginal =
    require.cache[caminhoRotasPasswordReset];

  require.cache[caminhoDatabase] = {
    id: caminhoDatabase,
    filename: caminhoDatabase,
    loaded: true,
    exports: databaseMock,
  };
  delete require.cache[caminhoApi];
  delete require.cache[caminhoMiddlewareAuth];
  delete require.cache[caminhoPasswordReset];
  delete require.cache[caminhoRotasPasswordReset];

  try {
    return require(caminhoApi);
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

    if (moduloPasswordResetOriginal) {
      require.cache[caminhoPasswordReset] = moduloPasswordResetOriginal;
    } else {
      delete require.cache[caminhoPasswordReset];
    }

    if (moduloRotasPasswordResetOriginal) {
      require.cache[caminhoRotasPasswordReset] =
        moduloRotasPasswordResetOriginal;
    } else {
      delete require.cache[caminhoRotasPasswordReset];
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
      ...(opcoes.incluirHeaders ? { headers: resposta.headers } : {}),
    };
  } finally {
    servidor.close();
    await once(servidor, "close");
  }
}

test.beforeEach(() => {
  process.env.JWT_SECRET = "segredo-de-testes-com-mais-de-32-bytes!";
});

test.afterEach(() => {
  if (SEGREDO_ORIGINAL === undefined) {
    delete process.env.JWT_SECRET;
  } else {
    process.env.JWT_SECRET = SEGREDO_ORIGINAL;
  }
});

test("cadastro normaliza dados, armazena somente hash e responde sessão", async () => {
  let dadosRecebidos;
  const app = carregarApiComDatabaseMock({
    criarUsuario: async (dados) => {
      dadosRecebidos = dados;
      return USUARIO;
    },
  });

  const resposta = await requisitar(app, "/api/auth/register", {
    method: "POST",
    incluirHeaders: true,
    body: {
      nome: "  Ana  ",
      email: "  ANA@EDU.UNIFOR.BR ",
      senha: "senha-segura",
    },
  });

  assert.equal(resposta.status, 201);
  assert.equal(resposta.headers.get("cache-control"), "no-store");
  assert.deepEqual(resposta.body.usuario, USUARIO);
  assert.equal(typeof resposta.body.token, "string");
  assert.deepEqual(
    {
      nome: dadosRecebidos.nome,
      email: dadosRecebidos.email,
    },
    {
      nome: "Ana",
      email: "ana@edu.unifor.br",
    },
  );
  assert.equal("senha" in dadosRecebidos, false);
  assert.equal(await bcrypt.compare("senha-segura", dadosRecebidos.senhaHash), true);
  assert.equal(JSON.stringify(resposta.body).includes("senha"), false);
});

test("cadastro converte unicidade do PostgreSQL em 409 seguro", async () => {
  const app = carregarApiComDatabaseMock({
    criarUsuario: async () => {
      const erro = new Error("detalhes internos");
      erro.code = "23505";
      throw erro;
    },
  });

  const resposta = await requisitar(app, "/api/auth/register", {
    method: "POST",
    body: {
      nome: "Ana",
      email: "ana@edu.unifor.br",
      senha: "senha-segura",
    },
  });

  assert.deepEqual(resposta, {
    status: 409,
    body: {
      erro: "Já existe uma conta com este e-mail.",
      codigo: "EMAIL_EM_USO",
      campos: {
        email: "Este e-mail já está cadastrado.",
      },
    },
  });
  assert.equal(JSON.stringify(resposta.body).includes("detalhes internos"), false);
  assert.equal("stack" in resposta.body, false);
});

test("login válido responde sessão e login inválido usa mensagem genérica", async () => {
  const senhaHash = await bcrypt.hash("senha-segura", 4);
  const app = carregarApiComDatabaseMock({
    buscarUsuarioPorEmail: async (email) =>
      email === USUARIO.email ? { ...USUARIO, senhaHash } : undefined,
  });

  const loginValido = await requisitar(app, "/api/auth/login", {
    method: "POST",
    body: {
      email: "ANA@EDU.UNIFOR.BR",
      senha: "senha-segura",
    },
  });
  const loginInvalido = await requisitar(app, "/api/auth/login", {
    method: "POST",
    body: {
      email: "ana@edu.unifor.br",
      senha: "senha-errada",
    },
  });
  const loginInexistente = await requisitar(app, "/api/auth/login", {
    method: "POST",
    body: {
      email: "ninguem@example.com",
      senha: "senha-errada",
    },
  });

  assert.equal(loginValido.status, 200);
  assert.deepEqual(loginValido.body.usuario, USUARIO);
  assert.equal(typeof loginValido.body.token, "string");
  assert.deepEqual(loginInvalido, {
    status: 401,
    body: {
      erro: "E-mail ou senha inválidos.",
      codigo: "CREDENCIAIS_INVALIDAS",
    },
  });
  assert.deepEqual(loginInexistente, loginInvalido);
});

test("login com manter conectado emite uma sessão de 30 dias", async () => {
  const senhaHash = await bcrypt.hash("senha-segura", 4);
  const app = carregarApiComDatabaseMock({
    buscarUsuarioPorEmail: async () => ({ ...USUARIO, senhaHash }),
  });

  const resposta = await requisitar(app, "/api/auth/login", {
    method: "POST",
    body: {
      email: USUARIO.email,
      senha: "senha-segura",
      manterConectado: true,
    },
  });
  const payload = jwt.decode(resposta.body.token);
  const trintaDiasEmSegundos = 30 * 24 * 60 * 60;

  assert.equal(resposta.status, 200);
  assert.ok(payload.exp - payload.iat <= trintaDiasEmSegundos);
  assert.ok(payload.exp - payload.iat >= trintaDiasEmSegundos - 1);
});

test("GET /api/auth/me usa a identidade carregada pelo Bearer", async () => {
  const app = carregarApiComDatabaseMock({
    buscarUsuarioPorId: async (id) => (id === USUARIO.id ? USUARIO : undefined),
  });
  const cadastro = await requisitar(app, "/api/auth/register", {
    method: "POST",
    body: {
      nome: "Ana",
      email: "ana@edu.unifor.br",
      senha: "senha-segura",
    },
  });
  const resposta = await requisitar(
    app,
    `/api/auth/me?usuarioId=${encodeURIComponent(
      "4dc9a1ff-4be3-4d35-9ef7-514a7a3a19f5",
    )}&usuarioNome=Usu%C3%A1rio%20falsificado`,
    {
    headers: {
      Authorization: `Bearer ${cadastro.body.token}`,
      "X-Usuario-Id": "4dc9a1ff-4be3-4d35-9ef7-514a7a3a19f5",
    },
    },
  );

  assert.deepEqual(resposta, {
    status: 200,
    body: {
      usuario: USUARIO,
    },
  });
});

test("PATCH /api/auth/me/foto atualiza e remove a foto do usuário autenticado", async () => {
  const fotoPerfilUrl = "data:image/png;base64,iVBORw0KGgo=";
  const atualizacoes = [];
  const app = carregarApiComDatabaseMock({
    buscarUsuarioPorId: async (id) => (id === USUARIO.id ? USUARIO : undefined),
    atualizarFotoPerfilUsuario: async (id, foto) => {
      atualizacoes.push({ id, foto });
      return { ...USUARIO, fotoPerfilUrl: foto };
    },
  });
  const cadastro = await requisitar(app, "/api/auth/register", {
    method: "POST",
    body: {
      nome: "Ana",
      email: "ana@edu.unifor.br",
      senha: "senha-segura",
    },
  });
  const headers = {
    Authorization: `Bearer ${cadastro.body.token}`,
  };

  const atualizada = await requisitar(app, "/api/auth/me/foto", {
    method: "PATCH",
    headers,
    body: { fotoPerfilUrl },
  });
  const removida = await requisitar(app, "/api/auth/me/foto", {
    method: "PATCH",
    headers,
    body: { fotoPerfilUrl: null },
  });

  assert.equal(atualizada.status, 200);
  assert.equal(atualizada.body.usuario.fotoPerfilUrl, fotoPerfilUrl);
  assert.equal(removida.status, 200);
  assert.equal(removida.body.usuario.fotoPerfilUrl, null);
  assert.deepEqual(atualizacoes, [
    { id: USUARIO.id, foto: fotoPerfilUrl },
    { id: USUARIO.id, foto: null },
  ]);
});
