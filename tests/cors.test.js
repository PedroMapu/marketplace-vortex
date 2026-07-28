const assert = require("node:assert/strict");
const { once } = require("node:events");
const test = require("node:test");
const express = require("express");
const {
  criarConfiguracaoCors,
  criarCors,
  lerOrigensFrontend,
} = require("../cors");

async function comServidor(configuracao, executar) {
  const app = express();

  app.use(criarCors(configuracao));
  app.get("/api/teste", (request, response) => {
    response.status(200).json({ ok: true });
  });

  const servidor = app.listen(0, "127.0.0.1");
  await once(servidor, "listening");

  try {
    const { port } = servidor.address();
    return await executar(`http://127.0.0.1:${port}`);
  } finally {
    servidor.close();
    await once(servidor, "close");
  }
}

test("desenvolvimento permite localhost com porta e ecoa a origem sem wildcard", async () => {
  const configuracao = criarConfiguracaoCors({ ambiente: "development" });

  await comServidor(configuracao, async (baseUrl) => {
    const resposta = await fetch(`${baseUrl}/api/teste`, {
      headers: { Origin: "http://localhost:5173" },
    });

    assert.equal(resposta.status, 200);
    assert.equal(
      resposta.headers.get("access-control-allow-origin"),
      "http://localhost:5173",
    );
    assert.equal(resposta.headers.get("access-control-allow-credentials"), null);
    assert.match(resposta.headers.get("vary"), /(?:^|,\s*)Origin(?:,|$)/);
  });
});

test("desenvolvimento reconhece também os endereços IPv4 e IPv6 de loopback", () => {
  const configuracao = criarConfiguracaoCors({ ambiente: "development" });
  const middleware = criarCors(configuracao);

  for (const origem of ["http://127.0.0.1:5173", "http://[::1]:5173"]) {
    const request = {
      method: "GET",
      get: (nome) => (nome === "Origin" ? origem : undefined),
    };
    const headers = new Map();
    const response = {
      set: (nome, valor) => headers.set(nome, valor),
      vary: () => {},
    };
    let continuou = false;

    middleware(request, response, () => {
      continuou = true;
    });

    assert.equal(continuou, true);
    assert.equal(headers.get("Access-Control-Allow-Origin"), origem);
  }
});

test("desenvolvimento bloqueia domínio que apenas contém localhost", async () => {
  const configuracao = criarConfiguracaoCors({ ambiente: "development" });

  await comServidor(configuracao, async (baseUrl) => {
    const resposta = await fetch(`${baseUrl}/api/teste`, {
      headers: { Origin: "https://localhost.exemplo.com" },
    });

    assert.equal(resposta.status, 403);
    assert.equal(resposta.headers.get("access-control-allow-origin"), null);
    assert.deepEqual(await resposta.json(), {
      erro: "A origem da solicitação não é permitida.",
      codigo: "ORIGEM_NAO_PERMITIDA",
    });
  });
});

test("produção usa correspondência exata da allowlist", async () => {
  const configuracao = criarConfiguracaoCors({
    ambiente: "production",
    frontendOrigins:
      "https://marketplace.example, https://admin.example:8443/",
  });

  await comServidor(configuracao, async (baseUrl) => {
    const permitida = await fetch(`${baseUrl}/api/teste`, {
      headers: { Origin: "https://admin.example:8443" },
    });
    const subdominio = await fetch(`${baseUrl}/api/teste`, {
      headers: { Origin: "https://www.marketplace.example" },
    });

    assert.equal(permitida.status, 200);
    assert.equal(
      permitida.headers.get("access-control-allow-origin"),
      "https://admin.example:8443",
    );
    assert.equal(subdominio.status, 403);
  });
});

test("preflight Bearer responde 204 com métodos e headers necessários", async () => {
  const configuracao = criarConfiguracaoCors({ ambiente: "development" });

  await comServidor(configuracao, async (baseUrl) => {
    const resposta = await fetch(`${baseUrl}/api/teste`, {
      method: "OPTIONS",
      headers: {
        Origin: "http://127.0.0.1:4173",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "authorization, content-type",
      },
    });

    assert.equal(resposta.status, 204);
    assert.equal(
      resposta.headers.get("access-control-allow-methods"),
      "GET, POST, DELETE, OPTIONS",
    );
    assert.equal(
      resposta.headers.get("access-control-allow-headers"),
      "Authorization, Content-Type",
    );
    assert.equal(resposta.headers.get("access-control-max-age"), "600");
    assert.match(
      resposta.headers.get("vary"),
      /(?:^|,\s*)Access-Control-Request-Method(?:,|$)/,
    );
    assert.match(
      resposta.headers.get("vary"),
      /(?:^|,\s*)Access-Control-Request-Headers(?:,|$)/,
    );
  });
});

test("preflight rejeita método ou cabeçalho fora da política", async () => {
  const configuracao = criarConfiguracaoCors({ ambiente: "development" });

  await comServidor(configuracao, async (baseUrl) => {
    const metodo = await fetch(`${baseUrl}/api/teste`, {
      method: "OPTIONS",
      headers: {
        Origin: "http://localhost:5173",
        "Access-Control-Request-Method": "PUT",
      },
    });
    const cabecalho = await fetch(`${baseUrl}/api/teste`, {
      method: "OPTIONS",
      headers: {
        Origin: "http://localhost:5173",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "X-Usuario-Id",
      },
    });

    assert.equal(metodo.status, 403);
    assert.equal(cabecalho.status, 403);
  });
});

test("produção falha cedo sem allowlist e rejeita entradas que não são origens", () => {
  assert.throws(
    () =>
      criarConfiguracaoCors({
        ambiente: "production",
        frontendOrigins: "",
      }),
    /FRONTEND_ORIGINS é obrigatória/,
  );
  assert.throws(
    () => lerOrigensFrontend("https://example.com/caminho"),
    /somente origens HTTP\(S\)/,
  );
  assert.throws(() => lerOrigensFrontend("*"), /Origem inválida/);
});

test("requisições sem Origin continuam disponíveis para healthchecks", async () => {
  const configuracao = criarConfiguracaoCors({
    ambiente: "production",
    frontendOrigins: "https://marketplace.example",
  });

  await comServidor(configuracao, async (baseUrl) => {
    const resposta = await fetch(`${baseUrl}/api/teste`);

    assert.equal(resposta.status, 200);
    assert.equal(resposta.headers.get("access-control-allow-origin"), null);
    assert.match(resposta.headers.get("vary"), /(?:^|,\s*)Origin(?:,|$)/);
  });
});
