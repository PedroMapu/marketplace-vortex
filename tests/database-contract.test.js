"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");

const {
  buscarFotoPerfilUsuarioPorId,
  atualizarAnuncioPorId,
  listarPaginaAnuncios,
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
        {
          foto_perfil_url: "data:image/png;base64,iVBORw0KGgo=",
          foto_perfil_versao: "abc123",
        },
      ],
    };
  };

  try {
    assert.deepEqual(await buscarFotoPerfilUsuarioPorId(id), {
      fotoPerfilUrl: "data:image/png;base64,iVBORw0KGgo=",
      versao: "abc123",
    });
    assert.match(consulta.texto, /SELECT\s+foto_perfil_url/u);
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
      foto_perfil_versao: "abc123",
    }),
    {
      id: "d7ff9c07-4409-4cf3-9458-6a7bd8d94104",
      nome: "Pedro",
      email: "pedro@edu.unifor.br",
      fotoPerfilUrl:
        "/api/usuarios/d7ff9c07-4409-4cf3-9458-6a7bd8d94104/foto?v=abc123",
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
    imagem_versao: "def456",
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
    imagemUrl: "/api/anuncios/42/imagem?v=def456",
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

test("pagina anúncios por cursor com limite constante e índice ordenável", async () => {
  const queryOriginal = pool.query;
  let consulta;
  const criarLinha = (id, criadoEm) => ({
    id,
    nome: `Anúncio ${id}`,
    categoria: "livros",
    condicao: "usado",
    modalidade: "doacao",
    valor: "0",
    localizacao: "Campus",
    descricao: "Descrição",
    imagem_versao: null,
    usuario_id: "7dba9ebd-70e4-44b2-baaa-f30bfb92cf92",
    usuario_nome: "Ana",
    criado_em: criadoEm,
  });

  pool.query = async (texto, parametros) => {
    consulta = { texto, parametros };
    return {
      rows: [
        criarLinha(9, "2026-08-03T12:00:00.000Z"),
        criarLinha(8, "2026-08-02T12:00:00.000Z"),
        criarLinha(7, "2026-08-01T12:00:00.000Z"),
      ],
    };
  };

  try {
    const pagina = await listarPaginaAnuncios({
      categoria: "livros",
      limite: 2,
      cursor: { criadoEm: "2026-08-04T12:00:00.000Z", id: 10 },
    });

    assert.deepEqual(pagina.anuncios.map(({ id }) => id), [9, 8]);
    assert.deepEqual(pagina.proximoCursor, {
      criadoEm: "2026-08-02T12:00:00.000Z",
      id: 8,
    });
    assert.match(
      consulta.texto,
      /\(a\.criado_em, a\.id\) < \(\$3::timestamptz, \$4::integer\)/u,
    );
    assert.match(consulta.texto, /ORDER BY a\.criado_em DESC, a\.id DESC/u);
    assert.match(consulta.texto, /LIMIT \$5/u);
    assert.deepEqual(consulta.parametros, [
      "livros",
      null,
      "2026-08-04T12:00:00.000Z",
      10,
      3,
    ]);
  } finally {
    pool.query = queryOriginal;
  }
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

test("atualiza metadados sem apagar a imagem quando o PATCH a omite", async () => {
  const queryOriginal = pool.query;
  let consulta;

  pool.query = async (texto, parametros) => {
    consulta = { texto, parametros };
    return {
      rows: [
        {
          id: 9,
          nome: "Livro atualizado",
          categoria: "livros",
          condicao: "usado",
          modalidade: "doacao",
          valor: "0",
          localizacao: "Biblioteca",
          descricao: "Nova descrição.",
          imagem_versao: "abc123",
          usuario_id: "7dba9ebd-70e4-44b2-baaa-f30bfb92cf92",
          usuario_nome: "Ana",
          criado_em: "2026-07-31T12:00:00.000Z",
        },
      ],
    };
  };

  try {
    await atualizarAnuncioPorId(
      9,
      "7dba9ebd-70e4-44b2-baaa-f30bfb92cf92",
      {
        nome: "Livro atualizado",
        categoria: "livros",
        condicao: "usado",
        modalidade: "doacao",
        valor: 0,
        localizacao: "Biblioteca",
        descricao: "Nova descrição.",
      },
    );

    assert.match(
      consulta.texto,
      /imagem_url = COALESCE\(\$10, imagem_url\)/u,
    );
    assert.equal(consulta.parametros[9], null);
  } finally {
    pool.query = queryOriginal;
  }
});
