"use strict";

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");

const projectRoot = join(__dirname, "..");
const html = readFileSync(join(projectRoot, "index.html"), "utf8");
const css = readFileSync(join(projectRoot, "public", "styles.css"), "utf8");
const app = readFileSync(join(projectRoot, "src", "app.ts"), "utf8");
const responsiveMarker = "MOBILE E TABLET — CONSOLIDAÇÃO 2026";
const responsiveCss = css.slice(css.indexOf(responsiveMarker));

test("mantém a viewport preparada para celulares com recortes de área segura", () => {
  assert.match(
    html,
    /name="viewport"[\s\S]*content="width=device-width, initial-scale=1, viewport-fit=cover"/,
  );
  assert.match(css, /env\(safe-area-inset-left\)/);
  assert.match(css, /env\(safe-area-inset-right\)/);
  assert.match(responsiveCss, /env\(safe-area-inset-bottom\)/);
});

test("a consolidação mobile impede conteúdo flex e grid de ampliar a página", () => {
  assert.match(responsiveCss, /MOBILE E TABLET — CONSOLIDAÇÃO 2026/);
  assert.match(responsiveCss, /\.vitrine-layout,[\s\S]*\.ofertas-layout[\s\S]*min-width:\s*0/);
  assert.match(responsiveCss, /img,[\s\S]*video[\s\S]*max-width:\s*100%/);
  assert.match(responsiveCss, /overflow-wrap:\s*anywhere/);
});

test("controles principais preservam caixa visível e alvo de toque de 44px", () => {
  assert.match(responsiveCss, /header nav a,[\s\S]*\.footer-nav-container nav a[\s\S]*min-height:\s*2\.75rem/);
  assert.match(responsiveCss, /\.footer-socials a\s*\{[\s\S]*min-height:\s*2\.75rem[\s\S]*min-width:\s*2\.75rem/);
  assert.match(responsiveCss, /\.footer-nav-container nav a\s*\{[\s\S]*display:\s*inline-flex/);
  assert.match(responsiveCss, /\.vitrine-abas \.aba[\s\S]*border:\s*1px solid/);
  assert.match(responsiveCss, /\.vitrine-abas \.aba[\s\S]*min-height:\s*2\.75rem/);
  assert.match(responsiveCss, /:focus-visible[\s\S]*outline-width:\s*3px/);
});

test("abas do catálogo quebram em grade em vez de ficarem cortadas", () => {
  assert.match(responsiveCss, /@media \(max-width:\s*48rem\)[\s\S]*\.vitrine-abas\s*\{[\s\S]*display:\s*grid/);
  assert.match(responsiveCss, /\.vitrine-abas\s*\{[\s\S]*overflow-x:\s*visible/);
  assert.match(responsiveCss, /@media \(max-width:\s*32rem\)[\s\S]*\.vitrine-abas\s*\{[\s\S]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
});

test("busca e ações não disputam a mesma linha em tablets", () => {
  assert.match(responsiveCss, /\.vitrine-busca-barra\s*\{[\s\S]*grid-template-columns:\s*minmax\(0,\s*1fr\)/);
  assert.match(responsiveCss, /\.busca-input-container,[\s\S]*\.vitrine-acoes[\s\S]*min-width:\s*0/);
  assert.match(
    responsiveCss,
    /@media \(max-width:\s*68rem\)[\s\S]*\.vitrine-busca-barra\s*\{[\s\S]*grid-template-columns:\s*minmax\(0,\s*1fr\)/,
  );
  assert.match(
    responsiveCss,
    /@media \(max-width:\s*68rem\)[\s\S]*#busca-vitrine,[\s\S]*\.layout-toggle \.btn-layout[\s\S]*min-height:\s*2\.75rem/,
  );
});

test("diálogos móveis respeitam largura, altura dinâmica e área segura", () => {
  assert.match(responsiveCss, /\.dialogo-autenticacao,[\s\S]*\.modal-imagem[\s\S]*max-height:\s*calc\(100dvh/);
  assert.match(responsiveCss, /padding-bottom:\s*max\([^;]*env\(safe-area-inset-bottom\)/);
  assert.match(
    responsiveCss,
    /\.autenticacao-fechar,[\s\S]*\.modal-imagem-fechar[\s\S]*min-height:\s*2\.75rem[\s\S]*min-width:\s*2\.75rem/,
  );
  assert.match(
    responsiveCss,
    /@media \(max-width:\s*60rem\) and \(max-height:\s*35rem\)[\s\S]*max-height:\s*calc\(100dvh[^;]*env\(safe-area-inset-top\)[^;]*env\(safe-area-inset-bottom\)/,
  );
});

test("autenticação compacta mantém uma única rolagem e o topo visível", () => {
  assert.match(
    responsiveCss,
    /\.dialogo-autenticacao\s*\{[\s\S]*?height:\s*calc\([\s\S]*?100dvh[\s\S]*?overflow:\s*hidden/,
  );
  assert.match(
    responsiveCss,
    /\.dialogo-autenticacao \.autenticacao-layout\s*\{[\s\S]*height:\s*100%[\s\S]*overflow-y:\s*auto/,
  );
  assert.match(
    responsiveCss,
    /\.dialogo-autenticacao \.autenticacao-assinatura\s*\{[\s\S]*display:\s*none/,
  );
  assert.match(app, /matchMedia\("\(min-width:\s*48\.0625rem\)"\)/);
  assert.match(app, /campoEmail\?\.focus\(\{\s*preventScroll:\s*true\s*\}\)/);
  assert.match(
    app,
    /dialogoAutenticacao\.focus\(\{\s*preventScroll:\s*true\s*\}\)/,
  );
});

test("hero compacto mantém respiro sem reflexos que simulam caixas extras", () => {
  assert.match(
    responsiveCss,
    /@media \(max-width:\s*48rem\)[\s\S]*\.hero-cta-primary,[\s\S]*\.hero-cta-secondary[\s\S]*-webkit-box-reflect:\s*below 0 linear-gradient\(transparent,\s*transparent\)/,
  );
  assert.match(
    responsiveCss,
    /@media \(max-width:\s*32rem\)[\s\S]*#inicio\s*\{[\s\S]*padding-inline:[\s\S]*max\(1rem,[^;]*safe-area-inset/,
  );
  assert.match(
    responsiveCss,
    /@media \(max-width:\s*32rem\)[\s\S]*#inicio h1\s*\{[\s\S]*text-wrap:\s*wrap/,
  );
  assert.match(
    responsiveCss,
    /@media \(max-width:\s*32rem\)[\s\S]*#inicio aside\s*\{[\s\S]*margin-top:\s*4rem/,
  );
  assert.match(
    responsiveCss,
    /@media \(max-width:\s*32rem\)[\s\S]*#inicio\s*\{[\s\S]*padding-block:\s*3\.5rem 5\.75rem/,
  );
  assert.match(
    responsiveCss,
    /@media \(max-width:\s*32rem\)[\s\S]*\.hero-cta\s*\{[\s\S]*min-height:\s*3\.25rem/,
  );
  assert.match(
    responsiveCss,
    /@media \(max-width:\s*32rem\)[\s\S]*#inicio aside p\s*\{[\s\S]*bottom:\s*-3rem/,
  );
});
