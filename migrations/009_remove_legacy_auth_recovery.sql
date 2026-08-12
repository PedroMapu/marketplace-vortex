DROP TABLE IF EXISTS password_reset_tokens;

ALTER TABLE usuarios
DROP COLUMN IF EXISTS auth_version;
