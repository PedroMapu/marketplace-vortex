"use strict";

const { createHash } = require("node:crypto");

const RESEND_API_URL = "https://api.resend.com/emails";

function obterConfiguracaoEmailRedefinicao(env = process.env) {
  const apiKey = env.RESEND_API_KEY?.trim();
  const remetente = env.PASSWORD_RESET_FROM_EMAIL?.trim();
  const origemFrontend = env.PASSWORD_RESET_FRONTEND_ORIGIN?.trim();

  if (!apiKey || !remetente || !origemFrontend) {
    throw new Error(
      "Configure RESEND_API_KEY, PASSWORD_RESET_FROM_EMAIL e PASSWORD_RESET_FRONTEND_ORIGIN para entregar redefinições de senha.",
    );
  }

  let origem;

  try {
    origem = new URL(origemFrontend);
  } catch {
    throw new Error("PASSWORD_RESET_FRONTEND_ORIGIN deve ser uma URL HTTP(S) válida.");
  }

  if (!['http:', 'https:'].includes(origem.protocol)) {
    throw new Error("PASSWORD_RESET_FRONTEND_ORIGIN deve usar HTTP ou HTTPS.");
  }

  return {
    apiKey,
    remetente,
    origemFrontend: origem.origin,
  };
}

function validarConfiguracaoEmailRedefinicao(env = process.env) {
  if (env.NODE_ENV !== "production") {
    return;
  }

  obterConfiguracaoEmailRedefinicao(env);
}

function criarLinkRedefinicao(token, origemFrontend) {
  const url = new URL("/redefinir-senha", origemFrontend);
  url.searchParams.set("token", token);
  return url.toString();
}

async function enviarEmailRedefinicao(
  { email, token },
  { fetchImpl = globalThis.fetch, env = process.env } = {},
) {
  if (typeof fetchImpl !== "function") {
    throw new Error("O ambiente não oferece suporte ao envio de e-mail.");
  }

  const configuracao = obterConfiguracaoEmailRedefinicao(env);
  const link = criarLinkRedefinicao(token, configuracao.origemFrontend);
  const idempotencia = createHash("sha256").update(token).digest("hex");
  const resposta = await fetchImpl(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${configuracao.apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `vortex-password-reset-${idempotencia}`,
    },
    body: JSON.stringify({
      from: configuracao.remetente,
      to: [email],
      subject: "Redefina sua senha do Marketplace Vortex",
      text: [
        "Recebemos uma solicitação para redefinir sua senha do Marketplace Vortex.",
        "",
        `Abra este link nos próximos 15 minutos: ${link}`,
        "",
        "Se você não fez essa solicitação, ignore esta mensagem.",
      ].join("\n"),
      html: `<p>Recebemos uma solicitação para redefinir sua senha do Marketplace Vortex.</p><p><a href="${link}">Redefinir minha senha</a></p><p>O link expira em 15 minutos. Se você não fez essa solicitação, ignore esta mensagem.</p>`,
    }),
  });

  if (!resposta.ok) {
    throw new Error(`Não foi possível entregar o e-mail de redefinição (${resposta.status}).`);
  }
}

module.exports = {
  criarLinkRedefinicao,
  enviarEmailRedefinicao,
  obterConfiguracaoEmailRedefinicao,
  validarConfiguracaoEmailRedefinicao,
  RESEND_API_URL,
};
