"use strict";

const assert = require("node:assert/strict");
const { once } = require("node:events");
const test = require("node:test");
const jwt = require("jsonwebtoken");
const app = require("../api");

async function requisitarRaw(
  caminho,
  { method = "GET", body, headers = {} } = {},
) {
  const servidor = app.listen(0, "127.0.0.1");
  await once(servidor, "listening");

  try {
    const { port } = servidor.address();
    const resposta = await fetch(`http://127.0.0.1:${port}${caminho}`, {
      method,
      headers: {
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        ...headers,
      },
      body,
    });

    return {
      status: resposta.status,
      body: await resposta.json(),
    };
  } finally {
    servidor.close();
    await once(servidor, "close");
  }
}

test("corpo inválido recebe 400 com campos no envelope uniforme", async () => {
  assert.deepEqual(
    await requisitarRaw("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        nome: "",
        email: "email-invalido",
        senha: "curta",
      }),
    }),
    {
      status: 400,
      body: {
        erro: "Dados de cadastro inválidos.",
        codigo: "VALIDACAO",
        campos: {
          nome: "Informe o nome.",
          email: "Informe um e-mail válido.",
          senha: "A senha deve ter entre 8 e 72 bytes.",
        },
      },
    },
  );
});

test("query inválida recebe 400 no envelope uniforme", async () => {
  assert.deepEqual(
    await requisitarRaw("/api/anuncios?categoria=nao-existe"),
    {
      status: 400,
      body: {
        erro: "Filtros de anúncios inválidos.",
        codigo: "VALIDACAO",
        campos: {
          categoria: "Categoria inválida.",
        },
      },
    },
  );
});

test("JSON malformado recebe 400 no envelope uniforme", async () => {
  assert.deepEqual(
    await requisitarRaw("/api/auth/register", {
      method: "POST",
      body: '{"nome":',
    }),
    {
      status: 400,
      body: {
        erro: "JSON inválido.",
        codigo: "JSON_INVALIDO",
      },
    },
  );
});

test("corpo JSON acima de 22 MB recebe 413 sem ecoar o conteúdo", async () => {
  const conteudo = "segredo".repeat(
    Math.ceil((22 * 1024 * 1024 + 1) / "segredo".length),
  );
  const resposta = await requisitarRaw("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ conteudo }),
  });

  assert.deepEqual(resposta, {
    status: 413,
    body: {
      erro: "O corpo da requisição excede o limite permitido para imagens de até 15 MB.",
      codigo: "CORPO_MUITO_GRANDE",
    },
  });
  assert.equal(JSON.stringify(resposta.body).includes("segredo"), false);
});

test("Bearer ausente, inválido ou expirado recebe o mesmo 401 seguro", async () => {
  const segredoOriginal = process.env.JWT_SECRET;
  const segredo = "segredo-de-testes-com-mais-de-32-bytes!";
  process.env.JWT_SECRET = segredo;

  const tokenExpirado = jwt.sign(
    {
      sub: "79ce52fb-1acf-455c-8d91-54e09a77e76b",
    },
    segredo,
    {
      algorithm: "HS256",
      issuer: "marketplace-vortex-api",
      audience: "marketplace-vortex-web",
      expiresIn: -1,
    },
  );

  try {
    for (const headers of [
      {},
      { Authorization: "Bearer token-invalido" },
      { Authorization: `Bearer ${tokenExpirado}` },
    ]) {
      assert.deepEqual(
        await requisitarRaw("/api/auth/me", { headers }),
        {
          status: 401,
          body: {
            erro: "Autenticação necessária.",
            codigo: "NAO_AUTENTICADO",
          },
        },
      );
    }
  } finally {
    if (segredoOriginal === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = segredoOriginal;
    }
  }
});

test("rota de API inexistente recebe 404 no envelope uniforme", async () => {
  assert.deepEqual(await requisitarRaw("/api/rota-inexistente"), {
    status: 404,
    body: {
      erro: "Rota da API não encontrada.",
      codigo: "ROTA_NAO_ENCONTRADA",
    },
  });
});
