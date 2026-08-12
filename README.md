# Marketplace de Economia Circular

Aplicação full stack para cadastro institucional, autenticação, publicação,
edição, filtros combinados, ofertas e conversas sobre anúncios destinados à
reutilização, venda ou doação. O frontend é uma PWA em TypeScript e o backend
expõe uma API REST com autenticação JWT e persistência PostgreSQL.

## Links públicos

- Frontend na Vercel:
  [https://marketplace-vortex-nine.vercel.app](https://marketplace-vortex-nine.vercel.app)
- Status público da API:
  [https://marketplace-vortex-api.onrender.com/api/status](https://marketplace-vortex-api.onrender.com/api/status)

## Arquitetura

- **Frontend:** HTML e CSS nativos, TypeScript estrito e Vite. A Vercel executa
  `npm run build` e publica o diretório estático `dist`.
- **PWA:** `vite-plugin-pwa` em modo `injectManifest`. O Service Worker
  pré-armazena o shell e aplica `network-first` somente ao catálogo público
  `GET /api/anuncios`, preservando URL e query string.
- **API:** Node.js, Express 5, Zod, JWT e bcryptjs, publicada separadamente no
  Render.
- **Banco:** PostgreSQL no Neon. A API usa a conexão pooled, enquanto o runner
  de migrations usa a conexão direta.
- **Integração:** o frontend recebe a origem pública da API em
  `VITE_API_URL`; a API aceita a origem exata da Vercel por meio de
  `FRONTEND_ORIGINS`.

Dados autenticados, tokens, anúncios próprios, ofertas, mensagens e mutações não
entram no cache do Service Worker. Depois de criar, editar ou excluir um anúncio,
o frontend invalida todas as variantes do catálogo público.

Novas contas aceitam exclusivamente e-mails do domínio `@edu.unifor.br`. O
cadastro também exige a confirmação da senha no frontend antes de enviar os
dados à API.

## Requisitos e instalação local

- Node.js 24.x.
- Uma instância PostgreSQL de desenvolvimento.
- Uma instância PostgreSQL isolada para executar os testes de integração.

```powershell
npm ci
Copy-Item .env.example .env
npm run migrate
```

Preencha o `.env` local antes de iniciar os serviços. Em terminais separados:

```powershell
npm run dev:api
npm run dev:web
```

O Vite abre o frontend em `http://localhost:5173` e encaminha `/api` para a API
local em `http://127.0.0.1:3000`.

## Variáveis de ambiente

| Variável | Onde usar | Finalidade |
|---|---|---|
| `VITE_API_URL` | build do frontend | Origem pública da API, sem `/api` no final. É um valor público incorporado ao bundle. |
| `PORT` | API local/Render | Porta HTTP; o padrão local é `3000`. |
| `DATABASE_URL` | API | Conexão PostgreSQL pooled. |
| `DATABASE_URL_DIRECT` | migrations | Conexão PostgreSQL direta. |
| `TEST_DATABASE_URL` | testes | Banco ou branch exclusivo para testes; a proteção recusa o destino de produção. |
| `JWT_SECRET` | API | Segredo de assinatura com pelo menos 32 bytes. |
| `FRONTEND_ORIGINS` | API | Origens HTTP(S) exatas permitidas por CORS, separadas por vírgula e sem caminhos. |
| `PASSWORD_RESET_EXPOSE_TOKEN` | desenvolvimento/teste | Quando `true`, permite expor o token de redefinição apenas fora de produção. |
| `PASSWORD_RESET_FRONTEND_ORIGIN` | API | Origem pública usada para montar o link `/redefinir-senha`; obrigatória em produção. |
| `PASSWORD_RESET_FROM_EMAIL` | API | Remetente verificado usado nos e-mails de redefinição; obrigatório em produção. |
| `RESEND_API_KEY` | API | Credencial privada da Resend para entregar e-mails de redefinição; obrigatória em produção. |

Somente valores intencionalmente públicos podem usar o prefixo `VITE_`.
Credenciais de banco e `JWT_SECRET` devem existir apenas nos ambientes locais
ignorados pelo Git e nos painéis dos provedores.

## Comandos

| Comando | Uso |
|---|---|
| `npm run dev:web` | Inicia o Vite com proxy local para `/api`. |
| `npm run dev:api` | Inicia a API em modo de observação. |
| `npm run typecheck` | Executa o TypeScript estrito sem emitir arquivos. |
| `npm run build` | Gera o frontend de produção em `dist`. |
| `npm test` | Executa a suíte automatizada; a integração real exige `TEST_DATABASE_URL`. |
| `npm run migrate` | Aplica migrations idempotentes usando `DATABASE_URL_DIRECT`. |
| `npm run regression:published` | Executa o fluxo de regressão contra a API publicada configurada no processo. |
| `npm start` | Inicia a API Express. |

No Render, o serviço executa `npm ci` no build e
`npm run migrate && npm start` na inicialização.

## API

| Método e rota | Acesso | Descrição |
|---|---|---|
| `GET /api/status` | público | Verifica a API e a conexão PostgreSQL. |
| `POST /api/auth/register` | público | Cadastra usuário e devolve token e perfil. |
| `POST /api/auth/login` | público | Autentica e devolve token e perfil; aceita `manterConectado: true` para uma sessão de 30 dias. |
| `GET /api/auth/me` | Bearer JWT | Revalida a sessão atual. |
| `POST /api/auth/password-reset/request` | público | Registra uma solicitação sem revelar se o e-mail existe. |
| `POST /api/auth/password-reset/confirm` | público | Confirma a troca com token válido. |
| `GET /api/anuncios` | público | Lista o catálogo; aceita filtros públicos por categoria e usuário. |
| `GET /api/anuncios/:id` | público | Busca um anúncio ativo para permitir acesso direto por URL. |
| `GET /api/anuncios/me` | Bearer JWT | Lista somente os anúncios do usuário autenticado. |
| `POST /api/anuncios` | Bearer JWT | Cria anúncio com autoria obtida do token. |
| `PATCH /api/anuncios/:id` | Bearer JWT | Edita somente se o usuário for o proprietário. |
| `DELETE /api/anuncios/:id` | Bearer JWT | Exclui somente se o usuário for o proprietário. |
| `POST /api/anuncios/:id/cliques-detalhes` | público | Registra um clique em “Ver detalhes”. |
| `GET /api/ofertas` | Bearer JWT | Lista as conversas do usuário autenticado. |
| `POST /api/anuncios/:id/ofertas` | Bearer JWT | Envia uma oferta e inicia a conversa com o anunciante. |
| `GET /api/ofertas/:id/mensagens` | Bearer JWT | Lista mensagens apenas para os participantes da oferta. |
| `POST /api/ofertas/:id/mensagens` | Bearer JWT | Envia uma mensagem apenas como participante da oferta. |

Erros usam um envelope JSON com `erro`, `codigo` e, quando aplicável,
`campos`. A API cobre respostas 400, 401, 403, 404, 409, 413 e 500 sem expor
stack trace.

## Rotas do frontend

O histórico do navegador usa caminhos reais, com suporte a recarregamento e
links compartilháveis. A Vercel reescreve esses caminhos para o shell da SPA.

| Rota | Acesso | Tela |
|---|---|---|
| `/` e `/anuncios` | público | Página inicial e catálogo. |
| `/anuncios/:id` | público | Detalhes de um anúncio ativo. |
| `/entrar`, `/cadastro` | visitante | Login e criação de conta. |
| `/esqueci-senha`, `/redefinir-senha?token=...` | público | Solicitação e confirmação da redefinição de senha. |
| `/anunciar`, `/meus-anuncios` | autenticado | Criação e gestão de anúncios próprios. |
| `/conversas`, `/conversas/:id` | autenticado | Lista de conversas e conversa selecionada. |
| `/conta` | autenticado | Dados da conta, foto, senha e encerramento de sessão. |
| `/ajuda`, `/contato`, `/termos`, `/privacidade` | público | Suporte e conteúdo institucional. |

Rotas protegidas abertas sem sessão redirecionam para `/entrar` e preservam o
destino interno. Caminhos desconhecidos exibem uma página 404 sem perder a URL.

## PWA e funcionamento offline

O build gera `dist/service-worker.js`. O arquivo é servido na Vercel com
`Cache-Control: no-cache`, conforme `vercel.json`, para que o navegador sempre
possa revalidar atualizações do worker.

Depois que uma consulta pública do catálogo é carregada com rede, a mesma URL,
incluindo seus filtros, pode ser respondida pelo cache. A resposta offline
recebe `X-Vortex-Offline: 1`. Uma consulta diferente e ainda não armazenada
responde 503 com o código `OFFLINE_SEM_CACHE`.

## Deploy

### Frontend — Vercel

O projeto está criado e vinculado à pasta local na Vercel, e o deploy inicial
foi publicado pela CLI. O ambiente de produção usa
`VITE_API_URL=https://marketplace-vortex-api.onrender.com`, executa `npm run
build` e publica `dist`. O endpoint `/service-worker.js` foi validado com
`Cache-Control: no-cache`.

### API — Render

A origem `https://marketplace-vortex-nine.vercel.app` está incluída em
`FRONTEND_ORIGINS`. O deploy do Render está live e o CORS foi validado a partir
da origem pública da Vercel.

## Evidências e limitações

O frontend público respondeu HTTP 200. O bundle e o Service Worker publicados
apontam para a origem Render e foram auditados sem localhost, URLs PostgreSQL
ou nomes de segredos. `.env` e `.env.production.local` continuam ignorados pelo
Git.

O Render está live, `/api/status` responde separadamente, a allowlist/CORS foi
validada e o fluxo real da API aprovou cadastro, login, criação, listagem,
filtro, anúncios próprios, bloqueio 403 para o segundo usuário e exclusão pelo
proprietário.

Na revisão final, os fluxos visuais de cadastro institucional com confirmação de
senha, autenticação, filtros combinados, detalhes, Meus Anúncios, edição com
controle de propriedade, coleções, ofertas, chat e notificações foram validados
no Chrome. O layout móvel, incluindo o editor de anúncio, permaneceu dentro da
largura da viewport. `npm run typecheck`, `npm run build` e a suíte com banco
PostgreSQL isolado encerraram com sucesso, totalizando 100 testes aprovados.

A integração automática GitHub–Vercel ainda precisa receber acesso ao
repositório; até lá, novos deploys do frontend devem ser feitos pela CLI.
