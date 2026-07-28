"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const raizProjeto = path.resolve(__dirname, "..");
const caminhoSQLite = path.join(raizProjeto, "data", "marketplace.db");

test("preserva o SQLite local fora do Git sem inspecionar seus registros", () => {
  const gitignore = fs.readFileSync(
    path.join(raizProjeto, ".gitignore"),
    "utf8",
  );

  assert.match(gitignore, /^data\/\*\.db\s*$/m);
  assert.match(gitignore, /^data\/\*\.db-\*\s*$/m);

  if (fs.existsSync(caminhoSQLite)) {
    const metadata = fs.statSync(caminhoSQLite);

    assert.equal(metadata.isFile(), true);
    assert.ok(metadata.size > 0);
  }
});

test("código executável não conecta nem importa o SQLite histórico", () => {
  const arquivosAplicacao = ["api.js", "database.js", "server.js"].map(
    (arquivo) => path.join(raizProjeto, arquivo),
  );
  const arquivosScripts = fs
    .readdirSync(path.join(raizProjeto, "scripts"), {
      withFileTypes: true,
    })
    .filter((entrada) => entrada.isFile() && entrada.name.endsWith(".js"))
    .map((entrada) => path.join(raizProjeto, "scripts", entrada.name));

  for (const arquivo of [...arquivosAplicacao, ...arquivosScripts]) {
    const codigo = fs.readFileSync(arquivo, "utf8");

    assert.doesNotMatch(
      codigo,
      /node:sqlite|better-sqlite3|sqlite3|marketplace\.db/i,
      `${path.relative(raizProjeto, arquivo)} não deve acessar o SQLite local`,
    );
  }
});
