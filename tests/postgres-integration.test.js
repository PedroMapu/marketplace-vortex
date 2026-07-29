"use strict";

const assert = require("node:assert/strict");
const { randomUUID } = require("node:crypto");
const test = require("node:test");

const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL?.trim();
const DATABASE_URL_ORIGINAL = process.env.DATABASE_URL;
const DATABASE_URL_DIRECT_ORIGINAL = process.env.DATABASE_URL_DIRECT;

test(
  "CRUD real usa PostgreSQL de teste e persiste entre conexões",
  { skip: !TEST_DATABASE_URL && "TEST_DATABASE_URL não configurada" },
  async () => {
    const { Pool } = require("pg");
    const { runTestMigrations } = require("../scripts/migrate");
    const {
      exigirTestDatabaseUrlIsolada,
    } = require("../scripts/database-safety");
    const testDatabaseUrl = exigirTestDatabaseUrlIsolada({
      testDatabaseUrl: TEST_DATABASE_URL,
      databaseUrl: DATABASE_URL_ORIGINAL,
      databaseUrlDirect: DATABASE_URL_DIRECT_ORIGINAL,
    });
    const usuarioId = randomUUID();
    const email = `fixture-${usuarioId}@example.invalid`;
    const logSilencioso = { info() {}, error() {} };
    let database;
    let fixtureCriada = false;
    let poolDaAplicacaoEncerrado = false;
    const poolDeLimpeza = new Pool({
      connectionString: testDatabaseUrl,
      max: 1,
    });

    process.env.DATABASE_URL = testDatabaseUrl;

    try {
      await runTestMigrations({
        testDatabaseUrl,
        databaseUrl: DATABASE_URL_ORIGINAL,
        databaseUrlDirect: DATABASE_URL_DIRECT_ORIGINAL,
        log: logSilencioso,
      });

      await poolDeLimpeza.query(
        `
          INSERT INTO usuarios (id, nome, email, senha_hash)
          VALUES ($1, $2, $3, $4)
        `,
        [usuarioId, "Usuário Fixture", email, "hash-ficticio-nao-autenticavel"],
      );
      fixtureCriada = true;

      delete require.cache[require.resolve("../database")];
      database = require("../database");

      const base = {
        nome: "Calculadora de teste",
        categoria: "eletronicos",
        condicao: "usado",
        modalidade: "venda",
        valor: 89.9,
        localizacao: "Fortaleza - CE",
        descricao: "Fixture temporária do smoke test.",
        imagemUrl: "",
        usuarioId,
      };
      const criado = await database.criarAnuncio(base);

      assert.equal(criado.usuarioId, usuarioId);
      assert.equal(criado.usuarioNome, "Usuário Fixture");
      assert.equal(criado.valor, 89.9);
      assert.equal(
        (await database.listarAnuncios({ categoria: "eletronicos" }))
          .some(({ id }) => id === criado.id),
        true,
      );
      assert.deepEqual(
        (await database.listarAnuncios({ usuarioId })).map(({ id }) => id),
        [criado.id],
      );
      assert.equal(
        await database.excluirAnuncioPorId(criado.id, usuarioId),
        true,
      );
      assert.equal(await database.buscarAnuncioPorId(criado.id), undefined);

      const persistente = await database.criarAnuncio({
        ...base,
        nome: "Registro entre conexões",
      });

      await database.fecharConexao();
      poolDaAplicacaoEncerrado = true;

      const resultadoReaberto = await poolDeLimpeza.query(
        "SELECT id FROM anuncios WHERE id = $1 AND usuario_id = $2",
        [persistente.id, usuarioId],
      );

      assert.equal(resultadoReaberto.rowCount, 1);
    } finally {
      if (database && !poolDaAplicacaoEncerrado) {
        await database.fecharConexao();
      }

      if (fixtureCriada) {
        await poolDeLimpeza.query(
          "DELETE FROM usuarios WHERE id = $1",
          [usuarioId],
        );
      }
      await poolDeLimpeza.end();

      if (DATABASE_URL_ORIGINAL === undefined) {
        delete process.env.DATABASE_URL;
      } else {
        process.env.DATABASE_URL = DATABASE_URL_ORIGINAL;
      }
    }
  },
);
