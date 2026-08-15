"use strict";

const METODOS_PERMITIDOS = Object.freeze([
  "GET",
  "POST",
  "PATCH",
  "DELETE",
  "OPTIONS",
]);
const CABECALHOS_PERMITIDOS = Object.freeze([
  "Authorization",
  "Content-Type",
]);
const HOSTS_LOCAIS = new Set(["localhost", "127.0.0.1", "[::1]"]);

function normalizarOrigemConfigurada(valor) {
  let url;

  try {
    url = new URL(valor);
  } catch {
    throw new Error(`Origem inválida em FRONTEND_ORIGINS: "${valor}".`);
  }

  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      `FRONTEND_ORIGINS aceita somente origens HTTP(S), sem caminho, credenciais, query ou fragmento: "${valor}".`,
    );
  }

  return url.origin;
}

function lerOrigensFrontend(valor = "") {
  if (typeof valor !== "string") {
    throw new TypeError("FRONTEND_ORIGINS deve ser uma lista separada por vírgulas.");
  }

  const origens = valor
    .split(",")
    .map((origem) => origem.trim())
    .filter(Boolean)
    .map(normalizarOrigemConfigurada);

  return new Set(origens);
}

function criarConfiguracaoCors({
  ambiente = process.env.NODE_ENV || "development",
  frontendOrigins = process.env.FRONTEND_ORIGINS || "",
} = {}) {
  const producao = ambiente === "production";
  const origensProducao = lerOrigensFrontend(frontendOrigins);

  if (producao && origensProducao.size === 0) {
    throw new Error(
      "FRONTEND_ORIGINS é obrigatória em produção e deve conter ao menos uma origem.",
    );
  }

  return Object.freeze({
    ambiente,
    producao,
    origensProducao,
  });
}

function origemLocalPermitida(origem) {
  let url;

  try {
    url = new URL(origem);
  } catch {
    return false;
  }

  return (
    ["http:", "https:"].includes(url.protocol) &&
    url.origin === origem &&
    HOSTS_LOCAIS.has(url.hostname)
  );
}

function origemPermitida(origem, configuracao) {
  // Clientes sem Origin (CLI, monitoramento e chamadas servidor-servidor) não
  // estão sujeitos ao CORS, que é uma política aplicada pelo navegador.
  if (!origem) {
    return true;
  }

  if (configuracao.producao) {
    return configuracao.origensProducao.has(origem);
  }

  return origemLocalPermitida(origem);
}

function separarCabecalhosSolicitados(valor) {
  if (!valor) {
    return [];
  }

  return valor
    .split(",")
    .map((cabecalho) => cabecalho.trim().toLowerCase())
    .filter(Boolean);
}

function negarCors(response, mensagem) {
  return response.status(403).json({
    erro: mensagem,
    codigo: "ORIGEM_NAO_PERMITIDA",
  });
}

function criarCors(configuracao = criarConfiguracaoCors()) {
  const metodos = new Set(METODOS_PERMITIDOS);
  const cabecalhos = new Set(
    CABECALHOS_PERMITIDOS.map((cabecalho) => cabecalho.toLowerCase()),
  );

  return function corsVortex(request, response, next) {
    const origem = request.get("Origin");

    response.vary("Origin");

    if (!origem) {
      return next();
    }

    if (!origemPermitida(origem, configuracao)) {
      return negarCors(response, "A origem da solicitação não é permitida.");
    }

    response.set("Access-Control-Allow-Origin", origem);

    const metodoPreflight = request.get("Access-Control-Request-Method");
    const preflight = request.method === "OPTIONS" && metodoPreflight;

    if (request.method === "OPTIONS") {
      response.vary("Access-Control-Request-Method");
      response.vary("Access-Control-Request-Headers");
    }

    if (!preflight) {
      return next();
    }

    // O preflight só é aprovado quando método e todos os cabeçalhos foram
    // explicitamente incluídos nas listas acima.
    const metodoNormalizado = metodoPreflight.toUpperCase();

    if (!metodos.has(metodoNormalizado)) {
      return negarCors(response, "O método solicitado pelo CORS não é permitido.");
    }

    const solicitados = separarCabecalhosSolicitados(
      request.get("Access-Control-Request-Headers"),
    );

    if (solicitados.some((cabecalho) => !cabecalhos.has(cabecalho))) {
      return negarCors(
        response,
        "Um cabeçalho solicitado pelo CORS não é permitido.",
      );
    }

    response.set("Access-Control-Allow-Methods", METODOS_PERMITIDOS.join(", "));
    response.set(
      "Access-Control-Allow-Headers",
      CABECALHOS_PERMITIDOS.join(", "),
    );
    response.set("Access-Control-Max-Age", "600");

    return response.status(204).end();
  };
}

module.exports = {
  CABECALHOS_PERMITIDOS,
  METODOS_PERMITIDOS,
  criarConfiguracaoCors,
  criarCors,
  lerOrigensFrontend,
  origemPermitida,
};
