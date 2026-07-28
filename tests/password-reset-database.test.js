"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const database = require("../database");

function criarClient(responder) {
  const chamadas = [];
  let liberacoes = 0;
  const client = {
    async query(sql, parametros) {
      const comando = sql.trim();
      chamadas.push({ comando, parametros });
      return responder(comando, parametros);
    },
    release() {
      liberacoes += 1;
    },
  };

  return {
    client,
    chamadas,
    get liberacoes() {
      return liberacoes;
    },
  };
}

test("registro parametriza e-mail, hash e expiração e invalida tokens anteriores", async (t) => {
  const usuarioId = "79ce52fb-1acf-455c-8d91-54e09a77e76b";
  const fake = criarClient(async (comando) => {
    if (comando.startsWith("SELECT id")) {
      return { rows: [{ id: usuarioId }] };
    }

    return { rows: [], rowCount: 1 };
  });
  const connectOriginal = database.pool.connect;
  database.pool.connect = async () => fake.client;
  t.after(() => {
    database.pool.connect = connectOriginal;
  });
  const dados = {
    email: "ana@example.com",
    tokenHash: "a".repeat(64),
    expiraEm: new Date("2026-08-01T12:15:00.000Z"),
  };

  assert.equal(await database.registrarTokenRedefinicaoSenha(dados), true);
  const insercao = fake.chamadas.find(({ comando }) =>
    comando.startsWith("INSERT INTO password_reset_tokens"),
  );

  assert.deepEqual(insercao.parametros, [
    usuarioId,
    dados.tokenHash,
    dados.expiraEm,
  ]);
  assert.equal(
    fake.chamadas.some(({ comando }) =>
      comando.startsWith("UPDATE password_reset_tokens"),
    ),
    true,
  );
  assert.equal(fake.chamadas.at(-1).comando, "COMMIT");
  assert.equal(fake.liberacoes, 1);
});

test("confirmação consome token e troca senha na mesma transação", async (t) => {
  const usuarioId = "79ce52fb-1acf-455c-8d91-54e09a77e76b";
  const fake = criarClient(async (comando) => {
    if (
      comando.startsWith("UPDATE password_reset_tokens") &&
      comando.includes("RETURNING usuario_id")
    ) {
      return { rows: [{ usuario_id: usuarioId }] };
    }

    return { rows: [], rowCount: 1 };
  });
  const connectOriginal = database.pool.connect;
  database.pool.connect = async () => fake.client;
  t.after(() => {
    database.pool.connect = connectOriginal;
  });
  const dados = {
    tokenHash: "b".repeat(64),
    senhaHash: "hash-bcrypt",
  };

  assert.equal(await database.redefinirSenhaComToken(dados), true);
  assert.equal(fake.chamadas[0].comando, "BEGIN");
  assert.deepEqual(fake.chamadas[1].parametros, [dados.tokenHash]);
  const trocaSenha = fake.chamadas.find(({ comando }) =>
    comando.startsWith("UPDATE usuarios"),
  );
  assert.deepEqual(trocaSenha.parametros, [dados.senhaHash, usuarioId]);
  assert.equal(fake.chamadas.at(-1).comando, "COMMIT");
  assert.equal(fake.liberacoes, 1);
});

test("token expirado ou consumido não altera senha", async (t) => {
  const fake = criarClient(async (comando) => {
    if (comando.includes("RETURNING usuario_id")) {
      return { rows: [] };
    }

    return { rows: [], rowCount: 0 };
  });
  const connectOriginal = database.pool.connect;
  database.pool.connect = async () => fake.client;
  t.after(() => {
    database.pool.connect = connectOriginal;
  });

  assert.equal(
    await database.redefinirSenhaComToken({
      tokenHash: "c".repeat(64),
      senhaHash: "hash-bcrypt",
    }),
    false,
  );
  assert.equal(
    fake.chamadas.some(({ comando }) => comando.startsWith("UPDATE usuarios")),
    false,
  );
  assert.equal(fake.chamadas.at(-1).comando, "ROLLBACK");
  assert.equal(fake.liberacoes, 1);
});
