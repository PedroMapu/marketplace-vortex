const express = require("express");
const path = require("path");
const {
  listarAnuncios,
  criarAnuncio,
  buscarAnuncioPorId,
  excluirAnuncioPorId,
  verificarConexao,
} = require("./database");

const app = express();
const CATEGORIAS_VALIDAS = new Set([
  "livros",
  "eletronicos",
  "casa",
  "moda",
  "outros",
]);
const CONDICOES_VALIDAS = new Set(["novo", "seminovo", "usado"]);
const MODALIDADES_VALIDAS = new Set(["venda", "doacao"]);
const FORMATO_UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

app.use(express.json({ limit: "8mb" }));

app.get("/api/status", async (request, response) => {
  try {
    await verificarConexao();

    return response.status(200).json({
      mensagem: "API do Marketplace Vortex funcionando.",
    });
  } catch {
    return response.status(503).json({
      erro: "Banco de dados temporariamente indisponível.",
    });
  }
});

function textoObrigatorio(valor) {
  return typeof valor === "string" && valor.trim() !== "";
}

function validarFiltrosAnuncios(query) {
  const erros = {};
  const filtros = {};

  if (query.categoria !== undefined) {
    if (!textoObrigatorio(query.categoria)) {
      erros.categoria = "A categoria deve conter texto.";
    } else {
      const categoria = query.categoria.trim();

      if (!CATEGORIAS_VALIDAS.has(categoria)) {
        erros.categoria = "Categoria inválida.";
      } else {
        filtros.categoria = categoria;
      }
    }
  }

  if (query.usuarioId !== undefined) {
    if (!textoObrigatorio(query.usuarioId)) {
      erros.usuarioId = "O ID do usuário deve conter texto.";
    } else {
      const usuarioId = query.usuarioId.trim();

      if (!FORMATO_UUID.test(usuarioId)) {
        erros.usuarioId = "O ID do usuário deve ser um UUID válido.";
      } else {
        filtros.usuarioId = usuarioId;
      }
    }
  }

  return { erros, filtros };
}

function validarAnuncio(dados) {
  const erros = {};
  const camposObrigatorios = [
    "nome",
    "categoria",
    "condicao",
    "modalidade",
    "localizacao",
    "descricao",
    "usuarioId",
    "usuarioNome",
  ];

  if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
    return { corpo: "Envie um objeto JSON com os dados do anúncio." };
  }

  const modalidadeNormalizada = textoObrigatorio(dados.modalidade)
    ? dados.modalidade.trim()
    : "";

  camposObrigatorios.forEach((campo) => {
    if (!textoObrigatorio(dados[campo])) {
      erros[campo] = "Este campo é obrigatório e deve conter texto.";
    }
  });

  if (
    textoObrigatorio(dados.usuarioId) &&
    !FORMATO_UUID.test(dados.usuarioId.trim())
  ) {
    erros.usuarioId = "O ID do usuário deve ser um UUID válido.";
  }

  if (
    textoObrigatorio(dados.categoria) &&
    !CATEGORIAS_VALIDAS.has(dados.categoria.trim())
  ) {
    erros.categoria = "Categoria inválida.";
  }

  if (
    textoObrigatorio(dados.condicao) &&
    !CONDICOES_VALIDAS.has(dados.condicao.trim())
  ) {
    erros.condicao = "Condição inválida.";
  }

  if (
    textoObrigatorio(dados.modalidade) &&
    !MODALIDADES_VALIDAS.has(dados.modalidade.trim())
  ) {
    erros.modalidade = "Modalidade inválida.";
  }

  if (
    typeof dados.valor !== "number" ||
    !Number.isFinite(dados.valor) ||
    dados.valor < 0
  ) {
    erros.valor = "Informe um valor numérico maior ou igual a zero.";
  } else if (modalidadeNormalizada === "venda" && dados.valor === 0) {
    erros.valor = "Anúncios de venda devem ter valor maior que zero.";
  } else if (modalidadeNormalizada === "doacao" && dados.valor !== 0) {
    erros.valor = "Anúncios de doação devem ter valor igual a zero.";
  }

  if (
    dados.imagemUrl !== undefined &&
    typeof dados.imagemUrl !== "string"
  ) {
    erros.imagemUrl = "A URL da imagem deve ser um texto.";
  }

  return erros;
}

function normalizarAnuncio(dados) {
  return {
    nome: dados.nome.trim(),
    categoria: dados.categoria.trim(),
    condicao: dados.condicao.trim(),
    modalidade: dados.modalidade.trim(),
    valor: dados.valor,
    localizacao: dados.localizacao.trim(),
    descricao: dados.descricao.trim(),
    imagemUrl: dados.imagemUrl?.trim() || "",
    usuarioId: dados.usuarioId.trim(),
    usuarioNome: dados.usuarioNome.trim(),
  };
}

app.get("/api/anuncios", async (request, response) => {
  const { erros, filtros } = validarFiltrosAnuncios(request.query);

  if (Object.keys(erros).length > 0) {
    return response.status(400).json({
      erro: "Filtros de anúncios inválidos.",
      campos: erros,
    });
  }

  const anuncios = await listarAnuncios(filtros);
  return response.status(200).json(anuncios);
});

app.post("/api/anuncios", async (request, response) => {
  const erros = validarAnuncio(request.body);

  if (Object.keys(erros).length > 0) {
    return response.status(400).json({
      erro: "Dados do anúncio inválidos.",
      campos: erros,
    });
  }

  const anuncio = await criarAnuncio(normalizarAnuncio(request.body));
  return response.status(201).json(anuncio);
});

app.delete("/api/anuncios/:id", async (request, response) => {
  const id = Number(request.params.id);
  const idValido =
    /^[1-9]\d*$/.test(request.params.id) && Number.isSafeInteger(id);

  if (!idValido) {
    return response.status(400).json({
      erro: "O ID deve ser um número inteiro positivo.",
    });
  }

  const usuarioId = request.get("X-Usuario-Id");

  if (!textoObrigatorio(usuarioId)) {
    return response.status(401).json({
      erro: "Identifique o usuário para excluir um anúncio.",
    });
  }

  if (!FORMATO_UUID.test(usuarioId.trim())) {
    return response.status(400).json({
      erro: "O ID do usuário deve ser um UUID válido.",
    });
  }

  const anuncio = await buscarAnuncioPorId(id);

  if (!anuncio) {
    return response.status(404).json({
      erro: "Anúncio não encontrado.",
    });
  }

  const usuarioIdNormalizado = usuarioId.trim();

  if (anuncio.usuarioId !== usuarioIdNormalizado) {
    return response.status(403).json({
      erro: "Você só pode excluir os seus próprios anúncios.",
    });
  }

  if (!(await excluirAnuncioPorId(id, usuarioIdNormalizado))) {
    return response.status(404).json({
      erro: "Anúncio não encontrado.",
    });
  }

  return response.status(200).json({
    mensagem: "Anúncio excluído com sucesso.",
    id,
  });
});

app.use(express.static(path.join(__dirname, "public")));

app.use("/api", (request, response) => {
  response.status(404).json({
    erro: "Rota da API não encontrada.",
  });
});

app.use((erro, request, response, next) => {
  if (erro instanceof SyntaxError && erro.status === 400 && "body" in erro) {
    return response.status(400).json({
      erro: "JSON inválido.",
    });
  }

  console.error("Erro interno da API:", erro);

  if (request.path.startsWith("/api/")) {
    return response.status(500).json({
      erro: "Não foi possível processar a solicitação.",
    });
  }

  return next(erro);
});

module.exports = app;
