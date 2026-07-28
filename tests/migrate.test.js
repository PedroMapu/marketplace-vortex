"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const {
  aplicarMigration,
  descobrirMigrations,
  runMigrations,
} = require("../scripts/migrate");

function criarDiretorioDeTeste(t) {
  const diretorio = fs.mkdtempSync(path.join(os.tmpdir(), "vortex-migrations-"));
  t.after(() => fs.rmSync(diretorio, { recursive: true, force: true }));
  return diretorio;
}

function criarPoolFake(client, registros) {
  return class PoolFake {
    constructor(config) {
      registros.config = config;
    }

    async connect() {
      registros.connect += 1;
      return client;
    }

    async end() {
      registros.end += 1;
    }
  };
}

test("descobre apenas migrations SQL em ordem lexicográfica", async (t) => {
  const diretorio = criarDiretorioDeTeste(t);
  fs.writeFileSync(path.join(diretorio, "010_dez.sql"), "SELECT 10;");
  fs.writeFileSync(path.join(diretorio, "002_dois.sql"), "SELECT 2;");
  fs.writeFileSync(path.join(diretorio, "README.md"), "ignorar");

  const migrations = await descobrirMigrations(diretorio);

  assert.deepEqual(
    migrations.map(({ filename }) => filename),
    ["002_dois.sql", "010_dez.sql"],
  );
  assert.match(migrations[0].checksum, /^[a-f0-9]{64}$/);
});

test("aplica cada migration uma vez e encerra conexão e pool", async (t) => {
  const diretorio = criarDiretorioDeTeste(t);
  fs.writeFileSync(path.join(diretorio, "001_inicial.sql"), "SELECT 1;");

  const aplicadas = new Map();
  const comandos = [];
  const registros = { config: null, connect: 0, end: 0, release: 0 };
  const client = {
    async query(sql, parametros) {
      const comando = sql.trim();
      comandos.push({ comando, parametros });

      if (comando.startsWith("SELECT checksum")) {
        const checksum = aplicadas.get(parametros[0]);
        return checksum
          ? { rowCount: 1, rows: [{ checksum }] }
          : { rowCount: 0, rows: [] };
      }

      if (comando.startsWith("INSERT INTO schema_migrations")) {
        aplicadas.set(parametros[0], parametros[1]);
        return { rowCount: 1, rows: [] };
      }

      return { rowCount: 0, rows: [] };
    },
    release() {
      registros.release += 1;
    },
  };
  const PoolFake = criarPoolFake(client, registros);
  const log = { info() {}, error() {} };

  const primeira = await runMigrations({
    connectionString: "postgresql://teste",
    migrationsDir: diretorio,
    Pool: PoolFake,
    log,
  });
  const segunda = await runMigrations({
    connectionString: "postgresql://teste",
    migrationsDir: diretorio,
    Pool: PoolFake,
    log,
  });

  assert.deepEqual(primeira, { total: 1, aplicadas: 1, ignoradas: 0 });
  assert.deepEqual(segunda, { total: 1, aplicadas: 0, ignoradas: 1 });
  assert.equal(
    comandos.filter(({ comando }) => comando === "SELECT 1;").length,
    1,
  );
  assert.equal(registros.connect, 2);
  assert.equal(registros.release, 2);
  assert.equal(registros.end, 2);
  assert.equal(registros.config.max, 1);
});

test("reverte a transação quando uma migration falha", async () => {
  const comandos = [];
  const client = {
    async query(sql) {
      const comando = sql.trim();
      comandos.push(comando);

      if (comando === "SQL INVÁLIDO") {
        throw new Error("erro de SQL");
      }

      if (comando.startsWith("SELECT checksum")) {
        return { rowCount: 0, rows: [] };
      }

      return { rowCount: 0, rows: [] };
    },
  };

  await assert.rejects(
    aplicarMigration(
      client,
      {
        filename: "003_falha.sql",
        sql: "SQL INVÁLIDO",
        checksum: "checksum",
      },
      { info() {} },
    ),
    /erro de SQL/,
  );

  assert.equal(comandos[0], "BEGIN");
  assert.equal(comandos.at(-1), "ROLLBACK");
  assert.equal(comandos.includes("COMMIT"), false);
});

test("exige DATABASE_URL_DIRECT antes de criar o pool", async () => {
  await assert.rejects(
    runMigrations({ connectionString: " " }),
    /DATABASE_URL_DIRECT é obrigatória/,
  );
});
