"use strict";

const { verificarToken } = require("./auth");
const { buscarUsuarioPorId } = require("./database");

const FORMATO_UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function responderNaoAutenticado(response) {
  return response.status(401).json({
    erro: "Autenticação necessária.",
    codigo: "NAO_AUTENTICADO",
  });
}

function extrairTokenBearer(request) {
  const autorizacao = request.get("Authorization");

  if (typeof autorizacao !== "string") {
    return undefined;
  }

  const correspondencia = /^Bearer[ \t]+(\S+)$/i.exec(autorizacao);
  return correspondencia?.[1];
}

async function autenticarBearer(request, response, next) {
  const token = extrairTokenBearer(request);

  if (!token) {
    return responderNaoAutenticado(response);
  }

  let payload;

  try {
    payload = verificarToken(token);
  } catch {
    return responderNaoAutenticado(response);
  }

  if (
    !payload ||
    typeof payload !== "object" ||
    typeof payload.sub !== "string" ||
    !FORMATO_UUID.test(payload.sub) ||
    (payload.ver !== undefined &&
      (!Number.isInteger(payload.ver) || payload.ver < 0))
  ) {
    return responderNaoAutenticado(response);
  }

  const usuario = await buscarUsuarioPorId(payload.sub);

  const versaoToken = payload.ver ?? 0;

  if (
    !usuario ||
    usuario.id !== payload.sub ||
    (usuario.authVersion ?? 0) !== versaoToken
  ) {
    return responderNaoAutenticado(response);
  }

  request.usuario = {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
  };

  return next();
}

module.exports = {
  autenticarBearer,
  extrairTokenBearer,
};
