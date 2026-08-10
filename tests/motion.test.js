"use strict";

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");

const projectRoot = join(__dirname, "..");
const css = readFileSync(join(projectRoot, "public", "styles.css"), "utf8");
const motionMarker =
  "MOVIMENTO DE INTERFACE — ABERTURAS E MUDANÇAS DE CONTEXTO";
const motionCss = css.slice(css.indexOf(motionMarker));

test("dropdowns abrem a partir do próprio acionador", () => {
  assert.match(
    motionCss,
    /\.menu-conta,[\s\S]*\.painel-notificacoes-conversas\s*\{[\s\S]*vortex-dropdown-abaixo[\s\S]*transform-origin:\s*top right/,
  );
  assert.match(
    motionCss,
    /\.footer-lang-menu\s*\{[\s\S]*vortex-dropdown-acima[\s\S]*transform-origin:\s*bottom right/,
  );
  assert.match(
    motionCss,
    /header nav:not\(\[hidden\]\)\s*\{[\s\S]*vortex-dropdown-abaixo/,
  );
});

test("login coordena conteúdo e fundo sem ultrapassar 300ms", () => {
  assert.match(
    motionCss,
    /\.dialogo-autenticacao\[open\] \.autenticacao-layout\s*\{[\s\S]*vortex-login-entrada var\(--duracao-dialogo\)/,
  );
  assert.match(
    motionCss,
    /\.dialogo-autenticacao\[open\]::backdrop,[\s\S]*animation:\s*vortex-fundo-dialogo 220ms/,
  );
  assert.match(css, /--duracao-dialogo:\s*280ms/);
  assert.match(
    motionCss,
    /\.dialogo-autenticacao\[data-fechando="true"\] \.autenticacao-layout\s*\{[\s\S]*vortex-login-saida 160ms/,
  );
  assert.match(
    motionCss,
    /\.formulario-autenticacao:not\(\[hidden\]\)\s*> :nth-child\(5\)\s*\{[\s\S]*animation-delay:\s*80ms/,
  );
});

test("troca entre login e cadastro comunica direção em desktop e mobile", () => {
  assert.match(
    motionCss,
    /data-direcao-autenticacao="avancar"[\s\S]*animation-name:\s*vortex-conteudo-avancar/,
  );
  assert.match(
    motionCss,
    /data-direcao-autenticacao="voltar"[\s\S]*animation-name:\s*vortex-conteudo-voltar/,
  );
  assert.match(
    motionCss,
    /@media \(max-width:\s*48rem\)[\s\S]*vortex-conteudo-mobile-avancar[\s\S]*vortex-conteudo-mobile-voltar/,
  );
  assert.match(
    css,
    /\.autenticacao-abas\[data-modo-atual="cadastro"\]::before\s*\{[\s\S]*translateX/,
  );
});

test("painéis progressivos usam movimento curto baseado em transform e opacidade", () => {
  assert.match(
    motionCss,
    /\.painel-novo-anuncio,[\s\S]*\.painel-meus-anuncios\s*\{[\s\S]*vortex-painel-entrada/,
  );
  assert.match(
    motionCss,
    /@keyframes vortex-painel-filtros\s*\{[\s\S]*opacity:[\s\S]*transform:/,
  );
  assert.match(
    motionCss,
    /vortex-dropdown-abaixo var\(--duracao-dropdown\)[\s\S]*var\(--movimento-saida\) backwards/,
  );
  const blocosKeyframes = [
    ...motionCss.matchAll(
      /@keyframes vortex-[^{]+\{(?:[^{}]|\{[^{}]*\})*\}/g,
    ),
  ].map(([bloco]) => bloco);

  assert.ok(blocosKeyframes.length > 0);
  blocosKeyframes.forEach((bloco) => {
    assert.doesNotMatch(bloco, /(?:width|height|padding|margin):/);
    assert.doesNotMatch(bloco, /clip-path:/);
  });
});

test("loops decorativos pausam fora da tela e em abas ocultas", () => {
  assert.match(
    css,
    /#inicio\[data-motion-paused="true"\][\s\S]*body\[data-motion-suspended="true"\] #inicio[\s\S]*animation-play-state:\s*paused/,
  );

  const animationsTs = readFileSync(
    join(projectRoot, "src", "animations.ts"),
    "utf8",
  );
  assert.match(animationsTs, /visibilitychange/);
  assert.match(animationsTs, /IntersectionObserver/);
});

test("preferência por movimento reduzido desativa todas as novas entradas", () => {
  assert.match(
    motionCss,
    /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*\.menu-conta,[\s\S]*\.dialogo-autenticacao\[open\] \.autenticacao-layout,[\s\S]*\.dialogo-concluir-anuncio\[open\][\s\S]*animation:\s*none/,
  );
  assert.match(
    motionCss,
    /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*\.autenticacao-abas::before\s*\{[\s\S]*transition:\s*none/,
  );
});
