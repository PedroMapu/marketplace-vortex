"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");

const {
  schemaOferta,
  schemaMensagemOferta,
  schemaParametroOferta,
} = require("../validacao");
const { mapearOferta, mapearMensagemOferta } = require("../database");

test("valida valores, mensagens e identificadores de oferta", () => {
  assert.deepEqual(
    schemaOferta.parse({
      valor: 199.9,
      mensagem: "  Tenho interesse.  ",
    }),
    {
      valor: 199.9,
      mensagem: "Tenho interesse.",
    },
  );
  assert.deepEqual(schemaMensagemOferta.parse({ conteudo: "  Olá!  " }), {
    conteudo: "Olá!",
  });
  assert.equal(schemaParametroOferta.parse({ id: "17" }).id, 17);

  for (const entrada of [
    { valor: -1, mensagem: "Olá" },
    { valor: 1_000_000.01, mensagem: "Olá" },
    { valor: 1.001, mensagem: "Olá" },
    { valor: 10, mensagem: " " },
    { valor: 10, mensagem: "a".repeat(2_001) },
    { valor: 10, mensagem: "Olá", campo: true },
  ]) {
    assert.equal(schemaOferta.safeParse(entrada).success, false);
  }
  assert.equal(
    schemaMensagemOferta.safeParse({ conteudo: "", extra: true }).success,
    false,
  );
});

test("mapeia ofertas e mensagens do PostgreSQL para DTOs camelCase", () => {
  const oferta = mapearOferta({
    id: "8",
    anuncio_id: "42",
    anuncio_nome: "Bicicleta",
    anuncio_imagem_url: "",
    valor: "450.00",
    mensagem: "Tenho interesse.",
    comprador_id: COMPRADOR_ID,
    comprador_nome: "Ana",
    anunciante_id: ANUNCIANTE_ID,
    anunciante_nome: "Beto",
    criado_em: "2026-07-30 12:00:00+00",
    atualizado_em: new Date("2026-07-30T12:05:00.000Z"),
  });
  const mensagem = mapearMensagemOferta({
    id: "9",
    oferta_id: "8",
    autor_id: ANUNCIANTE_ID,
    autor_nome: "Beto",
    conteudo: "Combinado.",
    criado_em: "2026-07-30 12:05:00+00",
  });

  assert.deepEqual(oferta, {
    id: 8,
    anuncioId: 42,
    anuncioNome: "Bicicleta",
    anuncioImagemUrl: "",
    valor: 450,
    mensagem: "Tenho interesse.",
    compradorId: COMPRADOR_ID,
    compradorNome: "Ana",
    anuncianteId: ANUNCIANTE_ID,
    anuncianteNome: "Beto",
    criadaEm: "2026-07-30T12:00:00.000Z",
    atualizadaEm: "2026-07-30T12:05:00.000Z",
  });
  assert.deepEqual(mensagem, {
    id: 9,
    ofertaId: 8,
    autorId: ANUNCIANTE_ID,
    autorNome: "Beto",
    conteudo: "Combinado.",
    criadaEm: "2026-07-30T12:05:00.000Z",
  });
});

const COMPRADOR_ID = "11111111-1111-4111-8111-111111111111";
const ANUNCIANTE_ID = "22222222-2222-4222-8222-222222222222";
