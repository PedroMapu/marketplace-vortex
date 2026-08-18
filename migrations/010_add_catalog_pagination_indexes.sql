CREATE INDEX IF NOT EXISTS anuncios_catalogo_ativos_ordem_idx
  ON anuncios (criado_em DESC, id DESC)
  WHERE concluido_em IS NULL;

CREATE INDEX IF NOT EXISTS anuncios_catalogo_ativos_categoria_ordem_idx
  ON anuncios (categoria, criado_em DESC, id DESC)
  WHERE concluido_em IS NULL;

CREATE INDEX IF NOT EXISTS anuncios_catalogo_ativos_usuario_ordem_idx
  ON anuncios (usuario_id, criado_em DESC, id DESC)
  WHERE concluido_em IS NULL;
