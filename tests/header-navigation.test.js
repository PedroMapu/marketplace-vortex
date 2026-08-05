"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { readProjectFile } = require("./helpers/typescript-runtime");

test("navbar sincroniza explorar, anunciar, meus anúncios e login com a URL", () => {
  const html = readProjectFile("index.html");
  const app = readProjectFile("src/app.ts");
  const inicioSincronizacao = app.indexOf(
    "function sincronizarInterfaceComDestino",
  );
  const fimSincronizacao = app.indexOf(
    "function navegarParaDestino",
    inicioSincronizacao,
  );
  const fluxo = app.slice(inicioSincronizacao, fimSincronizacao);

  assert.match(
    html,
    /href="#painel-novo-anuncio" data-atalho-anunciar>Anunciar<\/a>/,
  );
  assert.match(
    html,
    /class="hero-cta hero-cta-primary"\s+data-atalho-anunciar/,
  );
  assert.match(
    html,
    /href="#painel-meus-anuncios" data-abrir-meus-anuncios>Meus anúncios<\/a>/,
  );
  assert.equal(
    (html.match(/data-atalho-anunciar/g) || []).length,
    2,
  );
  assert.match(
    app,
    /querySelectorAll<HTMLAnchorElement>\(\s*"\[data-atalho-anunciar\]"/,
  );
  assert.match(app, /const DESTINO_EXPLORAR[^\n]*"#lista-anuncios"/);
  assert.match(app, /const DESTINO_ANUNCIAR[^\n]*"#painel-novo-anuncio"/);
  assert.match(app, /"#painel-meus-anuncios"/);
  assert.match(app, /const DESTINO_ENTRAR[^\n]*"#entrar"/);
  assert.match(app, /"#entrar\/anunciar"/);
  assert.match(app, /"#entrar\/meus-anuncios"/);
  assert.match(fluxo, /if \(!usuarioAtual\)/);
  assert.match(fluxo, /abrirDialogoAutenticacao\(\)/);
  assert.match(fluxo, /Entre na sua conta para anunciar um item\./);
  assert.match(fluxo, /Entre na sua conta para acessar seus anúncios\./);
  assert.match(fluxo, /definirPainelAnuncioAberto\(true, \{ moverFoco \}\)/);
  assert.match(fluxo, /definirPainelMeusAnunciosAberto\(true, \{ moverFoco \}\)/);
  assert.match(app, /function obterDestinoAposAutenticacao/);
  assert.match(
    app,
    /const destinoAposAutenticacao = obterDestinoAposAutenticacao/,
  );
  assert.match(
    app,
    /!usuarioAtual && ehDestinoProtegido\(destino\)/,
  );
  assert.match(app, /window\.location\.hash = destinoEfetivo/);
  assert.match(app, /window\.addEventListener\("hashchange"/);
  assert.match(app, /navegarParaDestino\(DESTINO_ENTRAR\)/);
  assert.match(app, /inicializarAtalhosDeAnuncio\(\)/);
  assert.match(app, /inicializarNavegacaoPorUrl\(\)/);
});
