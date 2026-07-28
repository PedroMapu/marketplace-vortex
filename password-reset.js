"use strict";

const { createHash, randomBytes } = require("node:crypto");
const bcrypt = require("bcryptjs");
const {
  registrarTokenRedefinicaoSenha,
  redefinirSenhaComToken,
} = require("./database");

const TOKEN_BYTES = 32;
const TOKEN_TTL_MS = 15 * 60 * 1000;
const BCRYPT_CUSTO = 12;

function hashTokenRedefinicao(token) {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

function gerarTokenRedefinicao() {
  return randomBytes(TOKEN_BYTES).toString("base64url");
}

async function solicitarRedefinicaoSenha(email, opcoes = {}) {
  const gerarToken = opcoes.gerarToken ?? gerarTokenRedefinicao;
  const registrarToken =
    opcoes.registrarToken ?? registrarTokenRedefinicaoSenha;
  const agora = opcoes.agora?.() ?? new Date();
  const token = gerarToken();
  const expiraEm = new Date(agora.getTime() + TOKEN_TTL_MS);

  /*
   * O token é criado mesmo quando o e-mail não existe. Assim, a rota pode
   * devolver exatamente o mesmo status e corpo sem revelar contas cadastradas.
   */
  await registrarToken({
    email: email.trim().toLowerCase(),
    tokenHash: hashTokenRedefinicao(token),
    expiraEm,
  });

  return opcoes.exporToken === true
    ? { tokenDesenvolvimento: token }
    : {};
}

async function confirmarRedefinicaoSenha(token, novaSenha, opcoes = {}) {
  const criarHashSenha =
    opcoes.criarHashSenha ??
    ((senha) => bcrypt.hash(senha, BCRYPT_CUSTO));
  const redefinir = opcoes.redefinirSenha ?? redefinirSenhaComToken;
  const senhaHash = await criarHashSenha(novaSenha);

  return redefinir({
    tokenHash: hashTokenRedefinicao(token),
    senhaHash,
  });
}

module.exports = {
  solicitarRedefinicaoSenha,
  confirmarRedefinicaoSenha,
  gerarTokenRedefinicao,
  hashTokenRedefinicao,
  TOKEN_BYTES,
  TOKEN_TTL_MS,
};
