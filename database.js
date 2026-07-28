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

function mapearUsuario(row) {
  return {
    id: row.id,
    nome: row.nome,
    email: row.email,
  };
}

async function criarUsuario(dados) {
  const resultado = await pool.query(
    `
      INSERT INTO usuarios (nome, email, senha_hash)
      VALUES ($1, $2, $3)
      RETURNING id, nome, email
    `,
    [dados.nome, dados.email, dados.senhaHash],
  );

  return mapearUsuario(resultado.rows[0]);
}

async function buscarUsuarioPorEmail(email) {
  const resultado = await pool.query(
    `
      SELECT id, nome, email, senha_hash
      FROM usuarios
      WHERE email = $1
    `,
    [email],
  );
  const usuario = resultado.rows[0];

  return usuario
    ? {
        ...mapearUsuario(usuario),
        senhaHash: usuario.senha_hash,
      }
    : undefined;
}

async function buscarUsuarioPorId(id) {
  const resultado = await pool.query(
    `
      SELECT id, nome, email
      FROM usuarios
      WHERE id = $1
    `,
    [id],
  );
  const usuario = resultado.rows[0];

  return usuario ? mapearUsuario(usuario) : undefined;
}

async function registrarTokenRedefinicaoSenha(dados) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const resultadoUsuario = await client.query(
      `
        SELECT id
        FROM usuarios
        WHERE email = $1
        FOR UPDATE
      `,
      [dados.email],
    );
    const usuario = resultadoUsuario.rows[0];

    if (!usuario) {
      await client.query("COMMIT");
      return false;
    }

    await client.query(
      `
        UPDATE password_reset_tokens
        SET consumido_em = CURRENT_TIMESTAMP
        WHERE usuario_id = $1
          AND consumido_em IS NULL
      `,
      [usuario.id],
    );
    await client.query(
      `
        INSERT INTO password_reset_tokens (
          usuario_id,
          token_hash,
          expira_em
        )
        VALUES ($1, $2, $3)
      `,
      [usuario.id, dados.tokenHash, dados.expiraEm],
    );
    await client.query("COMMIT");

    return true;
  } catch (erro) {
    await client.query("ROLLBACK");
    throw erro;
  } finally {
    client.release();
  }
}

async function redefinirSenhaComToken(dados) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const resultadoToken = await client.query(
      `
        UPDATE password_reset_tokens
        SET consumido_em = CURRENT_TIMESTAMP
        WHERE token_hash = $1
          AND consumido_em IS NULL
          AND expira_em > CURRENT_TIMESTAMP
        RETURNING usuario_id
      `,
      [dados.tokenHash],
    );
    const tokenConsumido = resultadoToken.rows[0];

    if (!tokenConsumido) {
      await client.query("ROLLBACK");
      return false;
    }

    await client.query(
      `
        UPDATE usuarios
        SET senha_hash = $1
        WHERE id = $2
      `,
      [dados.senhaHash, tokenConsumido.usuario_id],
    );
    await client.query(
      `
        UPDATE password_reset_tokens
        SET consumido_em = CURRENT_TIMESTAMP
        WHERE usuario_id = $1
          AND consumido_em IS NULL
      `,
      [tokenConsumido.usuario_id],
    );
    await client.query("COMMIT");

    return true;
  } catch (erro) {
    await client.query("ROLLBACK");
    throw erro;
  } finally {
    client.release();
  }
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
  criarUsuario,
  buscarUsuarioPorEmail,
  buscarUsuarioPorId,
  registrarTokenRedefinicaoSenha,
  redefinirSenhaComToken,
  listarAnuncios,
  criarAnuncio,
  buscarAnuncioPorId,
  excluirAnuncioPorId,
  verificarConexao,
  fecharConexao,
  mapearAnuncio,
  mapearUsuario,
  pool,
};
