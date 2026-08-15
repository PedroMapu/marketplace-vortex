# Relatório técnico — Marketplace Vortex

## 1. Escopo e conclusão da revisão

Este relatório documenta a arquitetura atual do Marketplace Vortex, as decisões
que sustentam sua implementação e a revisão realizada após a inclusão de imagens
nas coleções recomendadas e a limpeza do código.

A comparação integral do estado final com o `HEAD` anterior confirmou que os
contratos funcionais importantes foram preservados. As alterações executáveis
ficaram restritas a:

- substituir oito emojis das prévias de coleções recomendadas por oito imagens
  PNG correspondentes aos objetos apresentados;
- acrescentar a regra CSS necessária para enquadrar essas imagens;
- remover cinco declarações sem qualquer referência no código-base;
- corrigir dois desalinhamentos visuais em consultas SQL; e
- adicionar comentários explicativos em pontos cuja intenção de segurança,
  concorrência, persistência ou cache não era evidente.

Não foi identificada regressão objetiva que exigisse correção adicional. O
typecheck, o build e os testes automatizados permaneceram aprovados. O único
teste ignorado depende de uma variável de banco de testes que não estava
configurada, conforme detalhado na seção 10.

## 2. Propósito do programa

O Marketplace Vortex é uma aplicação web voltada à economia circular entre
estudantes da Universidade de Fortaleza. Seu objetivo é prolongar a vida útil de
objetos por meio de venda, doação e reutilização dentro da comunidade acadêmica.

O produto reúne em um mesmo fluxo:

1. descoberta pública de itens por catálogo, busca, filtros e ordenação;
2. cadastro institucional restrito ao domínio `@edu.unifor.br`;
3. publicação e administração de anúncios pelo proprietário;
4. criação de ofertas por outros usuários; e
5. negociação entre comprador e anunciante por conversas e mensagens.

A seção de coleções complementa a descoberta ao agrupar itens por contexto de
uso. As coleções recomendadas são conteúdo editorial da página inicial; as
coleções criadas pelo usuário ficam no armazenamento local do navegador e são
associadas à identidade correspondente.

## 3. Arquitetura e motivos das escolhas

### 3.1. Frontend

O frontend é uma SPA construída com HTML e CSS nativos e TypeScript estrito,
empacotada pelo Vite. `src/main.ts` inicializa o aplicativo, PWA, animações,
idiomas do rodapé e visualização de avatar. `src/app.ts` concentra o estado e os
fluxos da interface, enquanto módulos menores isolam rotas, tipos, PWA e
comportamentos visuais.

Essa solução mantém o artefato publicado estático e compatível com a Vercel, sem
introduzir o custo de um framework para uma aplicação de porte contido. O
TypeScript estrito reduz divergências entre os DTOs da API, os dados guardados no
navegador e os elementos do DOM. A separação de `routes.ts`, `types.ts` e do
Service Worker evita que contratos sensíveis fiquem misturados à renderização.

O histórico usa caminhos reais (`/anuncios/:id`, `/conversas/:id`, `/conta`), e
a Vercel reescreve caminhos da SPA para `index.html`. O parser de rotas aceita
somente IDs inteiros positivos. Redirecionamentos após login usam uma lista
fechada de destinos internos, o que evita redirecionamento aberto.

### 3.2. API

A API REST usa Node.js e Express 5. Rotas e códigos HTTP explicitam os limites
entre recursos públicos e autenticados. O envelope de erro com `erro`, `codigo`
e, quando necessário, `campos` oferece um contrato uniforme ao frontend sem
expor stack traces ou detalhes de infraestrutura.

Zod valida corpo, parâmetros e query strings na borda da aplicação. Objetos
estritos rejeitam chaves desconhecidas. No anúncio, um objeto temporariamente
`loose` permite emitir erros específicos para tentativa de forjar autoria antes
de transformar o resultado para o DTO permitido. A autoria nunca é aceita do
cliente: ela é derivada de `request.usuario` após autenticação.

### 3.3. Persistência PostgreSQL

PostgreSQL é a fonte persistente para usuários, anúncios, ofertas e mensagens.
As consultas usam parâmetros posicionais, e as migrations mantêm chaves
estrangeiras, unicidade, faixas de valor, coerência entre venda/doação e índices
de ordenação. Essas restrições repetem no banco invariantes importantes já
validadas na API, protegendo também escritas que não passem pelo frontend.

A aplicação usa `DATABASE_URL` com conexão pooled para tráfego normal. O runner
de migrations usa `DATABASE_URL_DIRECT`, aplica arquivos em ordem, registra
checksum, usa lock consultivo e envolve cada migration em transação. Essa
separação é adequada ao Neon: o pool atende concorrência da API e a conexão
direta torna alterações de esquema mais previsíveis.

Uma oferta e sua primeira mensagem são gravadas na mesma transação. A criação de
mensagens usa `INSERT ... SELECT` condicionado à participação do autor, mantendo
a autorização também no momento da escrita. Leituras de mensagens repetem o
filtro de participante no SQL.

### 3.4. Separação de implantação

O frontend estático é publicado na Vercel e a API no Render, com PostgreSQL no
Neon. `VITE_API_URL` é deliberadamente público e incorporado ao bundle. Segredos
JWT e URLs de banco pertencem somente ao ambiente do servidor. A separação
permite que a camada estática seja distribuída e armazenada em cache sem
transportar credenciais ou lógica de persistência para o navegador.

## 4. Autenticação, sessão e segurança

O cadastro normaliza o e-mail, restringe novas contas ao domínio institucional e
armazena somente o hash bcrypt com custo 12. A senha é limitada entre 8 e 72
bytes, de acordo com o limite efetivo do bcrypt. O login usa um hash fictício
quando a conta não existe para reduzir diferenças de tempo que poderiam facilitar
enumeração de usuários, e devolve a mesma mensagem para credenciais inválidas.

Os tokens são JWT `HS256`, assinados por um segredo de no mínimo 32 bytes, com
algoritmo, emissor e audiência fixados na emissão e na validação. O payload usa
somente `sub` com o UUID do usuário; nome, e-mail, foto e senha não são copiados
para o token. A validade é de 24 horas ou 30 dias quando a opção “manter
conectado” é escolhida.

O middleware Bearer valida o formato, a assinatura, o escopo e o UUID. Depois,
consulta novamente o usuário no banco. Assim, um token de uma conta removida não
mantém acesso. Rotas de anúncio derivam a autoria desse usuário e repetem no SQL
o filtro de proprietário nas mutações. Rotas de oferta/chat exigem que o usuário
seja comprador ou anunciante.

No navegador, a sessão de 24 horas usa `sessionStorage`; a persistente pode usar
`localStorage`. A foto em data URL não é duplicada na sessão, evitando exceder a
quota. Um `401` remove a sessão correspondente. O logout atual é local: como os
JWTs são stateless e não há registro de sessões, refresh token ou lista de
revogação, o servidor não consegue revogar imediatamente um token copiado antes
do vencimento.

Para distinguir as semânticas atuais:

- **cadastrado:** há uma linha do usuário no PostgreSQL;
- **autenticado:** a requisição apresentou JWT válido e o usuário ainda existe;
- **sessão aceita:** o JWT está íntegro, no escopo correto e dentro do prazo;
- **recentemente ativo/online:** não é mensurável pela arquitetura atual, pois
  não há heartbeat, presença, `last_activity` ou registro de sessão no servidor.

Isso é suficiente para o escopo atual, mas recursos futuros de “encerrar em todos
os dispositivos”, revogação imediata, inventário de dispositivos ou presença
online exigiriam estado de sessão no servidor e um ciclo próprio de renovação e
revogação. Também não há atualmente recuperação de senha, MFA ou rate limiting
aplicativo para tentativas de login.

O CORS usa correspondência exata de origens em produção, permite apenas origens
loopback em desenvolvimento e valida métodos e cabeçalhos de preflight contra
listas fechadas. Requisições sem `Origin` continuam disponíveis para clientes
servidor-servidor e healthchecks; isso é esperado porque CORS é uma proteção do
navegador, não um mecanismo de autenticação.

## 5. Dados, anúncios, ofertas e chat

Anúncios carregam domínio, modalidade, valor, descrição, imagem, autoria,
contagem de detalhes e estado de conclusão. O catálogo público omite concluídos;
“Meus anúncios” pode mostrá-los ao proprietário. Edição, conclusão e exclusão
dependem do Bearer e repetem o ID do proprietário nas consultas de mutação, o que
reduz o risco de uma verificação isolada ficar obsoleta.

Uma oferta só pode ser criada por usuário diferente do proprietário e apenas
para anúncio ativo. Banco e API verificam novamente essas condições. A primeira
mensagem e a oferta são atômicas. Consultas de conversas retornam apenas ofertas
em que o usuário autenticado é participante, e tanto leitura quanto escrita de
mensagens preservam essa fronteira.

No frontend, o polling é feito por `setTimeout` recursivo para não sobrepor
requisições e pode parar quando a aba perde visibilidade ou a sessão termina. O
estado de mensagens vistas é local e separado por usuário. Ele serve à interface
de notificações; não equivale a recibo de leitura persistido no servidor.

## 6. PWA, cache e funcionamento offline

O Vite usa `vite-plugin-pwa` em modo `injectManifest`. O Service Worker cria uma
versão do cache estático a partir do hash do manifesto e remove apenas caches
estáticos antigos com o prefixo do aplicativo.

As estratégias são deliberadamente diferentes:

- navegação: rede primeiro, com fallback para página/cache do shell;
- catálogo público `GET /api/anuncios`: rede primeiro, preservando URL e query
  como chaves distintas;
- ativos estáticos da mesma origem: stale-while-revalidate;
- autenticação, Bearer, rotas privadas, mutações e requests parciais: não são
  interceptados.

Somente respostas públicas válidas e JSON do catálogo substituem seu snapshot.
Ao responder offline, o worker inclui `X-Vortex-Offline: 1`; a ausência de uma
consulta específica gera `503 OFFLINE_SEM_CACHE`. Após mutação de anúncio, o
frontend invalida todas as variantes do catálogo. O Service Worker é servido com
`Cache-Control: no-cache` para que o navegador revalide novas versões.

As imagens das coleções não aumentaram o precache inicial: o build registrou
seis entradas e 425,74 KiB no app shell. Por serem imagens estáticas com
`loading="lazy"`, elas são buscadas conforme o uso e passam ao cache de ativos
depois de solicitadas.

## 7. Responsividade e acessibilidade

O CSS possui consolidação específica para mobile e tablet. Layouts flex/grid
permitem encolhimento com `min-width: 0`; imagens e vídeos respeitam a largura;
conteúdo longo pode quebrar; controles principais mantêm alvos de toque; modais
consideram `100dvh` e áreas seguras; abas e filtros reorganizam-se em breakpoints
em vez de ampliar a viewport. Há ainda regras para paisagem, dispositivos touch
e preferência por movimento reduzido.

Nas coleções recomendadas, as imagens possuem dimensões intrínsecas declaradas,
carregamento lazy e decodificação assíncrona, reduzindo deslocamento de layout e
custo inicial. O CSS usa `object-fit: cover` dentro da miniatura já existente.
O `alt` vazio é intencional porque as miniaturas são decorativas e o card já
fornece título e descrição; isso evita repetição desnecessária por leitores de
tela.

## 8. Alterações desta solicitação

### 8.1. Imagens de coleções recomendadas

Foram adicionados oito PNGs em `public/images/collections/`, um para cada objeto
visível nas quatro coleções:

| Coleção | Imagens |
|---|---|
| Kit Sobrevivência Universitário | régua/esquadro e lápis |
| Desapego da Ana | material de arte e camiseta |
| Tech que não uso mais | cabo USB-C e mouse sem fio |
| Organização de Armário | cadeado e garrafa reutilizável |

Todos os arquivos foram verificados pela assinatura PNG e têm 1254 × 1254 px.
O HTML passou a referenciá-los diretamente, e a única regra CSS nova controla o
preenchimento das miniaturas.

### 8.2. Limpeza e comentários

Foram removidos de `src/app.ts`:

- `chatPainel`;
- `salvarUsuario`;
- `removerUsuarioSalvo`;
- `selecionarOferta`;
- `rotaProtegidaPorCaminho`; e
- o import de tipo `RotaProtegida`, que ficou órfão.

No arquivo anterior, cada um dos cinco símbolos executáveis tinha exatamente uma
ocorrência: sua própria declaração. Não havia chamada, listener, exportação nem
referência dinâmica. O typecheck com `noUnusedLocals` e `noUnusedParameters`
também permaneceu aprovado após a remoção.

Comentários em português foram adicionados apenas em pontos não triviais:
mitigação de enumeração no login, escopo de JWT, revalidação do usuário, CORS,
entrega binária de foto, autorização e atomicidade de chat, concorrência de
requisições, persistência de sessão, polling, redirecionamento, cache PWA e
validação de senha/imagem/autoria. Comentários não são executados; a revisão do
diff confirmou que eles não alteraram expressões, parâmetros, ordem de chamada,
SQL ou respostas HTTP.

Os dois ajustes em `database.js` apenas alinharam `a.concluido_em` nas consultas
SQL. Não houve alteração no texto lógico das consultas.

## 9. Evidências de preservação das funções importantes

| Área | Evidência da revisão |
|---|---|
| Autenticação/JWT | algoritmo, issuer, audience, `sub`, prazos, segredo mínimo, hash bcrypt e consulta do usuário preservados; testes de auth e middleware aprovados |
| CORS | allowlist exata, loopback de desenvolvimento, preflight e healthcheck sem `Origin` preservados; testes CORS aprovados |
| PostgreSQL/SQL | migrations, consultas parametrizadas, filtros de proprietário/participante, transações e mapeadores preservados; testes de contrato/migrations aprovados |
| Anúncios | autoria derivada do Bearer, CRUD, conclusão, filtros e clique de detalhes preservados; testes de API e ownership aprovados |
| Ofertas/chat | proibição de oferta própria, participantes, primeira mensagem atômica e autorização de mensagens preservados; testes de ofertas/chat aprovados |
| Rotas | caminhos públicos/protegidos/dinâmicos, 404 e redirect interno preservados; testes de rotas aprovados |
| PWA/cache | exclusão de dados autenticados do cache, network-first do catálogo, invalidação e fallback offline preservados; testes PWA/Service Worker aprovados |
| Validação | schemas estritos, limites, magic bytes, domínio institucional e autoria protegida preservados; testes Zod aprovados |
| Responsividade | regras mobile/tablet, safe areas, alvos de toque e reduced motion preservados; testes responsivos e de motion aprovados |
| Coleções | estrutura e contagens dos cards preservadas; somente as miniaturas foram trocadas por imagens correspondentes |

## 10. Validações executadas

Ambiente: Node.js 24.18.0, TypeScript 7.0.2, Vite 8.1.5 e
`vite-plugin-pwa` 1.3.0 instalados no projeto.

| Comando | Resultado |
|---|---|
| `npm run typecheck` | aprovado, sem diagnóstico |
| `tsc --noEmit --noUnusedLocals --noUnusedParameters` | aprovado, sem diagnóstico |
| `npm run build` | aprovado; bundle principal 119,20 kB (35,01 kB gzip), Service Worker 3,15 kB (1,45 kB gzip) |
| `npm test` | 129 testes: 128 aprovados, 0 falhas e 1 ignorado |
| `git diff --check` | aprovado; sem erro de whitespace |
| verificação de PNG por assinatura/cabeçalho | 8 de 8 válidos, todos 1254 × 1254 px |

O teste ignorado foi `CRUD real usa PostgreSQL de teste e persiste entre
conexões`, porque `TEST_DATABASE_URL` não estava configurada. Portanto, nesta
execução não se afirma que a integração com uma instância PostgreSQL real foi
revalidada. Os testes de segurança do banco confirmaram que a suíte se recusa a
usar a mesma base configurada para desenvolvimento/produção.

## 11. Riscos, limitações e recomendações

1. **Peso das imagens:** os oito PNGs somam 15.547.963 bytes (14,83 MiB), com
   arquivos individuais entre aproximadamente 1,54 e 2,22 MiB. `loading="lazy"`
   evita baixar tudo antes do uso e eles não entraram no precache, mas formatos
   responsivos/AVIF/WebP ou PNGs otimizados reduziriam tráfego e armazenamento de
   cache sem mudar a interface.
2. **Integração não executada:** falta `TEST_DATABASE_URL` isolada. Antes de uma
   entrega crítica, deve-se repetir `npm test` com uma branch PostgreSQL exclusiva
   e confirmar 129 aprovações.
3. **JWT stateless:** logout remove o token do navegador, mas não o revoga no
   servidor. Tokens persistentes copiados podem valer por até 30 dias. Caso o
   produto exija controle por dispositivo ou revogação imediata, deve ser
   introduzido um registro de sessões/refresh tokens com rotação e revogação.
4. **Proteção do token no navegador:** `localStorage`/`sessionStorage` tornam o
   Bearer acessível a JavaScript; uma vulnerabilidade XSS poderia expô-lo. Uma
   política CSP forte, revisão contínua de injeção no DOM e, em uma futura
   arquitetura, cookies `HttpOnly` com proteção CSRF merecem avaliação.
5. **Proteção de login:** não há rate limiting, MFA nem recuperação de senha na
   arquitetura atual.
6. **Segredo versionado preexistente:** `render.yaml`, que não foi alterado nesta
   solicitação, contém URLs de conexão PostgreSQL em texto claro, apesar de o
   README orientar manter credenciais apenas nos painéis. As credenciais devem ser
   rotacionadas no provedor, removidas do histórico Git e substituídas no
   manifesto por variáveis secretas (`sync: false` ou mecanismo equivalente).
7. **Estado de leitura local:** notificações vistas não são sincronizadas entre
   dispositivos; isso é uma escolha simples para a interface atual, não um recibo
   de leitura confiável.
8. **Presença:** o sistema não mede “online” ou “recentemente ativo”; qualquer
   recurso futuro com esse significado precisa de um subsistema explícito e de
   regras de retenção/privacidade.

## 12. Resultado final

O programa preservou sua arquitetura, seus limites de autorização, a
persistência relacional, os fluxos de anúncios/ofertas/chat, as rotas, o cache
seletivo da PWA e o comportamento responsivo. A seção de coleções recomendadas
agora apresenta imagens coerentes com os objetos anunciados. A limpeza removeu
somente código comprovadamente morto, e os comentários adicionados documentam
decisões sem alterar a execução.

Não foram feitas mudanças em `.codex/` nem em `PRODUCT.md` durante esta revisão.
