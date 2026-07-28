CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL,
  token_hash VARCHAR(64) NOT NULL,
  expira_em TIMESTAMPTZ NOT NULL,
  consumido_em TIMESTAMPTZ,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT password_reset_tokens_usuario_fk
    FOREIGN KEY (usuario_id)
    REFERENCES usuarios (id)
    ON DELETE CASCADE,
  CONSTRAINT password_reset_tokens_hash_unico
    UNIQUE (token_hash),
  CONSTRAINT password_reset_tokens_hash_sha256
    CHECK (token_hash ~ '^[0-9a-f]{64}$'),
  CONSTRAINT password_reset_tokens_expiracao_valida
    CHECK (expira_em > criado_em),
  CONSTRAINT password_reset_tokens_consumo_valido
    CHECK (consumido_em IS NULL OR consumido_em >= criado_em)
);

CREATE INDEX password_reset_tokens_usuario_pendente_idx
  ON password_reset_tokens (usuario_id, expira_em DESC)
  WHERE consumido_em IS NULL;

CREATE INDEX password_reset_tokens_expiracao_idx
  ON password_reset_tokens (expira_em);
