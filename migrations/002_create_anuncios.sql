CREATE TABLE anuncios (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome VARCHAR(80) NOT NULL,
  categoria VARCHAR(20) NOT NULL,
  condicao VARCHAR(20) NOT NULL,
  modalidade VARCHAR(20) NOT NULL,
  valor NUMERIC(12, 2) NOT NULL DEFAULT 0,
  localizacao VARCHAR(120) NOT NULL,
  descricao VARCHAR(1000) NOT NULL,
  imagem_url TEXT NOT NULL DEFAULT '',
  usuario_id UUID NOT NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT anuncios_nome_preenchido
    CHECK (nome = btrim(nome) AND nome <> ''),
  CONSTRAINT anuncios_categoria_valida
    CHECK (categoria IN ('livros', 'eletronicos', 'casa', 'moda', 'outros')),
  CONSTRAINT anuncios_condicao_valida
    CHECK (condicao IN ('novo', 'seminovo', 'usado')),
  CONSTRAINT anuncios_modalidade_valida
    CHECK (modalidade IN ('venda', 'doacao')),
  CONSTRAINT anuncios_valor_no_intervalo
    CHECK (valor >= 0 AND valor <= 1000000),
  CONSTRAINT anuncios_valor_coerente_com_modalidade
    CHECK (
      (modalidade = 'venda' AND valor > 0)
      OR (modalidade = 'doacao' AND valor = 0)
    ),
  CONSTRAINT anuncios_localizacao_preenchida
    CHECK (localizacao = btrim(localizacao) AND localizacao <> ''),
  CONSTRAINT anuncios_descricao_preenchida
    CHECK (descricao = btrim(descricao) AND descricao <> ''),
  CONSTRAINT anuncios_usuario_fk
    FOREIGN KEY (usuario_id)
    REFERENCES usuarios (id)
    ON DELETE CASCADE
);

CREATE INDEX anuncios_categoria_ordem_idx
  ON anuncios (categoria, criado_em DESC, id DESC);

CREATE INDEX anuncios_usuario_ordem_idx
  ON anuncios (usuario_id, criado_em DESC, id DESC);

CREATE INDEX anuncios_ordem_idx
  ON anuncios (criado_em DESC, id DESC);
