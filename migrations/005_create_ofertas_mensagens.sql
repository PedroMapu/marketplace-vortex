CREATE TABLE ofertas (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  anuncio_id INTEGER NOT NULL,
  comprador_id UUID NOT NULL,
  anunciante_id UUID NOT NULL,
  valor NUMERIC(12, 2) NOT NULL,
  mensagem VARCHAR(2000) NOT NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT ofertas_valor_no_intervalo
    CHECK (valor >= 0 AND valor <= 1000000),
  CONSTRAINT ofertas_participantes_distintos
    CHECK (comprador_id <> anunciante_id),
  CONSTRAINT ofertas_mensagem_preenchida
    CHECK (mensagem = btrim(mensagem) AND mensagem <> ''),
  CONSTRAINT ofertas_anuncio_fk
    FOREIGN KEY (anuncio_id)
    REFERENCES anuncios (id)
    ON DELETE CASCADE,
  CONSTRAINT ofertas_comprador_fk
    FOREIGN KEY (comprador_id)
    REFERENCES usuarios (id)
    ON DELETE CASCADE,
  CONSTRAINT ofertas_anunciante_fk
    FOREIGN KEY (anunciante_id)
    REFERENCES usuarios (id)
    ON DELETE CASCADE
);

CREATE TABLE mensagens_oferta (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  oferta_id INTEGER NOT NULL,
  autor_id UUID NOT NULL,
  conteudo VARCHAR(2000) NOT NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT mensagens_oferta_conteudo_preenchido
    CHECK (conteudo = btrim(conteudo) AND conteudo <> ''),
  CONSTRAINT mensagens_oferta_oferta_fk
    FOREIGN KEY (oferta_id)
    REFERENCES ofertas (id)
    ON DELETE CASCADE,
  CONSTRAINT mensagens_oferta_autor_fk
    FOREIGN KEY (autor_id)
    REFERENCES usuarios (id)
    ON DELETE CASCADE
);

CREATE INDEX ofertas_comprador_ordem_idx
  ON ofertas (comprador_id, criado_em DESC, id DESC);

CREATE INDEX ofertas_anunciante_ordem_idx
  ON ofertas (anunciante_id, criado_em DESC, id DESC);

CREATE INDEX mensagens_oferta_ordem_idx
  ON mensagens_oferta (oferta_id, criado_em ASC, id ASC);
