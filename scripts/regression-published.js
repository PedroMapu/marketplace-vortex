"use strict";

const assert = require("node:assert/strict");
const { randomUUID } = require("node:crypto");

const TEMPO_LIMITE_MS = 30_000;
const TENTATIVAS_HEALTHCHECK = 10;

function obterBaseUrl(valor = process.env.PUBLISHED_API_URL) {
  if (typeof valor !== "string" || valor.trim() === "") {
    throw new Error(
      "PUBLISHED_API_URL é obrigatória para a regressão publicada.",
    );
  }

  const url = new URL(valor.trim());

  if (url.protocol !== "https:") {
    throw new Error("PUBLISHED_API_URL deve usar HTTPS.");
  }

  if (url.username || url.password || url.search || url.hash) {
    throw new Error(
      "PUBLISHED_API_URL não pode conter credenciais, query ou fragmento.",
    );
  }

  url.pathname = url.pathname.replace(/\/+$/, "");
  return url.toString().replace(/\/$/, "");
}

async function esperar(tempoMs) {
  await new Promise((resolve) => setTimeout(resolve, tempoMs));
}

async function requisitar(baseUrl, caminho, opcoes = {}) {
  const resposta = await fetch(`${baseUrl}${caminho}`, {
    method: opcoes.method ?? "GET",
    headers: {
      Accept: "application/json",
      ...(opcoes.body === undefined
        ? {}
        : { "Content-Type": "application/json" }),
      ...(opcoes.token
        ? { Authorization: `Bearer ${opcoes.token}` }
        : {}),
    },
    body:
      opcoes.body === undefined ? undefined : JSON.stringify(opcoes.body),
    signal: AbortSignal.timeout(TEMPO_LIMITE_MS),
  });
  const contentType = resposta.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json")
    ? await resposta.json()
    : undefined;

  return {
    status: resposta.status,
    body,
    renderRouting: resposta.headers.get("x-render-routing"),
  };
}

async function aquecerApi(baseUrl) {
  let ultimoStatus = "falha de rede";

  for (let tentativa = 1; tentativa <= TENTATIVAS_HEALTHCHECK; tentativa += 1) {
    try {
      const resposta = await requisitar(baseUrl, "/api/status");
      ultimoStatus = `HTTP ${resposta.status}`;

      if (resposta.status === 200) {
        console.info(
          tentativa === 1
            ? "Healthcheck publicado: APROVADO."
            : `Healthcheck publicado: APROVADO após ${tentativa} tentativas (cold start/transiente).`,
        );
        return;
      }

      if (
        ![404, 502, 503].includes(resposta.status) &&
        resposta.renderRouting !== "no-server"
      ) {
        break;
      }
    } catch (erro) {
      ultimoStatus =
        erro?.name === "TimeoutError" ? "timeout" : "falha de rede";
    }

    if (tentativa < TENTATIVAS_HEALTHCHECK) {
      await esperar(Math.min(2_000 * tentativa, 8_000));
    }
  }

  throw new Error(`Healthcheck publicado indisponível (${ultimoStatus}).`);
}

function exigirStatus(resposta, status, etapa) {
  assert.equal(
    resposta.status,
    status,
    `${etapa} deveria responder HTTP ${status}.`,
  );
  assert.ok(
    resposta.body && typeof resposta.body === "object",
    `${etapa} deveria responder JSON.`,
  );
}

async function main() {
  const baseUrl = obterBaseUrl();
  const identificador = randomUUID().replaceAll("-", "");
  const senha = `Vortex!${randomUUID()}`;
  const contas = [
    {
      nome: `Regressão A ${identificador.slice(0, 8)}`,
      email: `vortex.regression.a.${identificador}@example.com`,
    },
    {
      nome: `Regressão B ${identificador.slice(0, 8)}`,
      email: `vortex.regression.b.${identificador}@example.com`,
    },
  ];
  let anuncioId;
  let tokenDoDono;

  await aquecerApi(baseUrl);

  try {
    for (const conta of contas) {
      const cadastro = await requisitar(baseUrl, "/api/auth/register", {
        method: "POST",
        body: { ...conta, senha },
      });
      exigirStatus(cadastro, 201, "Cadastro");
      assert.equal(typeof cadastro.body.token, "string");
      assert.equal(cadastro.body.usuario.email, conta.email);
    }
    console.info("Cadastros de dois usuários: APROVADO.");

    const sessoes = [];

    for (const conta of contas) {
      const login = await requisitar(baseUrl, "/api/auth/login", {
        method: "POST",
        body: { email: conta.email, senha },
      });
      exigirStatus(login, 200, "Login");
      assert.equal(typeof login.body.token, "string");
      sessoes.push(login.body);

      const me = await requisitar(baseUrl, "/api/auth/me", {
        token: login.body.token,
      });
      exigirStatus(me, 200, "Consulta da sessão");
      assert.equal(me.body.usuario.id, login.body.usuario.id);
    }
    console.info("Login e /api/auth/me dos dois usuários: APROVADO.");

    tokenDoDono = sessoes[0].token;
    const criacao = await requisitar(baseUrl, "/api/anuncios", {
      method: "POST",
      token: tokenDoDono,
      body: {
        nome: `Fixture regressão ${identificador.slice(0, 8)}`,
        categoria: "eletronicos",
        condicao: "usado",
        modalidade: "venda",
        valor: 49.9,
        localizacao: "Fortaleza - CE",
        descricao: "Fixture temporária da regressão publicada.",
        imagemUrl: "data:image/png;base64,iVBORw0KGgo=",
      },
    });
    exigirStatus(criacao, 201, "Criação do anúncio");
    anuncioId = criacao.body.id;
    assert.equal(criacao.body.usuarioId, sessoes[0].usuario.id);
    console.info("Criação autenticada: APROVADO.");

    const catalogo = await requisitar(baseUrl, "/api/anuncios");
    exigirStatus(catalogo, 200, "Listagem pública");
    assert.ok(Array.isArray(catalogo.body));
    assert.ok(catalogo.body.some(({ id }) => id === anuncioId));

    const filtroCorrespondente = await requisitar(
      baseUrl,
      "/api/anuncios?categoria=eletronicos",
    );
    exigirStatus(filtroCorrespondente, 200, "Filtro correspondente");
    assert.ok(Array.isArray(filtroCorrespondente.body));
    assert.ok(
      filtroCorrespondente.body.some(({ id }) => id === anuncioId),
      "O filtro correspondente deveria incluir a fixture.",
    );

    const filtroDiferente = await requisitar(
      baseUrl,
      "/api/anuncios?categoria=casa",
    );
    exigirStatus(filtroDiferente, 200, "Filtro diferente");
    assert.ok(Array.isArray(filtroDiferente.body));
    assert.ok(
      !filtroDiferente.body.some(({ id }) => id === anuncioId),
      "O filtro diferente não deveria incluir a fixture.",
    );
    console.info("Filtros públicos por categoria: APROVADO.");

    const meusDoDono = await requisitar(baseUrl, "/api/anuncios/me", {
      token: tokenDoDono,
    });
    exigirStatus(meusDoDono, 200, "Listagem do proprietário");
    assert.ok(meusDoDono.body.some(({ id }) => id === anuncioId));

    const meusDoOutroUsuario = await requisitar(
      baseUrl,
      "/api/anuncios/me",
      { token: sessoes[1].token },
    );
    exigirStatus(meusDoOutroUsuario, 200, "Listagem do segundo usuário");
    assert.ok(!meusDoOutroUsuario.body.some(({ id }) => id === anuncioId));
    console.info("Listagem pública e isolamento em /me: APROVADO.");

    const bloqueio = await requisitar(
      baseUrl,
      `/api/anuncios/${anuncioId}`,
      { method: "DELETE", token: sessoes[1].token },
    );
    exigirStatus(bloqueio, 403, "Bloqueio de exclusão alheia");
    assert.equal(bloqueio.body.codigo, "ANUNCIO_ALHEIO");
    console.info("Bloqueio 403 para o segundo usuário: APROVADO.");

    const exclusao = await requisitar(
      baseUrl,
      `/api/anuncios/${anuncioId}`,
      { method: "DELETE", token: tokenDoDono },
    );
    exigirStatus(exclusao, 200, "Exclusão pelo proprietário");
    anuncioId = undefined;
    console.info("Exclusão pelo proprietário: APROVADO.");
    console.info("Regressão HTTPS publicada: APROVADA.");
  } finally {
    if (anuncioId !== undefined && tokenDoDono) {
      try {
        const limpeza = await requisitar(
          baseUrl,
          `/api/anuncios/${anuncioId}`,
          { method: "DELETE", token: tokenDoDono },
        );

        if (![200, 404].includes(limpeza.status)) {
          console.error(
            `A limpeza da fixture respondeu HTTP ${limpeza.status}.`,
          );
        }
      } catch {
        console.error("Não foi possível confirmar a limpeza da fixture.");
      }
    }
  }
}

if (require.main === module) {
  main().catch((erro) => {
    console.error(`Regressão publicada falhou: ${erro.message}`);
    process.exitCode = 1;
  });
}

module.exports = {
  aquecerApi,
  obterBaseUrl,
  requisitar,
};
