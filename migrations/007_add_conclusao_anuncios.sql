ALTER TABLE anuncios
  ADD COLUMN concluido_em TIMESTAMPTZ;

CREATE INDEX anuncios_concluidos_idx
  ON anuncios (concluido_em)
  WHERE concluido_em IS NOT NULL;