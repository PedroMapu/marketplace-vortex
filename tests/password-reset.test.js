"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const {
  confirmarRedefinicaoSenha,
  gerarTokenRedefinicao,
  hashTokenRedefinicao,
  solicitarRedefinicaoSenha,
  TOKEN_TTL_MS,
} = require("../password-reset");

test("gera token aleatório no formato base64url e hash SHA-256", () => {
  const primeiro = gerarTokenRedefinicao();
  const segundo = gerarTokenRedefinicao();

  assert.match(primeiro, /^[A-Za-z0-9_-]{43}$/);
  assert.notEqual(primeiro, segundo);
  assert.match(hashTokenRedefinicao(primeiro), /^[a-f0-9]{64}$/);
  assert.equal(hashTokenRedefinicao(primeiro).includes(primeiro), false);
});

test("solicitação normaliza e-mail e persiste somente hash com expiração curta", async () => {
  const token = "a".repeat(43);
  const agora = new Date("2026-08-01T12:00:00.000Z");
  let dadosRegistrados;

  const resultado = await solicitarRedefinicaoSenha(
    "  ANA@EXAMPLE.COM ",
    {
      agora: () => agora,
      gerarToken: () => token,
      registrarToken: async (dados) => {
        dadosRegistrados = dados;
        return true;
      },
    },
  );

  assert.deepEqual(resultado, {});
  assert.deepEqual(dadosRegistrados, {
    email: "ana@example.com",
    tokenHash: hashTokenRedefinicao(token),
    expiraEm: new Date(agora.getTime() + TOKEN_TTL_MS),
  });
  assert.equal(JSON.stringify(dadosRegistrados).includes(token), false);
});

test("token em texto só retorna quando a chamada habilita exposição explicitamente", async () => {
  const token = "b".repeat(43);
  const resultado = await solicitarRedefinicaoSenha("ana@example.com", {
    exporToken: true,
    gerarToken: () => token,
    registrarToken: async () => false,
  });

  assert.deepEqual(resultado, {
    tokenDesenvolvimento: token,
  });
});

test("confirmação entrega apenas hashes à função atômica do banco", async () => {
  const token = "c".repeat(43);
  let dadosRecebidos;

  const redefinida = await confirmarRedefinicaoSenha(
    token,
    "nova-senha-segura",
    {
      criarHashSenha: async (senha) => `hash:${senha}`,
      redefinirSenha: async (dados) => {
        dadosRecebidos = dados;
        return true;
      },
    },
  );

  assert.equal(redefinida, true);
  assert.deepEqual(dadosRecebidos, {
    tokenHash: hashTokenRedefinicao(token),
    senhaHash: "hash:nova-senha-segura",
  });
  assert.equal(JSON.stringify(dadosRecebidos).includes(token), false);
});
