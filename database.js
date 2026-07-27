const path = require("node:path");
const { mkdirSync } = require("node:fs");
const { DatabaseSync } = require("node:sqlite");

const pastaDados = path.join(__dirname, "data");
const caminhoBanco = path.join(pastaDados, "marketplace.db");

mkdirSync(pastaDados, { recursive: true });

const database = new DatabaseSync(caminhoBanco);

database.exec(`
  CREATE TABLE IF NOT EXISTS anuncios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    categoria TEXT NOT NULL,
    condicao TEXT NOT NULL,
    modalidade TEXT NOT NULL,
    valor REAL NOT NULL DEFAULT 0,
    localizacao TEXT NOT NULL,
    descricao TEXT NOT NULL,
    imagemUrl TEXT NOT NULL DEFAULT '',
    usuarioId TEXT NOT NULL,
    usuarioNome TEXT NOT NULL,
    criadoEm TEXT NOT NULL DEFAULT (
      strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    )
  )
`);

const listarAnunciosStatement = database.prepare(`
  SELECT
    id,
    nome,
    categoria,
    condicao,
    modalidade,
    valor,
    localizacao,
    descricao,
    imagemUrl,
    usuarioId,
    usuarioNome,
    criadoEm
  FROM anuncios
  ORDER BY criadoEm DESC, id DESC
`);

const buscarAnuncioPorIdStatement = database.prepare(`
  SELECT
    id,
    nome,
    categoria,
    condicao,
    modalidade,
    valor,
    localizacao,
    descricao,
    imagemUrl,
    usuarioId,
    usuarioNome,
    criadoEm
  FROM anuncios
  WHERE id = ?
`);

const criarAnuncioStatement = database.prepare(`
  INSERT INTO anuncios (
    nome,
    categoria,
    condicao,
    modalidade,
    valor,
    localizacao,
    descricao,
    imagemUrl,
    usuarioId,
    usuarioNome
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

function listarAnuncios() {
  return listarAnunciosStatement.all();
}

function criarAnuncio(dados) {
  const resultado = criarAnuncioStatement.run(
    dados.nome,
    dados.categoria,
    dados.condicao,
    dados.modalidade,
    dados.valor,
    dados.localizacao,
    dados.descricao,
    dados.imagemUrl ?? "",
    dados.usuarioId,
    dados.usuarioNome,
  );

  return buscarAnuncioPorIdStatement.get(Number(resultado.lastInsertRowid));
}

module.exports = {
  listarAnuncios,
  criarAnuncio,
};
