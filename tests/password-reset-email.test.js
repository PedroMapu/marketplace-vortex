"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const {
  criarLinkRedefinicao,
  enviarEmailRedefinicao,
  obterConfiguracaoEmailRedefinicao,
} = require("../password-reset-email");

const ENV_TESTE = {
  RESEND_API_KEY: "re_teste",
  PASSWORD_RESET_FROM_EMAIL: "Vortex <contato@vortex.test>",
  PASSWORD_RESET_FRONTEND_ORIGIN: "https://vortex.test",
};

test("cria link HTTPS com token codificado", () => {
  assert.equal(
    criarLinkRedefinicao("a_b-c", "https://vortex.test"),
    "https://vortex.test/redefinir-senha?token=a_b-c",
  );
});

test("exige configuração completa de entrega", () => {
  assert.throws(
    () => obterConfiguracaoEmailRedefinicao({}),
    /RESEND_API_KEY/,
  );
});

test("envia mensagem transacional sem expor credenciais", async () => {
  let requisicao;

  await enviarEmailRedefinicao(
    { email: "ana@edu.unifor.br", token: "a".repeat(43) },
    {
      env: ENV_TESTE,
      fetchImpl: async (url, opcoes) => {
        requisicao = { url, opcoes };
        return { ok: true, status: 200 };
      },
    },
  );

  const corpo = JSON.parse(requisicao.opcoes.body);
  assert.equal(requisicao.url, "https://api.resend.com/emails");
  assert.equal(corpo.to[0], "ana@edu.unifor.br");
  assert.match(corpo.text, /\/redefinir-senha\?token=/);
  assert.equal(
    requisicao.opcoes.headers.Authorization,
    "Bearer re_teste",
  );
  assert.equal(JSON.stringify(corpo).includes("re_teste"), false);
});
