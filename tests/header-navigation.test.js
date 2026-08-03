"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { readProjectFile } = require("./helpers/typescript-runtime");

test("atalhos de anúncio abrem login ou formulário conforme a sessão", () => {
  const html = readProjectFile("index.html");
  const app = readProjectFile("src/app.ts");
  const inicio = app.indexOf("function inicializarAtalhosDeAnuncio");
  const fim = app.indexOf("function renderizarAnuncios", inicio);
  const fluxo = app.slice(inicio, fim);

  assert.match(
    html,
    /href="#painel-novo-anuncio" data-atalho-anunciar>Anunciar<\/a>/,
  );
  assert.match(
    html,
    /class="hero-cta hero-cta-primary"\s+data-atalho-anunciar/,
  );
  assert.equal(
    (html.match(/data-atalho-anunciar/g) || []).length,
    2,
  );
  assert.match(
    app,
    /querySelectorAll<HTMLAnchorElement>\(\s*"\[data-atalho-anunciar\]"/,
  );
  assert.match(fluxo, /atalhosAnunciar\.forEach/);
  assert.match(fluxo, /if \(!usuarioAtual\)/);
  assert.match(fluxo, /evento\.preventDefault\(\)/);
  assert.match(fluxo, /abrirDialogoAutenticacao\(\)/);
  assert.match(fluxo, /Entre na sua conta para anunciar um item\./);
  assert.match(fluxo, /definirPainelAnuncioAberto\(true\)/);
  assert.match(app, /inicializarAtalhosDeAnuncio\(\)/);
});
