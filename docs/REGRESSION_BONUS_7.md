# Evidência sanitizada — Dia Bônus 7

Execução: 29/07/2026.

## Regressão local

- `npm run typecheck`: aprovado.
- `npm run build`: aprovado com Vite 8.1.5 e `injectManifest`.
- Artefato: `dist/index.html`, bundle JavaScript versionado e
  `dist/service-worker.js`.
- Precache: 6 entradas, 192,68 KiB.
- Guard de banco: `TEST_DATABASE_URL` confirmada como destino diferente de
  `DATABASE_URL` e `DATABASE_URL_DIRECT` antes de qualquer migration, conexão ou
  limpeza.
- `npm test`, com as variáveis do `.env` carregadas somente no processo:
  91 testes aprovados, 0 falhas, 0 ignorados.
- A suíte incluiu a integração real com PostgreSQL de teste, persistência entre
  conexões, migrations, contrato do banco, API, autenticação, autorização,
  validação, CORS, frontend/PWA, cache offline e invalidação.

Nenhuma URL de banco, credencial, senha ou token foi registrada nesta evidência.

## Regressão da API publicada

Destino público:
`https://marketplace-vortex-api.onrender.com`

Comando permanente:

```powershell
$env:PUBLISHED_API_URL = "https://marketplace-vortex-api.onrender.com"
npm run regression:published
```

Resultado aprovado:

1. `GET /api/status` respondeu 200 na primeira tentativa; não houve cold start,
   timeout, CORS ou `x-render-routing: no-server`.
2. Dois usuários com identificadores aleatórios foram cadastrados.
3. Login e `GET /api/auth/me` foram validados para os dois usuários.
4. O primeiro usuário criou um anúncio temporário.
5. A listagem pública e `GET /api/anuncios/me` confirmaram autoria e isolamento.
6. A exclusão pelo segundo usuário foi bloqueada com 403 e
   `ANUNCIO_ALHEIO`.
7. O proprietário excluiu o anúncio com sucesso.

O script possui limpeza defensiva em `finally` e tenta remover exclusivamente o
anúncio cujo ID foi criado pela própria execução. A API não oferece exclusão de
contas; portanto, os dois usuários aleatórios permanecem no banco sem anúncios.
O comando nunca imprime e-mails, senhas ou tokens.
