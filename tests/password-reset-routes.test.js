"use strict";

const assert = require("node:assert/strict");
const { once } = require("node:events");
const test = require("node:test");
const express = require("express");
const {
  registrarRotasRedefinicaoSenha,
  senhaValida,
  tokenPodeSerExpostoNoAmbiente,
} = require("../password-reset-routes");

const TOKEN = "d".repeat(43);
const NODE_ENV_ORIGINAL = process.env.NODE_ENV;
const EXPOSICAO_ORIGINAL = process.env.PASSWORD_RESET_EXPOSE_TOKEN;

function criarApp(opcoes = {}) {
  const app = express();
  app.use(express.json());
  registrarRotasRedefinicaoSenha(app, opcoes);
  return app;
}

async function requisitar(app, caminho, body) {
  const servidor = app.listen(0, "127.0.0.1");
  await once(servidor, "listening");

  try {
    const { port } = servidor.address();
    const resposta = await fetch(`http://127.0.0.1:${port}${caminho}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    return {
      status: resposta.status,
      headers: resposta.headers,
      body: await resposta.json(),
    };
  } finally {
    servidor.close();
    await once(servidor, "close");
  }
}

test.afterEach(() => {
  if (NODE_ENV_ORIGINAL === undefined) {
    delete process.env.NODE_ENV;
  } else {
    process.env.NODE_ENV = NODE_ENV_ORIGINAL;
  }

  if (EXPOSICAO_ORIGINAL === undefined) {
    delete process.env.PASSWORD_RESET_EXPOSE_TOKEN;
  } else {
    process.env.PASSWORD_RESET_EXPOSE_TOKEN = EXPOSICAO_ORIGINAL;
  }
});

test("solicitação válida sempre usa resposta genérica e não armazenável", async () => {
  const emails = [];
  const app = criarApp({
    solicitarRedefinicaoSenha: async (email) => {
      emails.push(email);
      return {};
    },
  });
  const existente = await requisitar(
    app,
    "/api/auth/password-reset/request",
    { email: "existente@example.com" },
  );
  const inexistente = await requisitar(
    app,
    "/api/auth/password-reset/request",
    { email: "inexistente@example.com" },
  );

  assert.equal(existente.status, 202);
  assert.equal(inexistente.status, 202);
  assert.deepEqual(existente.body, inexistente.body);
  assert.equal(existente.headers.get("cache-control"), "no-store");
  assert.deepEqual(emails, [
    "existente@example.com",
    "inexistente@example.com",
  ]);
});

test("falha do provedor não revela que a conta existe", async () => {
  const falhas = [];
  const app = criarApp({
    solicitarRedefinicaoSenha: async (email, opcoes) => {
      await opcoes.entregarToken({ email, token: TOKEN });
      return {};
    },
    enviarEmailRedefinicao: async () => {
      throw new Error("provedor indisponível");
    },
    registrarFalhaEntrega: (erro) => {
      falhas.push(erro.message);
    },
  });

  const resposta = await requisitar(
    app,
    "/api/auth/password-reset/request",
    { email: "existente@example.com" },
  );

  assert.equal(resposta.status, 202);
  assert.equal(resposta.headers.get("cache-control"), "no-store");
  assert.deepEqual(resposta.body, {
    mensagem:
      "Se existir uma conta com este e-mail, uma solicitação de redefinição foi registrada.",
  });
  assert.deepEqual(falhas, ["provedor indisponível"]);
});

test("produção nunca autoriza exposição do token", () => {
  process.env.NODE_ENV = "production";
  process.env.PASSWORD_RESET_EXPOSE_TOKEN = "true";

  assert.equal(tokenPodeSerExpostoNoAmbiente(), false);
});

test("ambiente ausente ou desconhecido falha fechado para exposição do token", () => {
  process.env.PASSWORD_RESET_EXPOSE_TOKEN = "true";
  delete process.env.NODE_ENV;
  assert.equal(tokenPodeSerExpostoNoAmbiente(), false);

  process.env.NODE_ENV = "staging";
  assert.equal(tokenPodeSerExpostoNoAmbiente(), false);
});

test("token de desenvolvimento exige ambiente não produtivo e opt-in explícito", async () => {
  process.env.NODE_ENV = "development";
  process.env.PASSWORD_RESET_EXPOSE_TOKEN = "true";
  let opcoesRecebidas;
  const app = criarApp({
    solicitarRedefinicaoSenha: async (email, opcoes) => {
      opcoesRecebidas = opcoes;
      return { tokenDesenvolvimento: TOKEN };
    },
  });
  const resposta = await requisitar(
    app,
    "/api/auth/password-reset/request",
    { email: "ana@example.com" },
  );

  assert.deepEqual(opcoesRecebidas, { exporToken: true });
  assert.equal(resposta.body.tokenDesenvolvimento, TOKEN);
});

test("confirmação diferencia sucesso de token expirado ou já consumido", async () => {
  let chamadas = 0;
  const app = criarApp({
    confirmarRedefinicaoSenha: async () => {
      chamadas += 1;
      return chamadas === 1;
    },
  });
  const dados = {
    token: TOKEN,
    novaSenha: "nova-senha-segura",
  };
  const primeira = await requisitar(
    app,
    "/api/auth/password-reset/confirm",
    dados,
  );
  const segunda = await requisitar(
    app,
    "/api/auth/password-reset/confirm",
    dados,
  );

  assert.equal(primeira.status, 200);
  assert.equal(segunda.status, 400);
  assert.equal(segunda.body.codigo, "TOKEN_REDEFINICAO_INVALIDO");
});

test("nova senha respeita o limite de 8 a 72 bytes, não caracteres", () => {
  assert.equal(senhaValida("12345678"), true);
  assert.equal(senhaValida("1234567"), false);
  assert.equal(senhaValida("á".repeat(36)), true);
  assert.equal(senhaValida(`a${"á".repeat(36)}`), false);
});
