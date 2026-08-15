"use strict";

const jwt = require("jsonwebtoken");

const JWT_ALGORITMO = "HS256";
const JWT_ISSUER = "marketplace-vortex-api";
const JWT_AUDIENCE = "marketplace-vortex-web";
const JWT_EXPIRACAO = "24h";
const JWT_EXPIRACAO_PERSISTENTE = "30d";
const JWT_SEGREDO_MINIMO_BYTES = 32;

function obterSegredoJwt() {
  const segredo = process.env.JWT_SECRET;

  if (
    typeof segredo !== "string" ||
    Buffer.byteLength(segredo, "utf8") < JWT_SEGREDO_MINIMO_BYTES
  ) {
    throw new Error(
      `JWT_SECRET é obrigatória e deve ter no mínimo ${JWT_SEGREDO_MINIMO_BYTES} bytes.`,
    );
  }

  return segredo;
}

function usuarioPublico(usuario) {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    fotoPerfilUrl: usuario.fotoPerfilUrl ?? null,
  };
}

function criarToken(usuario, { manterConectado = false } = {}) {
  const usuarioSeguro = usuarioPublico(usuario);

  // O JWT identifica a conta apenas pelo subject. Nome, e-mail e foto são
  // consultados no servidor para que mudanças de perfil não fiquem congeladas.
  return jwt.sign({}, obterSegredoJwt(), {
    algorithm: JWT_ALGORITMO,
    subject: usuarioSeguro.id,
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
    expiresIn: manterConectado
      ? JWT_EXPIRACAO_PERSISTENTE
      : JWT_EXPIRACAO,
  });
}

function verificarToken(token) {
  // Fixar algoritmo, emissor e audiência impede aceitar tokens válidos em
  // outros contextos ou assinados com uma configuração inesperada.
  return jwt.verify(token, obterSegredoJwt(), {
    algorithms: [JWT_ALGORITMO],
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  });
}

function validarConfiguracaoAuth() {
  obterSegredoJwt();
}

module.exports = {
  criarToken,
  verificarToken,
  usuarioPublico,
  validarConfiguracaoAuth,
  JWT_ALGORITMO,
  JWT_ISSUER,
  JWT_AUDIENCE,
  JWT_EXPIRACAO,
  JWT_EXPIRACAO_PERSISTENTE,
};
