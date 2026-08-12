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
    a.criado_em,
    a.cliques_detalhes,
    a.concluido_em
  FROM anuncios AS a
  INNER JOIN usuarios AS u
    ON u.id = a.usuario_id
`;

const SELECAO_OFERTA = `
  SELECT
    o.id,
    o.anuncio_id,
    a.nome AS anuncio_nome,
    a.imagem_url AS anuncio_imagem_url,
    a.concluido_em AS anuncio_concluido_em,
    o.valor,
    o.mensagem,
    o.comprador_id,
    comprador.nome AS comprador_nome,
    o.anunciante_id,
    anunciante.nome AS anunciante_nome,
    o.criado_em,
    COALESCE(
      (
        SELECT MAX(m.criado_em)
        FROM mensagens_oferta AS m
        WHERE m.oferta_id = o.id
      ),
      o.criado_em
    ) AS atualizado_em
  FROM ofertas AS o
  INNER JOIN anuncios AS a
    ON a.id = o.anuncio_id
  INNER JOIN usuarios AS comprador
    ON comprador.id = o.comprador_id
  INNER JOIN usuarios AS anunciante
    ON anunciante.id = o.anunciante_id
`;

function normalizarTimestamp(valor) {
  return valor instanceof Date
    ? valor.toISOString()
    : new Date(valor).toISOString();
}

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
    criadoEm: normalizarTimestamp(row.criado_em),
    cliquesDetalhes: Number(row.cliques_detalhes ?? 0),
    concluidoEm: row.concluido_em ? normalizarTimestamp(row.concluido_em) : null,
  };
}

function mapearOferta(row) {
  return {
    id: Number(row.id),
    anuncioId: Number(row.anuncio_id),
    anuncioNome: row.anuncio_nome,
    anuncioImagemUrl: row.anuncio_imagem_url,
    anuncioConcluidoEm: row.anuncio_concluido_em
      ? normalizarTimestamp(row.anuncio_concluido_em)
      : null,
    valor: Number(row.valor),
    mensagem: row.mensagem,
    compradorId: row.comprador_id,
    compradorNome: row.comprador_nome,
    anuncianteId: row.anunciante_id,
    anuncianteNome: row.anunciante_nome,
    criadaEm: normalizarTimestamp(row.criado_em),
    atualizadaEm: normalizarTimestamp(row.atualizado_em ?? row.criado_em),
  };
}

function mapearMensagemOferta(row) {
  return {
    id: Number(row.id),
    ofertaId: Number(row.oferta_id),
    autorId: row.autor_id,
    autorNome: row.autor_nome,
    conteudo: row.conteudo,
    criadaEm: normalizarTimestamp(row.criado_em),
  };
}

function mapearUsuario(row) {
  return {
    id: row.id,
    nome: row.nome,
    email: row.email,
    fotoPerfilUrl: row.foto_perfil_url ?? null,
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
      SELECT id, nome, email, senha_hash, foto_perfil_url
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

async function buscarPerfilUsuarioPorId(id) {
  const resultado = await pool.query(
    `
      SELECT id, nome, email, foto_perfil_url
      FROM usuarios
      WHERE id = $1
    `,
    [id],
  );
  const usuario = resultado.rows[0];

  return usuario ? mapearUsuario(usuario) : undefined;
}

async function buscarFotoPerfilUsuarioPorId(id) {
  const resultado = await pool.query(
    `
      SELECT foto_perfil_url
      FROM usuarios
      WHERE id = $1
    `,
    [id],
  );
  const usuario = resultado.rows[0];

  return usuario
    ? { fotoPerfilUrl: usuario.foto_perfil_url ?? null }
    : undefined;
}

async function atualizarFotoPerfilUsuario(id, fotoPerfilUrl) {
  const resultado = await pool.query(
    `
      UPDATE usuarios
      SET foto_perfil_url = $2
      WHERE id = $1
      RETURNING id, nome, email, foto_perfil_url
    `,
    [id, fotoPerfilUrl],
  );
  const usuario = resultado.rows[0];

  return usuario ? mapearUsuario(usuario) : undefined;
}

async function listarAnuncios(filtros = {}) {
  const categoria = filtros.categoria ?? null;
  const usuarioId = filtros.usuarioId ?? null;
  const incluirConcluidos = filtros.incluirConcluidos === true;

  const resultado = await pool.query(
    `
      ${SELECAO_ANUNCIO}
      WHERE ($1::text IS NULL OR a.categoria = $1)
        AND ($2::uuid IS NULL OR a.usuario_id = $2)
        AND ($3::boolean = true OR a.concluido_em IS NULL)
      ORDER BY a.criado_em DESC, a.id DESC
    `,
    [categoria, usuarioId, incluirConcluidos],
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
        a.criado_em,
        a.cliques_detalhes,
    a.concluido_em
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

async function atualizarAnuncioPorId(id, usuarioId, dados) {
  const resultado = await pool.query(
    `
      WITH anuncio_atualizado AS (
        UPDATE anuncios
        SET
          nome = $3,
          categoria = $4,
          condicao = $5,
          modalidade = $6,
          valor = $7,
          localizacao = $8,
          descricao = $9,
          imagem_url = $10
        WHERE id = $1
          AND usuario_id = $2
          AND concluido_em IS NULL
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
        a.criado_em,
        a.cliques_detalhes,
    a.concluido_em
      FROM anuncio_atualizado AS a
      INNER JOIN usuarios AS u
        ON u.id = a.usuario_id
    `,
    [
      id,
      usuarioId,
      dados.nome,
      dados.categoria,
      dados.condicao,
      dados.modalidade,
      dados.valor,
      dados.localizacao,
      dados.descricao,
      dados.imagemUrl ?? "",
    ],
  );
  const anuncio = resultado.rows[0];

  return anuncio ? mapearAnuncio(anuncio) : undefined;
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

async function concluirAnuncioPorId(id, usuarioId) {
  const resultado = await pool.query(
    `
      WITH anuncio_concluido AS (
        UPDATE anuncios
        SET concluido_em = CURRENT_TIMESTAMP
        WHERE id = $1
          AND usuario_id = $2
          AND concluido_em IS NULL
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
        a.criado_em,
        a.cliques_detalhes,
        a.concluido_em
      FROM anuncio_concluido AS a
      INNER JOIN usuarios AS u
        ON u.id = a.usuario_id
    `,
    [id, usuarioId],
  );

  const anuncio = resultado.rows[0];
  return anuncio ? mapearAnuncio(anuncio) : undefined;
}
async function registrarCliqueDetalhes(id) {
  const resultado = await pool.query(
    `
      UPDATE anuncios
      SET cliques_detalhes = cliques_detalhes + 1
      WHERE id = $1
        AND concluido_em IS NULL
      RETURNING cliques_detalhes
    `,
    [id],
  );

  const anuncio = resultado.rows[0];

  return anuncio
    ? {
        id,
        cliquesDetalhes: Number(anuncio.cliques_detalhes),
      }
    : undefined;
}

async function buscarOfertaComExecutor(executor, id) {
  const resultado = await executor.query(
    `
      ${SELECAO_OFERTA}
      WHERE o.id = $1
    `,
    [id],
  );
  const oferta = resultado.rows[0];

  return oferta ? mapearOferta(oferta) : undefined;
}

async function criarOferta(dados) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const resultado = await client.query(
      `
        INSERT INTO ofertas (
          anuncio_id,
          comprador_id,
          anunciante_id,
          valor,
          mensagem
        )
        SELECT
          a.id,
          $2,
          a.usuario_id,
          $3,
          $4
        FROM anuncios AS a
        WHERE a.id = $1
          AND a.usuario_id <> $2
          AND a.concluido_em IS NULL
        RETURNING id
      `,
      [
        dados.anuncioId,
        dados.compradorId,
        dados.valor,
        dados.mensagem,
      ],
    );
    const oferta = resultado.rows[0];

    if (!oferta) {
      await client.query("ROLLBACK");
      return undefined;
    }

    await client.query(
      `
        INSERT INTO mensagens_oferta (oferta_id, autor_id, conteudo)
        VALUES ($1, $2, $3)
      `,
      [oferta.id, dados.compradorId, dados.mensagem],
    );
    const ofertaCriada = await buscarOfertaComExecutor(client, oferta.id);
    await client.query("COMMIT");

    return ofertaCriada;
  } catch (erro) {
    await client.query("ROLLBACK");
    throw erro;
  } finally {
    client.release();
  }
}

async function listarOfertasDoUsuario(usuarioId) {
  const resultado = await pool.query(
    `
      ${SELECAO_OFERTA}
      WHERE o.comprador_id = $1
        OR o.anunciante_id = $1
      ORDER BY atualizado_em DESC, o.id DESC
    `,
    [usuarioId],
  );

  return resultado.rows.map(mapearOferta);
}

async function buscarOfertaPorId(id) {
  return buscarOfertaComExecutor(pool, id);
}

async function listarMensagensDaOferta(ofertaId, usuarioId) {
  const resultado = await pool.query(
    `
      SELECT
        m.id,
        m.oferta_id,
        m.autor_id,
        autor.nome AS autor_nome,
        m.conteudo,
        m.criado_em
      FROM mensagens_oferta AS m
      INNER JOIN ofertas AS o
        ON o.id = m.oferta_id
      INNER JOIN usuarios AS autor
        ON autor.id = m.autor_id
      WHERE m.oferta_id = $1
        AND (o.comprador_id = $2 OR o.anunciante_id = $2)
      ORDER BY m.criado_em ASC, m.id ASC
    `,
    [ofertaId, usuarioId],
  );

  return resultado.rows.map(mapearMensagemOferta);
}

async function criarMensagemOferta(dados) {
  const resultado = await pool.query(
    `
      WITH mensagem_inserida AS (
        INSERT INTO mensagens_oferta (oferta_id, autor_id, conteudo)
        SELECT o.id, $2, $3
        FROM ofertas AS o
        WHERE o.id = $1
          AND (o.comprador_id = $2 OR o.anunciante_id = $2)
        RETURNING *
      )
      SELECT
        m.id,
        m.oferta_id,
        m.autor_id,
        autor.nome AS autor_nome,
        m.conteudo,
        m.criado_em
      FROM mensagem_inserida AS m
      INNER JOIN usuarios AS autor
        ON autor.id = m.autor_id
    `,
    [dados.ofertaId, dados.autorId, dados.conteudo],
  );
  const mensagem = resultado.rows[0];

  return mensagem ? mapearMensagemOferta(mensagem) : undefined;
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
  buscarPerfilUsuarioPorId,
  buscarFotoPerfilUsuarioPorId,
  atualizarFotoPerfilUsuario,
  listarAnuncios,
  criarAnuncio,
  atualizarAnuncioPorId,
  buscarAnuncioPorId,
  excluirAnuncioPorId,
  concluirAnuncioPorId,
  registrarCliqueDetalhes,
  criarOferta,
  listarOfertasDoUsuario,
  buscarOfertaPorId,
  listarMensagensDaOferta,
  criarMensagemOferta,
  verificarConexao,
  fecharConexao,
  mapearAnuncio,
  mapearOferta,
  mapearMensagemOferta,
  mapearUsuario,
  pool,
};
