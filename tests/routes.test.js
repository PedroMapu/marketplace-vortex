"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const {
  readProjectFile,
  transpileScript,
} = require("./helpers/typescript-runtime");

function carregarRotas() {
  const module = { exports: {} };
  const exports = module.exports;
  const source = transpileScript(
    readProjectFile("src/routes.ts")
      .replaceAll("export function", "function")
      .concat(
        "\nmodule.exports = { interpretarRota, sanitizarRedirecionamento, rotaEhProtegida, caminhoDaRota, caminhoDeEntradaPara, caminhoLegadoParaRota };\n",
      ),
    "src/routes.ts",
  );

  Function("module", "exports", "URL", source)(module, exports, URL);
  return module.exports;
}

test("interpreta rotas públicas, protegidas e dinâmicas", () => {
  const { interpretarRota } = carregarRotas();

  assert.deepEqual(
    interpretarRota(new URL("https://vortex.test/cadastro")),
    { nome: "cadastro", redirecionarPara: undefined },
  );
  assert.deepEqual(
    interpretarRota(new URL("https://vortex.test/anuncios/42")),
    { nome: "detalhes-anuncio", anuncioId: 42 },
  );
  assert.deepEqual(
    interpretarRota(new URL("https://vortex.test/conversas/9")),
    { nome: "conversas", ofertaId: 9 },
  );
});

test("preserva somente redirecionamentos internos permitidos", () => {
  const { interpretarRota } = carregarRotas();

  assert.deepEqual(
    interpretarRota(
      new URL("https://vortex.test/entrar?redirect=%2Fanunciar"),
    ),
    { nome: "entrar", redirecionarPara: "/anunciar" },
  );
  assert.deepEqual(
    interpretarRota(
      new URL("https://vortex.test/entrar?redirect=https://malicioso.test"),
    ),
    { nome: "entrar", redirecionarPara: undefined },
  );
});

test("rejeita ids inválidos e produz rota 404", () => {
  const { interpretarRota } = carregarRotas();

  assert.deepEqual(
    interpretarRota(new URL("https://vortex.test/anuncios/0")),
    { nome: "nao-encontrada", caminho: "/anuncios/0" },
  );
  assert.deepEqual(
    interpretarRota(new URL("https://vortex.test/rota-inexistente")),
    { nome: "nao-encontrada", caminho: "/rota-inexistente" },
  );
});

test("converte hashes legados para os novos caminhos", () => {
  const { caminhoLegadoParaRota } = carregarRotas();

  assert.equal(caminhoLegadoParaRota("#lista-anuncios"), "/anuncios");
  assert.equal(
    caminhoLegadoParaRota("#entrar/anunciar"),
    "/entrar?redirect=%2Fanunciar",
  );
  assert.equal(caminhoLegadoParaRota("#como-funciona"), null);
});
