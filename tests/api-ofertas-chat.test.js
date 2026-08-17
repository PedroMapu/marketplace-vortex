"use strict";

const assert = require("node:assert/strict");
const { once } = require("node:events");
const test = require("node:test");

const caminhoApi = require.resolve("../api");
const caminhoDatabase = require.resolve("../database");
const caminhoMiddlewareAuth = require.resolve("../middleware-auth");
const COMPRADOR_ID = "11111111-1111-4111-8111-111111111111";
const ANUNCIANTE_ID = "22222222-2222-4222-8222-222222222222";
const TERCEIRO_ID = "33333333-3333-4333-8333-333333333333";
const usuarios = {
  comprador: {
    id: COMPRADOR_ID,
    nome: "Comprador",
    email: "comprador@example.com",
  },
  anunciante: {
    id: ANUNCIANTE_ID,
    nome: "Anunciante",
    email: "anunciante@example.com",
  },
  terceiro: {
    id: TERCEIRO_ID,
    nome: "Terceiro",
    email: "terceiro@example.com",
  },
};

function carregarApiComOfertasEmMemoria() {
  const ofertas = [];
  const mensagens = [];
  const anuncios = [
    {
      id: 10,
      nome: "Sintetizador",
      imagemUrl: "data:image/png;base64,iVBORw0KGgo=",
      valor: 800,
      usuarioId: ANUNCIANTE_ID,
      usuarioNome: "Anunciante",
    },
    {
      id: 11,
      nome: "Anúncio próprio",
      imagemUrl: "",
      valor: 50,
      usuarioId: COMPRADOR_ID,
      usuarioNome: "Comprador",
    },
  ];
  let proximaOfertaId = 1;
  let proximaMensagemId = 1;

  const databaseMock = {
    async buscarAnuncioPorId(id) {
      return anuncios.find((anuncio) => anuncio.id === id);
    },
    async criarOferta(dados) {
      const anuncio = anuncios.find(
        (item) =>
          item.id === dados.anuncioId &&
          item.usuarioId !== dados.compradorId,
      );

      if (!anuncio) {
        return undefined;
      }

      const instante = "2026-07-30T15:00:00.000Z";
      const comprador = Object.values(usuarios).find(
        ({ id }) => id === dados.compradorId,
      );
      const oferta = {
        id: proximaOfertaId++,
        anuncioId: anuncio.id,
        anuncioNome: anuncio.nome,
        anuncioConcluidoEm: anuncio.concluidoEm ?? null,
        valor: dados.valor,
        mensagem: dados.mensagem,
        compradorId: comprador.id,
        compradorNome: comprador.nome,
        anuncianteId: anuncio.usuarioId,
        anuncianteNome: anuncio.usuarioNome,
        criadaEm: instante,
        atualizadaEm: instante,
      };
      ofertas.push(oferta);
      mensagens.push({
        id: proximaMensagemId++,
        ofertaId: oferta.id,
        autorId: comprador.id,
        autorNome: comprador.nome,
        conteudo: dados.mensagem,
        criadaEm: instante,
      });
      return oferta;
    },
    async listarOfertasDoUsuario(usuarioId) {
      return ofertas.filter(
        ({ compradorId, anuncianteId }) =>
          compradorId === usuarioId || anuncianteId === usuarioId,
      );
    },
    async buscarOfertaPorId(id) {
      return ofertas.find((oferta) => oferta.id === id);
    },
    async listarMensagensDaOferta(ofertaId, usuarioId) {
      const oferta = ofertas.find(({ id }) => id === ofertaId);

      if (
        !oferta ||
        (oferta.compradorId !== usuarioId &&
          oferta.anuncianteId !== usuarioId)
      ) {
        return [];
      }

      return mensagens.filter((mensagem) => mensagem.ofertaId === ofertaId);
    },
    async criarMensagemOferta(dados) {
      const oferta = ofertas.find(({ id }) => id === dados.ofertaId);

      if (
        !oferta ||
        (oferta.compradorId !== dados.autorId &&
          oferta.anuncianteId !== dados.autorId)
      ) {
        return undefined;
      }

      const autor = Object.values(usuarios).find(
        ({ id }) => id === dados.autorId,
      );
      const mensagem = {
        id: proximaMensagemId++,
        ofertaId: oferta.id,
        autorId: autor.id,
        autorNome: autor.nome,
        conteudo: dados.conteudo,
        criadaEm: "2026-07-30T15:01:00.000Z",
      };
      mensagens.push(mensagem);
      return mensagem;
    },
    async listarAnuncios() {
      return anuncios;
    },
    async registrarCliqueDetalhes() {
      return undefined;
    },
    async verificarConexao() {
      return true;
    },
  };
  const modulosOriginais = new Map(
    [caminhoDatabase, caminhoMiddlewareAuth].map((caminho) => [
      caminho,
      require.cache[caminho],
    ]),
  );

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
      autenticarBearer(request, response, next) {
        const chave = /^Bearer (.+)$/u.exec(
          request.get("Authorization") ?? "",
        )?.[1];
        const usuario = usuarios[chave];

        if (!usuario) {
          return response.status(401).json({
            erro: "Autenticação necessária.",
            codigo: "NAO_AUTENTICADO",
          });
        }

        request.usuario = usuario;
        return next();
      },
    },
  };
  delete require.cache[caminhoApi];
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

test("oferta inicia conversa, aparece aos participantes e aceita mensagens", async (t) => {
  const { app, restaurar } = carregarApiComOfertasEmMemoria();
  t.after(restaurar);
  const servidor = app.listen(0, "127.0.0.1");
  await once(servidor, "listening");
  t.after(async () => {
    servidor.close();
    await once(servidor, "close");
  });
  const baseUrl = `http://127.0.0.1:${servidor.address().port}`;

  const criacao = await requisitar(baseUrl, "/api/anuncios/10/ofertas", {
    method: "POST",
    token: "comprador",
    body: { valor: 725.5, mensagem: "Aceita esta proposta?" },
  });

  assert.equal(criacao.status, 201);
  assert.deepEqual(criacao.body, {
    id: 1,
    anuncioId: 10,
    anuncioNome: "Sintetizador",
    anuncioConcluidoEm: null,
    valor: 725.5,
    mensagem: "Aceita esta proposta?",
    compradorId: COMPRADOR_ID,
    compradorNome: "Comprador",
    anuncianteId: ANUNCIANTE_ID,
    anuncianteNome: "Anunciante",
    criadaEm: "2026-07-30T15:00:00.000Z",
    atualizadaEm: "2026-07-30T15:00:00.000Z",
  });

  for (const token of ["comprador", "anunciante"]) {
    const listagem = await requisitar(baseUrl, "/api/ofertas", { token });
    assert.equal(listagem.status, 200);
    assert.deepEqual(listagem.body, [criacao.body]);
  }
  assert.deepEqual(
    await requisitar(baseUrl, "/api/ofertas", { token: "terceiro" }),
    { status: 200, body: [] },
  );

  const resposta = await requisitar(
    baseUrl,
    "/api/ofertas/1/mensagens",
    {
      method: "POST",
      token: "anunciante",
      body: { conteudo: "Sim. Podemos combinar a entrega." },
    },
  );
  assert.equal(resposta.status, 201);
  assert.equal(resposta.body.autorNome, "Anunciante");

  const historico = await requisitar(
    baseUrl,
    "/api/ofertas/1/mensagens",
    { token: "comprador" },
  );
  assert.equal(historico.status, 200);
  assert.deepEqual(
    historico.body.map(({ conteudo }) => conteudo),
    ["Aceita esta proposta?", "Sim. Podemos combinar a entrega."],
  );
});

test("bloqueia oferta própria, payload inválido e acesso de terceiro", async (t) => {
  const { app, restaurar } = carregarApiComOfertasEmMemoria();
  t.after(restaurar);
  const servidor = app.listen(0, "127.0.0.1");
  await once(servidor, "listening");
  t.after(async () => {
    servidor.close();
    await once(servidor, "close");
  });
  const baseUrl = `http://127.0.0.1:${servidor.address().port}`;

  const propria = await requisitar(baseUrl, "/api/anuncios/11/ofertas", {
    method: "POST",
    token: "comprador",
    body: { valor: 45, mensagem: "Minha própria oferta" },
  });
  assert.deepEqual(propria, {
    status: 403,
    body: {
      erro: "Você não pode fazer uma oferta no seu próprio anúncio.",
      codigo: "OFERTA_PROPRIO_ANUNCIO",
    },
  });

  const invalida = await requisitar(baseUrl, "/api/anuncios/10/ofertas", {
    method: "POST",
    token: "comprador",
    body: { valor: 10.999, mensagem: " " },
  });
  assert.equal(invalida.status, 400);
  assert.equal(invalida.body.codigo, "VALIDACAO");

  await requisitar(baseUrl, "/api/anuncios/10/ofertas", {
    method: "POST",
    token: "comprador",
    body: { valor: 700, mensagem: "Oferta válida" },
  });
  const leituraAlheia = await requisitar(
    baseUrl,
    "/api/ofertas/1/mensagens",
    { token: "terceiro" },
  );
  assert.deepEqual(leituraAlheia, {
    status: 403,
    body: {
      erro: "Você não participa desta conversa.",
      codigo: "OFERTA_SEM_ACESSO",
    },
  });
});
