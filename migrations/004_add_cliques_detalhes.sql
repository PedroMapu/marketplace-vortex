ALTER TABLE anuncios
ADD COLUMN cliques_detalhes INTEGER NOT NULL DEFAULT 0;

ALTER TABLE anuncios
ADD CONSTRAINT anuncios_cliques_detalhes_nao_negativo
CHECK (cliques_detalhes >= 0);
