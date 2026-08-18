"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { readProjectFile } = require("./helpers/typescript-runtime");

test("catálogo carrega lotes pequenos e avança quando o fim se aproxima", () => {
  const app = readProjectFile("src/app.ts");
  const html = readProjectFile("index.html");
  const migration = readProjectFile(
    "migrations/010_add_catalog_pagination_indexes.sql",
  );

  assert.match(app, /const TAMANHO_PAGINA_CATALOGO = 12/);
  assert.match(app, /limite: TAMANHO_PAGINA_CATALOGO/);
  assert.match(app, /new IntersectionObserver/);
  assert.match(app, /rootMargin: "600px 0px"/);
  assert.match(app, /imagem\.loading = "lazy"/);
  assert.match(html, /id="botao-carregar-mais-catalogo"/);
  assert.match(
    migration,
    /\(criado_em DESC, id DESC\)[\s\S]*WHERE concluido_em IS NULL/u,
  );
});
