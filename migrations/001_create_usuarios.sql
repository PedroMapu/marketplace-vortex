CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(80) NOT NULL,
  email VARCHAR(254) NOT NULL,
  senha_hash TEXT NOT NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT usuarios_nome_preenchido
    CHECK (nome = btrim(nome) AND nome <> ''),
  CONSTRAINT usuarios_email_normalizado
    CHECK (email = lower(btrim(email)) AND email <> ''),
  CONSTRAINT usuarios_email_unico
    UNIQUE (email),
  CONSTRAINT usuarios_senha_hash_preenchida
    CHECK (btrim(senha_hash) <> '')
);
