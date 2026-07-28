"use strict";

function criarEnvelopeErro(erro, codigo, campos) {
  return {
    erro,
    codigo,
    ...(campos && Object.keys(campos).length > 0 ? { campos } : {}),
  };
}

function responderErro(response, status, erro, codigo, campos) {
  return response
    .status(status)
    .json(criarEnvelopeErro(erro, codigo, campos));
}

function camposDeErroZod(erroZod) {
  const campos = {};

  for (const issue of erroZod.issues) {
    if (issue.code === "unrecognized_keys") {
      for (const chave of issue.keys) {
        campos[chave] ??= "Campo não permitido.";
      }

      continue;
    }

    const caminho = issue.path.map(String).join(".");
    campos[caminho || "corpo"] ??= issue.message;
  }

  return campos;
}

function validarComSchema(schema, valor) {
  const resultado = schema.safeParse(valor);

  if (resultado.success) {
    return {
      sucesso: true,
      dados: resultado.data,
    };
  }

  return {
    sucesso: false,
    campos: camposDeErroZod(resultado.error),
  };
}

module.exports = {
  criarEnvelopeErro,
  responderErro,
  camposDeErroZod,
  validarComSchema,
};
