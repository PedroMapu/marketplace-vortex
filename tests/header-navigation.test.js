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
    /href="\/anunciar" data-atalho-anunciar>Anunciar<\/a>/,
  );
  assert.match(
    html,
    /class="hero-cta hero-cta-primary"\s+data-atalho-anunciar/,
  );
  assert.match(
    html,
    /href="\/meus-anuncios" data-abrir-meus-anuncios>Meus anúncios<\/a>/,
  );
  assert.equal(
    (html.match(/data-atalho-anunciar/g) || []).length,
    3,
  );
  assert.match(
    app,
    /querySelectorAll<HTMLAnchorElement>\(\s*"\[data-atalho-anunciar\]"/,
  );
  assert.match(app, /const DESTINO_EXPLORAR[^\n]*"\/anuncios"/);
  assert.match(app, /const DESTINO_ANUNCIAR[^\n]*"\/anunciar"/);
  assert.match(app, /const DESTINO_MEUS_ANUNCIOS[^\n]*"\/meus-anuncios"/);
  assert.match(app, /const DESTINO_ENTRAR[^\n]*"\/entrar"/);
  assert.match(fluxo, /rotaEhProtegida\(rota\) && !usuarioAtual/);
  assert.match(fluxo, /caminhoDeEntradaPara\(rota\)/);
  assert.match(fluxo, /abrirDialogoAutenticacao\(/);
  assert.match(fluxo, /Entre na sua conta para anunciar um item\./);
  assert.match(fluxo, /Entre na sua conta para acessar seus anúncios\./);
  assert.match(fluxo, /definirPainelAnuncioAberto\(true, \{ moverFoco \}\)/);
  assert.match(fluxo, /definirPainelMeusAnunciosAberto\(true, \{ moverFoco \}\)/);
  assert.match(
    app,
    /const destinoAposAutenticacao =[^;]*rotaAtual\.redirecionarPara/s,
  );
  assert.match(app, /window\.history\[substituir \? "replaceState" : "pushState"\]/);
  assert.match(app, /window\.addEventListener\("popstate"/);
  assert.match(app, /navegarParaDestino\(DESTINO_ENTRAR\)/);
  assert.match(app, /inicializarAtalhosDeAnuncio\(\)/);
  assert.match(app, /inicializarNavegacaoPorUrl\(\)/);
});
