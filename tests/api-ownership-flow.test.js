"use strict";

const assert = require("node:assert/strict");
const { randomUUID } = require("node:crypto");
const { once } = require("node:events");
const test = require("node:test");

const caminhoApi = require.resolve("../api");
const caminhoDatabase = require.resolve("../database");
const caminhoMiddlewareAuth = require.resolve("../middleware-auth");
const caminhoPasswordReset = require.resolve("../password-reset");
const caminhoRotasPasswordReset = require.resolve("../password-reset-routes");
const SEGREDO_ORIGINAL = process.env.JWT_SECRET;

function carregarApiComBancoEmMemoria() {
  const usuarios = [];
  const anuncios = [];
  let proximoId = 1;
  const databaseMock = {
    async criarUsuario(dados) {
      if (usuarios.some(({ email }) => email === dados.email)) {
        const erro = new Error("unique_violation");
        erro.code = "23505";
        throw erro;
      }

      const usuario = { id: randomUUID(), ...dados };
      usuarios.push(usuario);
      return {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      };
    },
    async buscarUsuarioPorEmail(email) {
      return usuarios.find((usuario) => usuario.email === email);
    },
    async buscarUsuarioPorId(id) {
      return usuarios.find((usuario) => usuario.id === id);
    },
    async listarAnuncios(filtros = {}) {
      return anuncios.filter(
        (anuncio) =>
          (!filtros.usuarioId || anuncio.usuarioId === filtros.usuarioId) &&
          (!filtros.categoria || anuncio.categoria === filtros.categoria),
      );
    },
    async criarAnuncio(dados) {
      const anuncio = {
        id: proximoId++,
        ...dados,
        criadoEm: new Date().toISOString(),
      };
      anuncios.push(anuncio);
      return anuncio;
    },
    async buscarAnuncioPorId(id) {
      return anuncios.find((anuncio) => anuncio.id === id);
    },
    async atualizarAnuncioPorId(id, usuarioId, dados) {
      const anuncio = anuncios.find(
        (item) => item.id === id && item.usuarioId === usuarioId,
      );

      if (!anuncio) {
        return undefined;
      }

      Object.assign(anuncio, dados);
      return anuncio;
    },
    async excluirAnuncioPorId(id, usuarioId) {
      const indice = anuncios.findIndex(
        (anuncio) => anuncio.id === id && anuncio.usuarioId === usuarioId,
      );

      if (indice === -1) {
        return false;
      }

      anuncios.splice(indice, 1);
      return true;
    },
    async verificarConexao() {
      return true;
    },
    async registrarTokenRedefinicaoSenha() {
      return false;
    },
    async redefinirSenhaComToken() {
      return false;
    },
  };
  const modulosOriginais = new Map(
    [
      caminhoDatabase,
      caminhoMiddlewareAuth,
      caminhoPasswordReset,
      caminhoRotasPasswordReset,
    ].map((caminho) => [caminho, require.cache[caminho]]),
  );

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

  const app = require(caminhoApi);

  return {
    app,
    restaurar() {
      delete require.cache[caminhoApi];

      for (const [caminho, modulo] of modulosOriginais) {
        if (modulo) {
          require.cache[caminho] = modulo;
        } else {
          delete require.cache[caminho];
        }
      }
    },
  };
}

async function requisitar(baseUrl, caminho, opcoes = {}) {
  const resposta = await fetch(`${baseUrl}${caminho}`, {
    method: opcoes.method ?? "GET",
    headers: {
      ...(opcoes.body === undefined
        ? {}
        : { "Content-Type": "application/json" }),
      ...(opcoes.token
        ? { Authorization: `Bearer ${opcoes.token}` }
        : {}),
    },
    body:
      opcoes.body === undefined ? undefined : JSON.stringify(opcoes.body),
  });

  return {
    status: resposta.status,
    body: await resposta.json(),
  };
}

test("dois usuários mantêm autoria, listagem própria e exclusão isoladas", async (t) => {
  process.env.JWT_SECRET = "segredo-de-testes-com-mais-de-32-bytes!";
  t.after(() => {
    if (SEGREDO_ORIGINAL === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = SEGREDO_ORIGINAL;
    }
  });

  const { app, restaurar } = carregarApiComBancoEmMemoria();
  t.after(restaurar);
  const servidor = app.listen(0, "127.0.0.1");
  await once(servidor, "listening");
  t.after(async () => {
    servidor.close();
    await once(servidor, "close");
  });
  const { port } = servidor.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  const cadastrar = (nome, email) =>
    requisitar(baseUrl, "/api/auth/register", {
      method: "POST",
      body: { nome, email, senha: "senha-segura" },
    });
  const ana = await cadastrar("Ana", "ana.fluxo@edu.unifor.br");
  const bruno = await cadastrar("Bruno", "bruno.fluxo@edu.unifor.br");

  assert.equal(ana.status, 201);
  assert.equal(bruno.status, 201);
  assert.notEqual(ana.body.usuario.id, bruno.body.usuario.id);

  const criacao = await requisitar(baseUrl, "/api/anuncios", {
    method: "POST",
    token: ana.body.token,
    body: {
      nome: "Mesa lateral",
      categoria: "casa",
      condicao: "usado",
      modalidade: "venda",
      valor: 125.5,
      localizacao: "Fortaleza",
      descricao: "Madeira maciça",
      imagemUrl: "data:image/png;base64,iVBORw0KGgo=",
    },
  });
  assert.equal(criacao.status, 201);
  assert.equal(criacao.body.usuarioId, ana.body.usuario.id);
  assert.equal(criacao.body.usuarioNome, "Ana");

  const anunciosDaAna = await requisitar(baseUrl, "/api/anuncios/me", {
    token: ana.body.token,
  });
  const anunciosDoBruno = await requisitar(baseUrl, "/api/anuncios/me", {
    token: bruno.body.token,
  });
  assert.deepEqual(
    anunciosDaAna.body.map(({ id }) => id),
    [criacao.body.id],
  );
  assert.deepEqual(anunciosDoBruno.body, []);

  const edicaoAlheia = await requisitar(
    baseUrl,
    `/api/anuncios/${criacao.body.id}`,
    {
      method: "PATCH",
      token: bruno.body.token,
      body: {
        nome: "Alteração indevida",
        categoria: "casa",
        condicao: "novo",
        modalidade: "doacao",
        valor: 0,
        localizacao: "Outro local",
        descricao: "Não deve ser aplicada.",
        imagemUrl: "data:image/png;base64,iVBORw0KGgo=",
      },
    },
  );
  assert.equal(edicaoAlheia.status, 403);

  const edicaoProprietaria = await requisitar(
    baseUrl,
    `/api/anuncios/${criacao.body.id}`,
    {
      method: "PATCH",
      token: ana.body.token,
      body: {
        nome: "Mesa lateral atualizada",
        categoria: "casa",
        condicao: "seminovo",
        modalidade: "venda",
        valor: 110,
        localizacao: "Bloco Q",
        descricao: "Madeira maciça, revisada.",
        imagemUrl: "data:image/png;base64,iVBORw0KGgo=",
      },
    },
  );
  assert.equal(edicaoProprietaria.status, 200);
  assert.equal(edicaoProprietaria.body.nome, "Mesa lateral atualizada");
  assert.equal(edicaoProprietaria.body.usuarioId, ana.body.usuario.id);

  const exclusaoAlheia = await requisitar(
    baseUrl,
    `/api/anuncios/${criacao.body.id}`,
    { method: "DELETE", token: bruno.body.token },
  );
  assert.deepEqual(exclusaoAlheia, {
    status: 403,
    body: {
      erro: "Você só pode excluir os seus próprios anúncios.",
      codigo: "ANUNCIO_ALHEIO",
    },
  });
  assert.equal(
    (await requisitar(baseUrl, "/api/anuncios")).body.length,
    1,
  );

  const exclusaoProprietaria = await requisitar(
    baseUrl,
    `/api/anuncios/${criacao.body.id}`,
    { method: "DELETE", token: ana.body.token },
  );
  assert.equal(exclusaoProprietaria.status, 200);
  assert.deepEqual((await requisitar(baseUrl, "/api/anuncios")).body, []);
});
