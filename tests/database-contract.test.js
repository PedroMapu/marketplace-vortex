"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");

const {
  buscarFotoPerfilUsuarioPorId,
  mapearAnuncio,
  mapearUsuario,
  pool,
} = require("../database");

test("consulta somente a foto pública do perfil pelo usuário", async () => {
  const queryOriginal = pool.query;
  const id = "d7ff9c07-4409-4cf3-9458-6a7bd8d94104";
  let consulta;

  pool.query = async (texto, parametros) => {
    consulta = { texto, parametros };
    return {
      rows: [
        { foto_perfil_url: "data:image/png;base64,iVBORw0KGgo=" },
      ],
    };
  };

  try {
    assert.deepEqual(await buscarFotoPerfilUsuarioPorId(id), {
      fotoPerfilUrl: "data:image/png;base64,iVBORw0KGgo=",
    });
    assert.match(consulta.texto, /SELECT foto_perfil_url/u);
    assert.deepEqual(consulta.parametros, [id]);
  } finally {
    pool.query = queryOriginal;
  }
});

test("mapeia a foto de perfil do usuário sem expor snake_case", () => {
  assert.deepEqual(
    mapearUsuario({
      id: "d7ff9c07-4409-4cf3-9458-6a7bd8d94104",
      nome: "Pedro",
      email: "pedro@edu.unifor.br",
      foto_perfil_url: "data:image/png;base64,iVBORw0KGgo=",
    }),
    {
      id: "d7ff9c07-4409-4cf3-9458-6a7bd8d94104",
      nome: "Pedro",
      email: "pedro@edu.unifor.br",
      fotoPerfilUrl: "data:image/png;base64,iVBORw0KGgo=",
    },
  );
});

test("mapeia a linha do PostgreSQL para o DTO esperado pelo frontend", () => {
  const criadoEm = new Date("2026-07-31T14:30:45.123Z");

  const anuncio = mapearAnuncio({
    id: 42,
    nome: "Calculadora científica",
    categoria: "eletronicos",
    condicao: "usado",
    modalidade: "venda",
    valor: "89.90",
    localizacao: "Fortaleza - CE",
    descricao: "Funcionando normalmente.",
    imagem_url: "data:image/png;base64,abc",
    usuario_id: "d7ff9c07-4409-4cf3-9458-6a7bd8d94104",
    usuario_nome: "Pedro",
    criado_em: criadoEm,
    cliques_detalhes: "17",
  });

  assert.deepEqual(anuncio, {
    id: 42,
    nome: "Calculadora científica",
    categoria: "eletronicos",
    condicao: "usado",
    modalidade: "venda",
    valor: 89.9,
    localizacao: "Fortaleza - CE",
    descricao: "Funcionando normalmente.",
    imagemUrl: "data:image/png;base64,abc",
    usuarioId: "d7ff9c07-4409-4cf3-9458-6a7bd8d94104",
    usuarioNome: "Pedro",
    criadoEm: "2026-07-31T14:30:45.123Z",
    cliquesDetalhes: 17,
    concluidoEm: null,
  });

  assert.equal(typeof anuncio.id, "number");
  assert.equal(typeof anuncio.valor, "number");
  assert.equal(typeof anuncio.cliquesDetalhes, "number");
});

test("normaliza timestamps textuais sem expor nomes snake_case", () => {
  const anuncio = mapearAnuncio({
    id: "7",
    nome: "Livro",
    categoria: "livros",
    condicao: "seminovo",
    modalidade: "doacao",
    valor: "0.00",
    localizacao: "Recife - PE",
    descricao: "Doação.",
    imagem_url: "",
    usuario_id: "7dba9ebd-70e4-44b2-baaa-f30bfb92cf92",
    usuario_nome: "Ana",
    criado_em: "2026-07-31 12:00:00+00",
  });

  assert.equal(anuncio.id, 7);
  assert.equal(anuncio.valor, 0);
  assert.equal(anuncio.criadoEm, "2026-07-31T12:00:00.000Z");
  assert.deepEqual(
    Object.keys(anuncio),
    [
      "id",
      "nome",
      "categoria",
      "condicao",
      "modalidade",
      "valor",
      "localizacao",
      "descricao",
      "imagemUrl",
      "usuarioId",
      "usuarioNome",
      "criadoEm",
      "cliquesDetalhes",
      "concluidoEm",
    ],
  );
  assert.equal("imagem_url" in anuncio, false);
  assert.equal("usuario_id" in anuncio, false);
  assert.equal("usuario_nome" in anuncio, false);
  assert.equal("criado_em" in anuncio, false);
});
