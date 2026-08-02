"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const jwt = require("jsonwebtoken");

const {
  criarToken,
  verificarToken,
  usuarioPublico,
  validarConfiguracaoAuth,
  JWT_ISSUER,
  JWT_AUDIENCE,
} = require("../auth");

const SEGREDO_ORIGINAL = process.env.JWT_SECRET;
const SEGREDO_TESTE = "segredo-de-testes-com-mais-de-32-bytes!";
const USUARIO = {
  id: "79ce52fb-1acf-455c-8d91-54e09a77e76b",
  nome: "Ana",
  email: "ana@example.com",
  senhaHash: "nao-deve-aparecer",
};

test.afterEach(() => {
  if (SEGREDO_ORIGINAL === undefined) {
    delete process.env.JWT_SECRET;
  } else {
    process.env.JWT_SECRET = SEGREDO_ORIGINAL;
  }
});

test("cria JWT HS256 com sub e escopo mínimos, sem PII redundante", () => {
  process.env.JWT_SECRET = SEGREDO_TESTE;

  const token = criarToken(USUARIO);
  const cabecalho = jwt.decode(token, { complete: true }).header;
  const payload = verificarToken(token);

  assert.equal(cabecalho.alg, "HS256");
  assert.equal(payload.sub, USUARIO.id);
  assert.equal(payload.iss, JWT_ISSUER);
  assert.equal(payload.aud, JWT_AUDIENCE);
  assert.equal(payload.nome, undefined);
  assert.equal(payload.email, undefined);
  assert.ok(payload.exp - payload.iat <= 24 * 60 * 60);
  assert.ok(payload.exp - payload.iat >= 24 * 60 * 60 - 1);
});

test("cria JWT de 30 dias para a opção manter conectado", () => {
  process.env.JWT_SECRET = SEGREDO_TESTE;

  const token = criarToken(USUARIO, { manterConectado: true });
  const payload = verificarToken(token);
  const trintaDiasEmSegundos = 30 * 24 * 60 * 60;

  assert.ok(payload.exp - payload.iat <= trintaDiasEmSegundos);
  assert.ok(payload.exp - payload.iat >= trintaDiasEmSegundos - 1);
});

test("rejeita segredo ausente ou menor que 32 bytes", () => {
  delete process.env.JWT_SECRET;
  assert.throws(validarConfiguracaoAuth, /JWT_SECRET é obrigatória/);

  process.env.JWT_SECRET = "curto";
  assert.throws(validarConfiguracaoAuth, /no mínimo 32 bytes/);
});

test("usuarioPublico nunca inclui senha nem hash", () => {
  assert.deepEqual(usuarioPublico(USUARIO), {
    id: USUARIO.id,
    nome: USUARIO.nome,
    email: USUARIO.email,
    fotoPerfilUrl: null,
  });
});
