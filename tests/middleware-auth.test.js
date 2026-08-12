"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");

const caminhoAuth = require.resolve("../auth");
const caminhoDatabase = require.resolve("../database");
const caminhoMiddleware = require.resolve("../middleware-auth");
const USUARIO_ID = "ea11c83e-a7b1-4ba4-9d27-1bbf94a6e945";

function carregarMiddleware({ verificarToken, buscarUsuarioPorId }) {
  const modulosOriginais = {
    auth: require.cache[caminhoAuth],
    database: require.cache[caminhoDatabase],
  };

  require.cache[caminhoAuth] = {
    id: caminhoAuth,
    filename: caminhoAuth,
    loaded: true,
    exports: { verificarToken },
  };
  require.cache[caminhoDatabase] = {
    id: caminhoDatabase,
    filename: caminhoDatabase,
    loaded: true,
    exports: { buscarUsuarioPorId },
  };
  delete require.cache[caminhoMiddleware];

  const middleware = require(caminhoMiddleware);

  return {
    middleware,
    restaurar() {
      delete require.cache[caminhoMiddleware];

      for (const [nome, caminho] of [
        ["auth", caminhoAuth],
        ["database", caminhoDatabase],
      ]) {
        if (modulosOriginais[nome]) {
          require.cache[caminho] = modulosOriginais[nome];
        } else {
          delete require.cache[caminho];
        }
      }
    },
  };
}

function criarRequest(authorization) {
  return {
    get(nome) {
      assert.equal(nome, "Authorization");
      return authorization;
    },
  };
}

function criarResponse() {
  return {
    statusCode: undefined,
    body: undefined,
    status(codigo) {
      this.statusCode = codigo;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

test("rejeita Authorization ausente ou fora do formato Bearer", async () => {
  let verificacoes = 0;
  let buscas = 0;
  const carregado = carregarMiddleware({
    verificarToken: () => {
      verificacoes += 1;
    },
    buscarUsuarioPorId: async () => {
      buscas += 1;
    },
  });

  try {
    for (const authorization of [
      undefined,
      "",
      "Basic credenciais",
      "Bearer",
      "Bearer token adicional",
    ]) {
      const response = criarResponse();
      let proximos = 0;

      await carregado.middleware.autenticarBearer(
        criarRequest(authorization),
        response,
        () => {
          proximos += 1;
        },
      );

      assert.equal(response.statusCode, 401);
      assert.deepEqual(response.body, {
        erro: "Autenticação necessária.",
        codigo: "NAO_AUTENTICADO",
      });
      assert.equal(proximos, 0);
    }

    assert.equal(verificacoes, 0);
    assert.equal(buscas, 0);
  } finally {
    carregado.restaurar();
  }
});

test("não diferencia token inválido, expirado ou adulterado na resposta", async () => {
  const carregado = carregarMiddleware({
    verificarToken: () => {
      throw new Error("jwt expired: detalhe interno");
    },
    buscarUsuarioPorId: async () => {
      throw new Error("não deveria consultar");
    },
  });
  const response = criarResponse();

  try {
    await carregado.middleware.autenticarBearer(
      criarRequest("Bearer token-invalido"),
      response,
      () => {
        throw new Error("não deveria avançar");
      },
    );

    assert.equal(response.statusCode, 401);
    assert.deepEqual(response.body, {
      erro: "Autenticação necessária.",
      codigo: "NAO_AUTENTICADO",
    });
  } finally {
    carregado.restaurar();
  }
});

test("rejeita payload sem sub UUID antes de consultar o banco", async () => {
  let buscas = 0;
  const carregado = carregarMiddleware({
    verificarToken: () => ({ sub: "usuario-legado" }),
    buscarUsuarioPorId: async () => {
      buscas += 1;
    },
  });
  const response = criarResponse();

  try {
    await carregado.middleware.autenticarBearer(
      criarRequest("bearer token-valido"),
      response,
      () => {
        throw new Error("não deveria avançar");
      },
    );

    assert.equal(response.statusCode, 401);
    assert.equal(buscas, 0);
  } finally {
    carregado.restaurar();
  }
});

test("rejeita sessão cujo usuário não existe mais", async () => {
  const carregado = carregarMiddleware({
    verificarToken: () => ({ sub: USUARIO_ID }),
    buscarUsuarioPorId: async () => undefined,
  });
  const request = criarRequest("Bearer token-valido");
  const response = criarResponse();

  try {
    await carregado.middleware.autenticarBearer(request, response, () => {
      throw new Error("não deveria avançar");
    });

    assert.equal(response.statusCode, 401);
    assert.equal(request.usuario, undefined);
  } finally {
    carregado.restaurar();
  }
});

test("anexa somente o DTO público do usuário e chama next", async () => {
  const carregado = carregarMiddleware({
    verificarToken: () => ({ sub: USUARIO_ID, ver: 2 }),
    buscarUsuarioPorId: async (id) => ({
      id,
      nome: "Ana",
      email: "ana@example.com",
      senhaHash: "hash-que-não-pode-vazar",
      authVersion: 2,
    }),
  });
  const request = criarRequest("Bearer token-valido");
  const response = criarResponse();
  let proximos = 0;

  try {
    await carregado.middleware.autenticarBearer(request, response, () => {
      proximos += 1;
    });

    assert.deepEqual(request.usuario, {
      id: USUARIO_ID,
      nome: "Ana",
      email: "ana@example.com",
    });
    assert.equal("senhaHash" in request.usuario, false);
    assert.equal(proximos, 1);
    assert.equal(response.statusCode, undefined);
  } finally {
    carregado.restaurar();
  }
});

test("rejeita JWT emitido antes de uma troca de senha", async () => {
  const carregado = carregarMiddleware({
    verificarToken: () => ({ sub: USUARIO_ID, ver: 1 }),
    buscarUsuarioPorId: async (id) => ({
      id,
      nome: "Ana",
      email: "ana@example.com",
      authVersion: 2,
    }),
  });
  const response = criarResponse();

  try {
    await carregado.middleware.autenticarBearer(
      criarRequest("Bearer token-antigo"),
      response,
      () => {
        throw new Error("não deveria avançar");
      },
    );

    assert.equal(response.statusCode, 401);
    assert.equal(response.body.codigo, "NAO_AUTENTICADO");
  } finally {
    carregado.restaurar();
  }
});

test("propaga falha inesperada do banco para o middleware de erro", async () => {
  const falha = new Error("banco indisponível");
  const carregado = carregarMiddleware({
    verificarToken: () => ({ sub: USUARIO_ID }),
    buscarUsuarioPorId: async () => {
      throw falha;
    },
  });

  try {
    await assert.rejects(
      carregado.middleware.autenticarBearer(
        criarRequest("Bearer token-valido"),
        criarResponse(),
        () => {
          throw new Error("não deveria avançar");
        },
      ),
      falha,
    );
  } finally {
    carregado.restaurar();
  }
});
