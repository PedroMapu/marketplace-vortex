"use strict";

const {
  solicitarRedefinicaoSenha,
  confirmarRedefinicaoSenha,
} = require("./password-reset");
const {
  schemaSolicitacaoRedefinicao,
  schemaConfirmacaoRedefinicao,
  senhaValida,
} = require("./validacao");
const { responderErro, validarComSchema } = require("./erros-api");

function emailValido(email) {
  return schemaSolicitacaoRedefinicao.safeParse({ email }).success;
}

function tokenValido(token) {
  return schemaConfirmacaoRedefinicao
    .safeParse({ token, novaSenha: "12345678" }).success;
}

function tokenPodeSerExpostoNoAmbiente() {
  const ambientesPermitidos = new Set(["development", "test"]);

  return (
    ambientesPermitidos.has(process.env.NODE_ENV) &&
    process.env.PASSWORD_RESET_EXPOSE_TOKEN === "true"
  );
}

function registrarRotasRedefinicaoSenha(app, opcoes = {}) {
  const solicitar =
    opcoes.solicitarRedefinicaoSenha ?? solicitarRedefinicaoSenha;
  const confirmar =
    opcoes.confirmarRedefinicaoSenha ?? confirmarRedefinicaoSenha;

  app.post(
    "/api/auth/password-reset/request",
    async (request, response) => {
      response.set("Cache-Control", "no-store");
      const validacao = validarComSchema(
        schemaSolicitacaoRedefinicao,
        request.body,
      );

      if (!validacao.sucesso) {
        return responderErro(
          response,
          400,
          "Dados para redefinição inválidos.",
          "VALIDACAO",
          validacao.campos,
        );
      }

      const resultado = await solicitar(validacao.dados.email, {
        exporToken: tokenPodeSerExpostoNoAmbiente(),
      });
      const corpo = {
        mensagem:
          "Se existir uma conta com este e-mail, uma solicitação de redefinição foi registrada.",
      };

      if (resultado.tokenDesenvolvimento) {
        corpo.tokenDesenvolvimento = resultado.tokenDesenvolvimento;
      }

      return response.status(202).json(corpo);
    },
  );

  app.post(
    "/api/auth/password-reset/confirm",
    async (request, response) => {
      response.set("Cache-Control", "no-store");
      const validacao = validarComSchema(
        schemaConfirmacaoRedefinicao,
        request.body,
      );

      if (!validacao.sucesso) {
        return responderErro(
          response,
          400,
          "Dados para redefinição inválidos.",
          "VALIDACAO",
          validacao.campos,
        );
      }

      const redefinida = await confirmar(
        validacao.dados.token,
        validacao.dados.novaSenha,
      );

      if (!redefinida) {
        return responderErro(
          response,
          400,
          "Token de redefinição inválido ou expirado.",
          "TOKEN_REDEFINICAO_INVALIDO",
        );
      }

      return response.status(200).json({
        mensagem: "Senha redefinida com sucesso.",
      });
    },
  );
}

module.exports = {
  registrarRotasRedefinicaoSenha,
  emailValido,
  senhaValida,
  tokenValido,
  tokenPodeSerExpostoNoAmbiente,
};
