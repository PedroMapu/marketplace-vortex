"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");

const {
  exigirTestDatabaseUrlIsolada,
  identificarDestinoPostgres,
} = require("../scripts/database-safety");
const { runTestMigrations } = require("../scripts/migrate");

test("exige TEST_DATABASE_URL antes de iniciar integração", () => {
  assert.throws(
    () =>
      exigirTestDatabaseUrlIsolada({
        testDatabaseUrl: " ",
        databaseUrl: "postgresql://app@producao.example/vortex",
      }),
    /TEST_DATABASE_URL é obrigatória/,
  );
});

test("aceita somente URL PostgreSQL com host e banco explícitos", () => {
  for (const testDatabaseUrl of [
    "https://teste.example/vortex_test",
    "postgresql:///vortex_test",
    "postgresql://teste.example/",
    "postgresql://teste.example/base/outra",
  ]) {
    assert.throws(
      () => exigirTestDatabaseUrlIsolada({ testDatabaseUrl }),
      /TEST_DATABASE_URL/,
    );
  }
});

test("normaliza protocolo, host, porta, percent-encoding e parâmetros seguros", () => {
  const primeira = identificarDestinoPostgres(
    "POSTGRES://usuario:segredo@DB.EXAMPLE/Vortex%5Ftest?sslmode=require&application_name=vortex",
  );
  const segunda = identificarDestinoPostgres(
    "postgresql://outro:credencial@db.example:5432/Vortex_test?application_name=vortex&sslmode=verify-full",
  );

  assert.equal(primeira, segunda);
});

test("considera endpoint pooled e direto do Neon como o mesmo destino", () => {
  const pooled = identificarDestinoPostgres(
    "postgresql://usuario@ep-exemplo-pooler.sa-east-1.aws.neon.tech/neondb",
  );
  const direto = identificarDestinoPostgres(
    "postgresql://usuario@ep-exemplo.sa-east-1.aws.neon.tech/neondb",
  );

  assert.equal(pooled, direto);
});

test("recusa teste no mesmo destino mesmo com credenciais e opções diferentes", () => {
  assert.throws(
    () =>
      exigirTestDatabaseUrlIsolada({
        testDatabaseUrl:
          "postgres://tester:teste@DB.EXAMPLE:5432/vortex?sslmode=require",
        databaseUrl:
          "postgresql://app:producao@db.example/vortex?sslmode=verify-full",
      }),
    /banco isolado/,
  );
});

test("recusa sobrescrita ambígua do destino em query string", () => {
  assert.throws(
    () =>
      exigirTestDatabaseUrlIsolada({
        testDatabaseUrl:
          "postgresql://tester@teste.example/vortex_test?database=vortex",
      }),
    /não pode sobrescrever o destino/,
  );
});

test("aceita banco de teste com destino efetivamente diferente", () => {
  const testDatabaseUrl =
    "postgresql://tester:segredo@teste.example/vortex_test?sslmode=require";

  assert.equal(
    exigirTestDatabaseUrlIsolada({
      testDatabaseUrl,
      databaseUrl: "postgresql://app@producao.example/vortex",
      databaseUrlDirect: "postgresql://app@producao-direta.example/vortex",
    }),
    testDatabaseUrl,
  );
});

test("migration de teste falha antes de construir Pool quando não há isolamento", async () => {
  let poolConstruido = false;

  class PoolProibido {
    constructor() {
      poolConstruido = true;
    }
  }

  await assert.rejects(
    runTestMigrations({
      testDatabaseUrl: "postgresql://teste@db.example/vortex",
      databaseUrl: "postgresql://app@DB.EXAMPLE:5432/vortex?sslmode=require",
      Pool: PoolProibido,
    }),
    /banco isolado/,
  );
  assert.equal(poolConstruido, false);
});
