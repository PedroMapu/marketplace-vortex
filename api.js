const express = require("express");
const path = require("path");
const { criarCors } = require("./cors");
const bcrypt = require("bcryptjs");
const {
  criarUsuario,
  buscarUsuarioPorEmail,
  listarAnuncios,
  criarAnuncio,
  atualizarAnuncioPorId,
  buscarAnuncioPorId,
  excluirAnuncioPorId,
  registrarCliqueDetalhes,
  criarOferta,
  listarOfertasDoUsuario,
  buscarOfertaPorId,
  listarMensagensDaOferta,
  criarMensagemOferta,
  verificarConexao,
} = require("./database");
const { criarToken, usuarioPublico } = require("./auth");
const { autenticarBearer } = require("./middleware-auth");
const {
  registrarRotasRedefinicaoSenha,
} = require("./password-reset-routes");
const {
  schemaCadastro,
  schemaLogin,
  schemaAnuncio,
  schemaFiltrosAnuncios,
  schemaParametroAnuncio,
  schemaParametroOferta,
  schemaOferta,
  schemaMensagemOferta,
} = require("./validacao");
const { responderErro, validarComSchema } = require("./erros-api");

const app = express();
const BCRYPT_CUSTO = 12;
const HASH_SENHA_FICTICIO =
  "$2b$12$fAzASl/aMTGnZKZfgaZLWeoOUOBqFtGQnoQ2yhB0kT4XPkD38gqUi";

app.use(criarCors());
app.use("/api/auth", (request, response, next) => {
  response.set("Cache-Control", "no-store");
  return next();
});
app.use(express.json({ limit: "8mb" }));

app.get("/api/status", async (request, response) => {
  try {
    await verificarConexao();

    return response.status(200).json({
      mensagem: "API do Marketplace Vortex funcionando.",
    });
  } catch {
    return responderErro(
      response,
      503,
      "Banco de dados temporariamente indisponível.",
      "SERVICO_INDISPONIVEL",
    );
  }
});

function responderCredenciaisInvalidas(response) {
  return responderErro(
    response,
    401,
    "E-mail ou senha inválidos.",
    "CREDENCIAIS_INVALIDAS",
  );
}

app.post("/api/auth/register", async (request, response) => {
  const validacao = validarComSchema(schemaCadastro, request.body);

  if (!validacao.sucesso) {
    return responderErro(
      response,
      400,
      "Dados de cadastro inválidos.",
      "VALIDACAO",
      validacao.campos,
    );
  }

  const dados = {
    nome: validacao.dados.nome,
    email: validacao.dados.email,
    senhaHash: await bcrypt.hash(validacao.dados.senha, BCRYPT_CUSTO),
  };

  try {
    const usuario = await criarUsuario(dados);

    return response.status(201).json({
      token: criarToken(usuario),
      usuario: usuarioPublico(usuario),
    });
  } catch (erro) {
    if (erro?.code === "23505") {
      return responderErro(
        response,
        409,
        "Já existe uma conta com este e-mail.",
        "EMAIL_EM_USO",
        {
          email: "Este e-mail já está cadastrado.",
        },
      );
    }

    throw erro;
  }
});

app.post("/api/auth/login", async (request, response) => {
  const validacao = validarComSchema(schemaLogin, request.body);

  if (!validacao.sucesso) {
    return responderCredenciaisInvalidas(response);
  }

  const usuario = await buscarUsuarioPorEmail(validacao.dados.email);
  const senhaCorresponde = await bcrypt.compare(
    validacao.dados.senha,
    usuario?.senhaHash ?? HASH_SENHA_FICTICIO,
  );

  if (!usuario || !senhaCorresponde) {
    return responderCredenciaisInvalidas(response);
  }

  return response.status(200).json({
    token: criarToken(usuario),
    usuario: usuarioPublico(usuario),
  });
});

app.get("/api/auth/me", autenticarBearer, (request, response) => {
  return response.status(200).json({
    usuario: usuarioPublico(request.usuario),
  });
});

registrarRotasRedefinicaoSenha(app);

function normalizarAnuncio(dados, usuario) {
  return {
    nome: dados.nome,
    categoria: dados.categoria,
    condicao: dados.condicao,
    modalidade: dados.modalidade,
    valor: dados.valor,
    localizacao: dados.localizacao,
    descricao: dados.descricao,
    imagemUrl: dados.imagemUrl,
    usuarioId: usuario.id,
    usuarioNome: usuario.nome,
  };
}

app.get("/api/anuncios", async (request, response) => {
  const validacao = validarComSchema(schemaFiltrosAnuncios, request.query);

  if (!validacao.sucesso) {
    return responderErro(
      response,
      400,
      "Filtros de anúncios inválidos.",
      "VALIDACAO",
      validacao.campos,
    );
  }

  const anuncios = await listarAnuncios(validacao.dados);
  return response.status(200).json(anuncios);
});

app.get("/api/anuncios/me", autenticarBearer, async (request, response) => {
  const anuncios = await listarAnuncios({
    usuarioId: request.usuario.id,
  });

  return response.status(200).json(anuncios);
});

app.post("/api/anuncios", autenticarBearer, async (request, response) => {
  const validacao = validarComSchema(schemaAnuncio, request.body);

  if (!validacao.sucesso) {
    return responderErro(
      response,
      400,
      "Dados do anúncio inválidos.",
      "VALIDACAO",
      validacao.campos,
    );
  }

  const anuncio = await criarAnuncio(
    normalizarAnuncio(validacao.dados, request.usuario),
  );
  return response.status(201).json(anuncio);
});

app.patch(
  "/api/anuncios/:id",
  autenticarBearer,
  async (request, response) => {
    const validacaoParametro = validarComSchema(
      schemaParametroAnuncio,
      request.params,
    );

    if (!validacaoParametro.sucesso) {
      return responderErro(
        response,
        400,
        "Parâmetro de anúncio inválido.",
        "VALIDACAO",
        validacaoParametro.campos,
      );
    }

    const validacao = validarComSchema(schemaAnuncio, request.body);

    if (!validacao.sucesso) {
      return responderErro(
        response,
        400,
        "Dados do anúncio inválidos.",
        "VALIDACAO",
        validacao.campos,
      );
    }

    const { id } = validacaoParametro.dados;
    const anuncio = await buscarAnuncioPorId(id);

    if (!anuncio) {
      return responderErro(
        response,
        404,
        "Anúncio não encontrado.",
        "ANUNCIO_NAO_ENCONTRADO",
      );
    }

    if (anuncio.usuarioId !== request.usuario.id) {
      return responderErro(
        response,
        403,
        "Você só pode editar os seus próprios anúncios.",
        "ANUNCIO_ALHEIO",
      );
    }

    const anuncioAtualizado = await atualizarAnuncioPorId(
      id,
      request.usuario.id,
      validacao.dados,
    );

    if (!anuncioAtualizado) {
      return responderErro(
        response,
        404,
        "Anúncio não encontrado.",
        "ANUNCIO_NAO_ENCONTRADO",
      );
    }

    return response.status(200).json(anuncioAtualizado);
  },
);

app.post("/api/anuncios/:id/cliques-detalhes", async (request, response) => {
  const validacao = validarComSchema(schemaParametroAnuncio, request.params);

  if (!validacao.sucesso) {
    return responderErro(
      response,
      400,
      "Parâmetro de anúncio inválido.",
      "VALIDACAO",
      validacao.campos,
    );
  }

  const resultado = await registrarCliqueDetalhes(validacao.dados.id);

  if (!resultado) {
    return responderErro(
      response,
      404,
      "Anúncio não encontrado.",
      "ANUNCIO_NAO_ENCONTRADO",
    );
  }

  return response.status(200).json(resultado);
});

app.post(
  "/api/anuncios/:id/ofertas",
  autenticarBearer,
  async (request, response) => {
    const validacaoParametro = validarComSchema(
      schemaParametroAnuncio,
      request.params,
    );

    if (!validacaoParametro.sucesso) {
      return responderErro(
        response,
        400,
        "Parâmetro de anúncio inválido.",
        "VALIDACAO",
        validacaoParametro.campos,
      );
    }

    const validacao = validarComSchema(schemaOferta, request.body);

    if (!validacao.sucesso) {
      return responderErro(
        response,
        400,
        "Dados da oferta inválidos.",
        "VALIDACAO",
        validacao.campos,
      );
    }

    const anuncio = await buscarAnuncioPorId(validacaoParametro.dados.id);

    if (!anuncio) {
      return responderErro(
        response,
        404,
        "Anúncio não encontrado.",
        "ANUNCIO_NAO_ENCONTRADO",
      );
    }

    if (anuncio.usuarioId === request.usuario.id) {
      return responderErro(
        response,
        403,
        "Você não pode fazer uma oferta no seu próprio anúncio.",
        "OFERTA_PROPRIO_ANUNCIO",
      );
    }

    const oferta = await criarOferta({
      anuncioId: anuncio.id,
      compradorId: request.usuario.id,
      valor: validacao.dados.valor,
      mensagem: validacao.dados.mensagem,
    });

    if (!oferta) {
      return responderErro(
        response,
        404,
        "Anúncio não encontrado.",
        "ANUNCIO_NAO_ENCONTRADO",
      );
    }

    return response.status(201).json(oferta);
  },
);

app.get("/api/ofertas", autenticarBearer, async (request, response) => {
  const ofertas = await listarOfertasDoUsuario(request.usuario.id);
  return response.status(200).json(ofertas);
});

async function obterOfertaAutorizada(request, response) {
  const validacao = validarComSchema(schemaParametroOferta, request.params);

  if (!validacao.sucesso) {
    responderErro(
      response,
      400,
      "Parâmetro de oferta inválido.",
      "VALIDACAO",
      validacao.campos,
    );
    return undefined;
  }

  const oferta = await buscarOfertaPorId(validacao.dados.id);

  if (!oferta) {
    responderErro(
      response,
      404,
      "Oferta não encontrada.",
      "OFERTA_NAO_ENCONTRADA",
    );
    return undefined;
  }

  if (
    oferta.compradorId !== request.usuario.id &&
    oferta.anuncianteId !== request.usuario.id
  ) {
    responderErro(
      response,
      403,
      "Você não participa desta conversa.",
      "OFERTA_SEM_ACESSO",
    );
    return undefined;
  }

  return oferta;
}

app.get(
  "/api/ofertas/:id/mensagens",
  autenticarBearer,
  async (request, response) => {
    const oferta = await obterOfertaAutorizada(request, response);

    if (!oferta) {
      return;
    }

    const mensagens = await listarMensagensDaOferta(
      oferta.id,
      request.usuario.id,
    );
    return response.status(200).json(mensagens);
  },
);

app.post(
  "/api/ofertas/:id/mensagens",
  autenticarBearer,
  async (request, response) => {
    const oferta = await obterOfertaAutorizada(request, response);

    if (!oferta) {
      return;
    }

    const validacao = validarComSchema(schemaMensagemOferta, request.body);

    if (!validacao.sucesso) {
      return responderErro(
        response,
        400,
        "Dados da mensagem inválidos.",
        "VALIDACAO",
        validacao.campos,
      );
    }

    const mensagem = await criarMensagemOferta({
      ofertaId: oferta.id,
      autorId: request.usuario.id,
      conteudo: validacao.dados.conteudo,
    });

    if (!mensagem) {
      return responderErro(
        response,
        403,
        "Você não participa desta conversa.",
        "OFERTA_SEM_ACESSO",
      );
    }

    return response.status(201).json(mensagem);
  },
);

app.delete("/api/anuncios/:id", autenticarBearer, async (request, response) => {
  const validacao = validarComSchema(schemaParametroAnuncio, request.params);

  if (!validacao.sucesso) {
    return responderErro(
      response,
      400,
      "Parâmetro de anúncio inválido.",
      "VALIDACAO",
      validacao.campos,
    );
  }

  const { id } = validacao.dados;
  const anuncio = await buscarAnuncioPorId(id);

  if (!anuncio) {
    return responderErro(
      response,
      404,
      "Anúncio não encontrado.",
      "ANUNCIO_NAO_ENCONTRADO",
    );
  }

  if (anuncio.usuarioId !== request.usuario.id) {
    return responderErro(
      response,
      403,
      "Você só pode excluir os seus próprios anúncios.",
      "ANUNCIO_ALHEIO",
    );
  }

  if (!(await excluirAnuncioPorId(id, request.usuario.id))) {
    return responderErro(
      response,
      404,
      "Anúncio não encontrado.",
      "ANUNCIO_NAO_ENCONTRADO",
    );
  }

  return response.status(200).json({
    mensagem: "Anúncio excluído com sucesso.",
    id,
  });
});

app.use(express.static(path.join(__dirname, "public")));

app.use("/api", (request, response) => {
  return responderErro(
    response,
    404,
    "Rota da API não encontrada.",
    "ROTA_NAO_ENCONTRADA",
  );
});

app.use((erro, request, response, next) => {
  if (erro?.type === "entity.too.large" || erro?.status === 413) {
    return responderErro(
      response,
      413,
      "O corpo da requisição excede o limite de 8 MB.",
      "CORPO_MUITO_GRANDE",
    );
  }

  if (erro instanceof SyntaxError && erro.status === 400 && "body" in erro) {
    return responderErro(
      response,
      400,
      "JSON inválido.",
      "JSON_INVALIDO",
    );
  }

  console.error("Erro interno da API.", {
    metodo: request.method,
    rota: request.route?.path ?? "desconhecida",
  });

  if (request.path.startsWith("/api/")) {
    return responderErro(
      response,
      500,
      "Não foi possível processar a solicitação.",
      "ERRO_INTERNO",
    );
  }

  return next(erro);
});

module.exports = app;
