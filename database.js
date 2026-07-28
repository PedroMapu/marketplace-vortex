"use strict";

const { Pool } = require("pg");

/*
 * A connection string do Neon já carrega as opções de TLS (por exemplo,
 * `sslmode=require`). Não definimos `ssl` separadamente para não sobrescrever
 * essas opções.
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const SELECAO_ANUNCIO = `
  SELECT
    a.id,
    a.nome,
    a.categoria,
    a.condicao,
    a.modalidade,
    a.valor,
    a.localizacao,
    a.descricao,
    a.imagem_url,
    a.usuario_id,
    u.nome AS usuario_nome,
    a.criado_em
  FROM anuncios AS a
  INNER JOIN usuarios AS u
    ON u.id = a.usuario_id
`;

function mapearAnuncio(row) {
  return {
    id: Number(row.id),
    nome: row.nome,
    categoria: row.categoria,
    condicao: row.condicao,
    modalidade: row.modalidade,
    valor: Number(row.valor),
    localizacao: row.localizacao,
    descricao: row.descricao,
    imagemUrl: row.imagem_url,
    usuarioId: row.usuario_id,
    usuarioNome: row.usuario_nome,
    criadoEm:
      row.criado_em instanceof Date
        ? row.criado_em.toISOString()
        : new Date(row.criado_em).toISOString(),
  };
}

async function listarAnuncios(filtros = {}) {
  const categoria = filtros.categoria ?? null;
  const usuarioId = filtros.usuarioId ?? null;

  const resultado = await pool.query(
    `
      ${SELECAO_ANUNCIO}
      WHERE ($1::text IS NULL OR a.categoria = $1)
        AND ($2::uuid IS NULL OR a.usuario_id = $2)
      ORDER BY a.criado_em DESC, a.id DESC
    `,
    [categoria, usuarioId],
  );

  return resultado.rows.map(mapearAnuncio);
}

async function criarAnuncio(dados) {
  const resultado = await pool.query(
    `
      WITH anuncio_inserido AS (
        INSERT INTO anuncios (
          nome,
          categoria,
          condicao,
          modalidade,
          valor,
          localizacao,
          descricao,
          imagem_url,
          usuario_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      )
      SELECT
        a.id,
        a.nome,
        a.categoria,
        a.condicao,
        a.modalidade,
        a.valor,
        a.localizacao,
        a.descricao,
        a.imagem_url,
        a.usuario_id,
        u.nome AS usuario_nome,
        a.criado_em
      FROM anuncio_inserido AS a
      INNER JOIN usuarios AS u
        ON u.id = a.usuario_id
    `,
    [
      dados.nome,
      dados.categoria,
      dados.condicao,
      dados.modalidade,
      dados.valor,
      dados.localizacao,
      dados.descricao,
      dados.imagemUrl ?? "",
      dados.usuarioId,
    ],
  );

  return mapearAnuncio(resultado.rows[0]);
}

async function buscarAnuncioPorId(id) {
  const resultado = await pool.query(
    `
      ${SELECAO_ANUNCIO}
      WHERE a.id = $1
    `,
    [id],
  );

  const anuncio = resultado.rows[0];
  return anuncio ? mapearAnuncio(anuncio) : undefined;
}

async function excluirAnuncioPorId(id, usuarioId) {
  const resultado = await pool.query(
    `
      DELETE FROM anuncios
      WHERE id = $1
        AND usuario_id = $2
    `,
    [id, usuarioId],
  );

  return resultado.rowCount > 0;
}

async function verificarConexao() {
  await pool.query("SELECT 1");
  return true;
}

async function fecharConexao() {
  await pool.end();
}

module.exports = {
  listarAnuncios,
  criarAnuncio,
  buscarAnuncioPorId,
  excluirAnuncioPorId,
  verificarConexao,
  fecharConexao,
  mapearAnuncio,
  pool,
};
