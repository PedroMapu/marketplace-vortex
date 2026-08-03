"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const vm = require("node:vm");
const {
  readProjectFile,
  transpileScript,
} = require("./helpers/typescript-runtime");

function createNavigationHarness() {
  const exports = {};
  const context = vm.createContext({
    exports,
    module: { exports },
  });
  const source = transpileScript(
    readProjectFile("src/catalog-navigation.ts")
      .replace("export function", "function")
      .concat(
        "\nexports.centralizarElementoSemFoco = centralizarElementoSemFoco;\n",
      ),
    "src/catalog-navigation.ts",
  );

  vm.runInContext(source, context, {
    filename: "src/catalog-navigation.ts",
  });

  return exports;
}

test("centraliza o anúncio suavemente sem focar ou selecionar o card", () => {
  const { centralizarElementoSemFoco } = createNavigationHarness();
  let opcoesRolagem;
  const elemento = {
    focus() {
      assert.fail("o card não deve receber foco");
    },
    scrollIntoView(opcoes) {
      opcoesRolagem = opcoes;
    },
  };

  centralizarElementoSemFoco(elemento, false);

  assert.deepEqual(JSON.parse(JSON.stringify(opcoesRolagem)), {
    behavior: "smooth",
    block: "center",
    inline: "nearest",
  });
});

test("respeita preferência por movimento reduzido", () => {
  const { centralizarElementoSemFoco } = createNavigationHarness();
  let opcoesRolagem;
  const elemento = {
    scrollIntoView(opcoes) {
      opcoesRolagem = opcoes;
    },
  };

  centralizarElementoSemFoco(elemento, true);

  assert.equal(opcoesRolagem.behavior, "auto");
  assert.equal(opcoesRolagem.block, "center");
});

test("CTA usa um contrato próprio e aguarda o primeiro card quando necessário", () => {
  const html = readProjectFile("index.html");
  const app = readProjectFile("src/app.ts");

  assert.match(
    html,
    /class="hero-cta hero-cta-secondary"[^>]*data-explorar-catalogo[^>]*href="#lista-anuncios"|href="#lista-anuncios"[^>]*class="hero-cta hero-cta-secondary"[^>]*data-explorar-catalogo/,
  );
  assert.match(
    app,
    /querySelector<HTMLAnchorElement>\(\s*"\[data-explorar-catalogo\]"/,
  );
  assert.match(app, /:scope > \.card-anuncio/);
  assert.match(app, /rolagemPrimeiroAnuncioPendente/);
  assert.match(app, /inicializarExploracaoDoCatalogo\(\)/);
});

test("limpa a navegação pendente quando o catálogo está vazio ou falha", () => {
  const app = readProjectFile("src/app.ts");
  const inicioExploracao = app.indexOf(
    "function inicializarExploracaoDoCatalogo",
  );
  const fimExploracao = app.indexOf(
    "function renderizarAnuncios",
    inicioExploracao,
  );
  const fluxoExploracao = app.slice(inicioExploracao, fimExploracao);
  const inicioErro = app.indexOf("function exibirErroAoCarregarAnuncios");
  const fimErro = app.indexOf(
    "function exibirErroAoCarregarAnunciosDoUsuario",
    inicioErro,
  );
  const fluxoErro = app.slice(inicioErro, fimErro);

  assert.match(
    fluxoExploracao,
    /getAttribute\("aria-busy"\) !== "true"[\s\S]*rolagemPrimeiroAnuncioPendente = false/,
  );
  assert.match(fluxoErro, /concluirRolagemPendenteDoCatalogo\(\)/);
});
