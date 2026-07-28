# Ambientes PostgreSQL no Neon

Este projeto mantém produção isolada de desenvolvimento e testes. O PostgreSQL
começa vazio: o SQLite em `data/` é apenas histórico local e não deve ser
importado, alterado ou apagado.

> Estado desta entrega: os recursos foram provisionados no Neon em
> 28/07/2026, na região AWS South America East 1 (São Paulo), com PostgreSQL 18
> e Neon Auth desativado. As credenciais ficam somente em arquivos locais
> ignorados pelo Git; nenhum segredo é registrado neste documento.

## Topologia provisionada

Foram criados dois projetos Neon para reduzir o risco de uma rotina local ou de
teste alcançar produção:

| Projeto Neon | Branch | Uso |
| --- | --- | --- |
| `marketplace-vortex-production` | `production` | API publicada no Render |
| `marketplace-vortex-nonproduction` | `development` | API local |
| `marketplace-vortex-nonproduction` | `test` | suíte automatizada e limpeza de dados |

A branch `test` deve ser exclusiva da suíte e não deve receber clone, reset ou
dados vindos de produção. O ambiente de produção não recebe `TEST_DATABASE_URL`.

## Contrato de variáveis

Use as URLs completas fornecidas pelo Neon e preserve os parâmetros SSL:

- `DATABASE_URL`: conexão pooled da API. No host, a URL pooled é identificada
  pelo sufixo `-pooler`.
- `DATABASE_URL_DIRECT`: conexão direta da mesma branch, sem `-pooler`, usada
  somente pelo migration runner.
- `TEST_DATABASE_URL`: conexão da branch `test`, exclusiva para a suíte. Ela
  nunca pode ser igual a uma URL de produção.

No desenvolvimento, coloque os valores das branches `development` e `test` em
um arquivo local ignorado pelo Git:

```dotenv
DATABASE_URL=<pooled da branch development>
DATABASE_URL_DIRECT=<direct da branch development>
TEST_DATABASE_URL=<conexão exclusiva da branch test>
```

No Render, cadastre somente:

```text
DATABASE_URL=<pooled da branch production>
DATABASE_URL_DIRECT=<direct da branch production>
```

Essas variáveis são privadas. Não use o prefixo `VITE_`, não as coloque no
frontend e não registre seus valores em logs, capturas, documentação ou commits.

## Configuração realizada no painel Neon

1. `marketplace-vortex-nonproduction` foi criado com `development` como branch
   padrão e `test` como branch filha permanente, sem expiração automática.
2. `marketplace-vortex-production` foi criado com somente a branch
   `production`.
3. As URLs pooled e diretas foram obtidas separadamente pelo painel.
4. `.env` aponta apenas para `development` e `test`;
   `.env.production.local` aponta somente para `production`. Ambos são
   ignorados pelo Git.
5. As migrations foram executadas duas vezes em cada ambiente: a primeira
   aplicou os dois arquivos e a segunda confirmou ambos como já aplicados.

## Validação segura

Antes de executar qualquer teste destrutivo, a suíte deve recusar a execução
quando:

- `TEST_DATABASE_URL` estiver ausente;
- `TEST_DATABASE_URL` for igual a `DATABASE_URL` ou `DATABASE_URL_DIRECT`;

Valide no painel que as três branches existem e que as URLs apontam aos ambientes
esperados e não execute a suíte se o endpoint de teste pertencer à produção.
Faça o teste de conexão sem imprimir as URLs. A migration deve ser executada
duas vezes em cada ambiente sem duplicar estrutura.

Validação executada em 28/07/2026:

- `development`: 2 migrations, 0 usuários e 0 anúncios;
- `test`: 2 migrations, 0 usuários e 0 anúncios após a limpeza da fixture;
- `production`: 2 migrations, 0 usuários e 0 anúncios;
- o smoke test real de criação, listagem, filtros, exclusão e persistência entre
  conexões foi aprovado na branch `test`.

## Smoke test do CRUD

O fluxo de nome temporário anterior ao JWT gera IDs com prefixo `usuario-`, que
não são UUIDs e não correspondem a registros de `usuarios`. Ele é mantido no
frontend somente como legado até o Dia Bônus 4; não crie um usuário implícito
nem aceite autoria fornecida sem autenticação para contornar essa transição.

Para validar o Dia Bônus 3 sem antecipar autenticação, configure
`TEST_DATABASE_URL` com a branch exclusiva `test` e execute `npm test`.

O teste de integração aplica as migrations, cria um usuário fixture com UUID e
e-mail/hash fictícios, exerce criação, listagem, filtros, exclusão e uma nova
conexão, e remove apenas a fixture ao final. Sem `TEST_DATABASE_URL`, esse teste
é ignorado e nenhuma limpeza é executada. Se a URL for igual a `DATABASE_URL` ou
`DATABASE_URL_DIRECT`, ele falha antes de conectar.

Comparar strings protege contra a configuração local mais perigosa, mas uma URL
Neon não informa de forma confiável o nome amigável da branch. Por isso a
confirmação de que o endpoint pertence à branch `test` continua sendo uma etapa
obrigatória no painel.

Referências oficiais: [projetos e branches no
Neon](https://neon.com/docs/manage/projects) e [conexões pooled e
diretas](https://neon.com/docs/connect/connection-pooling).
