"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { readProjectFile } = require("./helpers/typescript-runtime");

test("estados excepcionais das novas rotas permanecem seguros e recuperáveis", () => {
  const html = readProjectFile("index.html");
  const app = readProjectFile("src/app.ts");
  const css = readProjectFile("public/styles.css");

  assert.match(
    app,
    /ehErroRequisicaoApi\(erro\) && erro\.status === 404[\s\S]*abrirPaginaInformativa\("nao-encontrada"[\s\S]*abrirPaginaInformativa\([\s\S]*"anuncio-indisponivel"/,
  );
  assert.match(app, /rotulo: "Tentar abrir novamente"/);

  assert.match(html, /aria-label="Fechar janela da minha conta"[\s\S]*<svg[\s\S]*<path/);
  assert.match(css, /\.dialogo-rota-fechar \{[\s\S]*height: 2\.75rem;[\s\S]*width: 2\.75rem;/);
  assert.match(app, /let elementoFocadoAntesDaConta: HTMLElement \| null = null/);
  assert.match(app, /elementoParaRestaurar\?\.focus\(\{ preventScroll: true \}\)/);

  assert.match(css, /\.pagina-informativa-texto h2,[\s\S]*margin: 0/);
  assert.match(css, /\.pagina-informativa-texto h2 \{[\s\S]*font-size:/);
});
