"use strict";

const { createHash } = require("node:crypto");
const { promises: fs } = require("node:fs");
const path = require("node:path");

const MIGRATION_LOCK_ID = 862_041_317;
const DEFAULT_MIGRATIONS_DIR = path.join(__dirname, "..", "migrations");

function calcularChecksum(sql) {
  return createHash("sha256").update(sql, "utf8").digest("hex");
}

async function descobrirMigrations(diretorio = DEFAULT_MIGRATIONS_DIR) {
  let entradas;

  try {
    entradas = await fs.readdir(diretorio, { withFileTypes: true });
  } catch (erro) {
    if (erro.code === "ENOENT") {
      throw new Error(
        `Diretório de migrations não encontrado: ${diretorio}`,
        { cause: erro },
      );
    }

    throw erro;
  }

  const nomes = entradas
    .filter((entrada) => entrada.isFile() && entrada.name.endsWith(".sql"))
    .map((entrada) => entrada.name)
    .sort();

  return Promise.all(
    nomes.map(async (filename) => {
      const sql = await fs.readFile(path.join(diretorio, filename), "utf8");

      if (sql.trim() === "") {
        throw new Error(`Migration vazia: ${filename}`);
      }

      return {
        filename,
        sql,
        checksum: calcularChecksum(sql),
      };
    }),
  );
}

async function criarTabelaDeControle(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename TEXT PRIMARY KEY,
      checksum TEXT NOT NULL,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function aplicarMigration(client, migration, log = console) {
  await client.query("BEGIN");

  try {
    const resultado = await client.query(
      `
        SELECT checksum
        FROM schema_migrations
        WHERE filename = $1
      `,
      [migration.filename],
    );

    if (resultado.rowCount > 0) {
      const checksumRegistrado = resultado.rows[0].checksum;

      if (checksumRegistrado !== migration.checksum) {
        throw new Error(
          `Migration já aplicada foi alterada: ${migration.filename}`,
        );
      }

      await client.query("COMMIT");
      log.info(`Migration já aplicada: ${migration.filename}`);
      return false;
    }

    await client.query(migration.sql);
    await client.query(
      `
        INSERT INTO schema_migrations (filename, checksum)
        VALUES ($1, $2)
      `,
      [migration.filename, migration.checksum],
    );
    await client.query("COMMIT");
    log.info(`Migration aplicada: ${migration.filename}`);
    return true;
  } catch (erro) {
    try {
      await client.query("ROLLBACK");
    } catch (erroRollback) {
      throw new AggregateError(
        [erro, erroRollback],
        `Falha ao aplicar e reverter a migration ${migration.filename}`,
      );
    }

    throw erro;
  }
}

async function runMigrations({
  connectionString = process.env.DATABASE_URL_DIRECT,
  migrationsDir = DEFAULT_MIGRATIONS_DIR,
  Pool,
  log = console,
} = {}) {
  if (typeof connectionString !== "string" || connectionString.trim() === "") {
    throw new Error(
      "DATABASE_URL_DIRECT é obrigatória para executar as migrations.",
    );
  }

  const PoolClass = Pool ?? require("pg").Pool;
  const pool = new PoolClass({
    connectionString: connectionString.trim(),
    max: 1,
  });
  let client;
  let lockAdquirido = false;

  try {
    const migrations = await descobrirMigrations(migrationsDir);
    client = await pool.connect();

    await client.query("SELECT pg_advisory_lock($1)", [MIGRATION_LOCK_ID]);
    lockAdquirido = true;
    await criarTabelaDeControle(client);

    let aplicadas = 0;

    for (const migration of migrations) {
      if (await aplicarMigration(client, migration, log)) {
        aplicadas += 1;
      }
    }

    return {
      total: migrations.length,
      aplicadas,
      ignoradas: migrations.length - aplicadas,
    };
  } finally {
    if (client) {
      if (lockAdquirido) {
        try {
          await client.query("SELECT pg_advisory_unlock($1)", [
            MIGRATION_LOCK_ID,
          ]);
        } catch (erro) {
          log.error("Não foi possível liberar o lock das migrations.", erro);
        }
      }

      client.release();
    }

    await pool.end();
  }
}

async function main() {
  try {
    const resultado = await runMigrations();
    console.info(
      `Migrations concluídas: ${resultado.aplicadas} aplicada(s), ` +
        `${resultado.ignoradas} já aplicada(s).`,
    );
  } catch (erro) {
    console.error("Falha ao executar migrations.", erro);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  void main();
}

module.exports = {
  aplicarMigration,
  calcularChecksum,
  descobrirMigrations,
  runMigrations,
};
