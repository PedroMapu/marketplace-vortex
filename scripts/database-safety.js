"use strict";

const PARAMETROS_QUE_ALTERAM_DESTINO = new Set([
  "database",
  "dbname",
  "host",
  "hostaddr",
  "password",
  "port",
  "service",
  "user",
]);

function lerUrlPostgres(valor, nomeVariavel) {
  if (typeof valor !== "string" || valor.trim() === "") {
    throw new Error(`${nomeVariavel} é obrigatória para testes de integração.`);
  }

  let url;

  try {
    url = new URL(valor.trim());
  } catch {
    throw new Error(`${nomeVariavel} deve ser uma URL PostgreSQL válida.`);
  }

  if (!["postgres:", "postgresql:"].includes(url.protocol)) {
    throw new Error(`${nomeVariavel} deve usar o protocolo PostgreSQL.`);
  }

  if (url.hostname === "") {
    throw new Error(`${nomeVariavel} deve identificar um host PostgreSQL.`);
  }

  const database = decodeURIComponent(url.pathname.replace(/^\/+/, ""));

  if (database === "" || database.includes("/")) {
    throw new Error(`${nomeVariavel} deve identificar exatamente um banco.`);
  }

  for (const parametro of url.searchParams.keys()) {
    if (PARAMETROS_QUE_ALTERAM_DESTINO.has(parametro.toLowerCase())) {
      throw new Error(
        `${nomeVariavel} não pode sobrescrever o destino por parâmetros.`,
      );
    }
  }

  return url;
}

function normalizarHost(hostname) {
  const host = hostname.toLowerCase().replace(/\.$/, "");

  if (host === "127.0.0.1" || host === "[::1]") {
    return "localhost";
  }

  if (host.endsWith(".neon.tech")) {
    return host.replace(/-pooler(?=\.)/, "");
  }

  return host;
}

function identificarDestinoPostgres(valor, nomeVariavel = "URL PostgreSQL") {
  const url = lerUrlPostgres(valor, nomeVariavel);

  return JSON.stringify({
    host: normalizarHost(url.hostname),
    port: url.port || "5432",
    database: decodeURIComponent(url.pathname.replace(/^\/+/, "")),
  });
}

function exigirTestDatabaseUrlIsolada({
  testDatabaseUrl = process.env.TEST_DATABASE_URL,
  databaseUrl = process.env.DATABASE_URL,
  databaseUrlDirect = process.env.DATABASE_URL_DIRECT,
} = {}) {
  const destinoTeste = identificarDestinoPostgres(
    testDatabaseUrl,
    "TEST_DATABASE_URL",
  );

  for (const [nomeVariavel, valor] of [
    ["DATABASE_URL", databaseUrl],
    ["DATABASE_URL_DIRECT", databaseUrlDirect],
  ]) {
    if (typeof valor !== "string" || valor.trim() === "") {
      continue;
    }

    const destinoProtegido = identificarDestinoPostgres(valor, nomeVariavel);

    if (destinoTeste === destinoProtegido) {
      throw new Error(
        "TEST_DATABASE_URL deve apontar para um banco isolado das conexões da aplicação.",
      );
    }
  }

  return testDatabaseUrl.trim();
}

module.exports = {
  exigirTestDatabaseUrlIsolada,
  identificarDestinoPostgres,
};
