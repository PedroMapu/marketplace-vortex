ALTER TABLE usuarios
ADD COLUMN IF NOT EXISTS auth_version INTEGER NOT NULL DEFAULT 0;

ALTER TABLE usuarios
DROP CONSTRAINT IF EXISTS usuarios_auth_version_nao_negativa;

ALTER TABLE usuarios
ADD CONSTRAINT usuarios_auth_version_nao_negativa
CHECK (auth_version >= 0);
