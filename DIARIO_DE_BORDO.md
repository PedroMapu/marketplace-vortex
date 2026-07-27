# Diário de Bordo

- Estrutura inicial criada.

# Diário de Bordo

- Estrutura inicial criada.

=======
## Dia 1 — 23/07/2026

### Objetivo do dia

Aprender terminal e Git e preparar a estrutura inicial do projeto.

### O que eu fiz

Criei a pasta do projeto, organizei os arquivos iniciais, iniciei o Git e criei o repositório público no GitHub.

### Principais prompts usados

**Prompt 1 — Planejamento do primeiro dia**

> Atue como mentor de desenvolvimento para uma pessoa que está começando a usar terminal, Git e GitHub. Analise o planejamento de aprendizagem do Marketplace Vortex e transforme as atividades do primeiro dia em uma sequência prática e segura. Para cada etapa, explique o conceito, mostre o comando necessário, diga o resultado esperado e como confirmar que funcionou. A entrega deve incluir a estrutura inicial de pastas e arquivos, a inicialização do Git, a criação do repositório público e um checklist final. Não avance para implementação de funcionalidades do site.

### Resposta da IA

A IA explicou a diferença entre arquivos locais, Git e GitHub e apresentou a sequência para preparar o repositório.

### O que funcionou

Preencher depois da execução.

### Erros encontrados

Nenhum

### Como investiguei

Preencher depois da execução.

### O que aprendi

Escrever com minhas próprias palavras.

### Código que consigo explicar

Hoje não houve implementação de código. A estrutura do projeto tem .agents, para caso o meu Codex necessite utilizar agentes para tarefas específicas

public é para o que vai aparecer no navegador

server.js é onde fica a entrada do servidor

database.js é onde fica a parte de dados

data/ é onde os arquivos persistentes, que continuaram mesmo após o fechamento do navegador

README.md é onde eu vou documentar o projeto

DIARIO_DE_BORDO.md registra evolução e decisões

.gitignore evita subir arquivos desnecessários

### Commit

## Dia 2 — 23/07/2026

### Objetivo do dia

Construir a interface inicial do Marketplace Vortex e deixar a página responsiva.

### O que eu fiz

Estruturei a página em HTML com cabeçalho, navegação, seção inicial, vitrine de anúncios, filtros, coleções, colaboradores, formulário de anúncio, meus anúncios e rodapé. Depois, estilizei tudo em CSS e revisei os pontos de overflow e responsividade para desktop e celular.

Também corrigi o foco azul do campo de busca rápida e o estado visual de “Todas as Categorias”, para que ele só fique azul quando o cursor passar por cima.

### Principais prompts usados

**Prompt 1 — Construção da interface inicial**

> Atue como desenvolvedor frontend e crie a interface inicial do Marketplace Vortex com HTML semântico e CSS responsivo. A página deve conter cabeçalho, navegação, apresentação do projeto, vitrine de anúncios, filtros, formulário, seção de anúncios do usuário e rodapé. Preserve uma identidade visual coerente com economia circular e comunidade universitária. Não use frameworks. Garanta navegação por teclado, foco visível, hierarquia correta de títulos e adaptação para desktop e celular.

**Prompt 2 — Auditoria de responsividade**

> Revise o HTML e o CSS existentes como especialista em responsividade. Localize as causas de overflow horizontal, grids que não encolhem e elementos que ultrapassam a viewport. Corrija os problemas preservando o design atual e teste mentalmente os breakpoints principais. Verifique também os estados `hover`, `focus` e `focus-visible`, especialmente no campo de busca e no item “Todas as Categorias”. Se a revisão se beneficiar de validação independente, delegue uma auditoria a agentes e consolide as conclusões. Entregue um resumo das causas, correções e critérios de verificação.

### Resposta da IA

A IA analisou a estrutura da página, ajustou os grids e espaçamentos para telas menores e corrigiu estilos que poderiam causar estouro horizontal. Também ajudou a aplicar correções específicas nos elementos de busca e filtros.

### O que funcionou

A página ficou organizada em seções semânticas, com navegação por âncoras, cards responsivos e adaptações para telas menores.

### Erros encontrados

Alguns elementos podiam ultrapassar a largura da tela em resoluções menores. O campo de busca apresentava uma outline azul ao receber foco e o item “Todas as Categorias” parecia estar em hover mesmo sem o cursor.

### Como investiguei

Revisei os seletores CSS, os valores de largura, os grids e os breakpoints. Também comparei o estado visual dos links de categoria com os demais itens da lista.

### O que aprendi

Aprendi a usar Grid e Flexbox de forma mais segura com `minmax(0, 1fr)`, a criar breakpoints para diferentes tamanhos de tela e a entender como `:hover`, `:focus` e `:focus-visible` afetam os elementos.

### Código que consigo explicar

Consigo explicar que as tags `section`, `header`, `main`, `aside` e `footer` organizam semanticamente a página. No CSS, consigo explicar como as variáveis guardam cores e medidas reutilizáveis, como os media queries adaptam o layout e como os estados `:hover` e `:focus` alteram a aparência dos componentes.

### Commit

`b389daf` — Estrutura HTML feita  
`89bef5d` — Estilização CSS feita(1)  
`96fa250` — front(2)

## Dia 3 — 23/07/2026

### Objetivo do dia

Testar animações de scroll, criar uma animação visual de doação no destaque principal e experimentar uma versão escura para o site.

### O que eu fiz

Criei uma branch de teste para as animações de scroll e implementei uma entrada suave dos conteúdos conforme a pessoa rola a página. Também substituí o ícone de reciclagem do destaque principal por uma ilustração em SVG de duas pessoas: uma entrega uma caixa para a outra e, depois da doação, aparece um coração acima das duas.

Depois, salvei essas animações em um commit e criei outra branch para testar um tema mais escuro, com menos gradientes e mais contraste entre fundo, superfícies e cartões.

### Principais prompts usados

**Prompt 1 — Animações de entrada e doação**

> Use a skill de frontend e atue como especialista em motion design para adicionar animações rápidas e suaves ao Marketplace Vortex. Os conteúdos devem entrar conforme a rolagem sem atrasar a leitura, e o destaque principal deve representar uma doação por meio de uma ilustração SVG de duas pessoas, uma caixa sendo entregue e um coração surgindo ao final. Priorize CSS e SVG, preserve os efeitos de hover existentes, evite impacto perceptível no desempenho e implemente uma alternativa com `prefers-reduced-motion`. Trabalhe em uma branch de teste e valide sintaxe, acessibilidade e ausência de conflitos visuais.

**Prompt 2 — Experimento de tema escuro**

> Crie uma branch separada para experimentar uma versão escura da interface. Reduza o uso de gradientes, aumente o contraste entre fundo, superfícies, textos e cartões e preserve a identidade azul e verde do projeto. Não altere a estrutura ou as funcionalidades. Ao final, descreva as decisões visuais e mantenha o experimento isolado para que possa ser comparado ou descartado sem afetar a versão principal.

### Resposta da IA

A IA sugeriu uma animação baseada em CSS para o scroll, com suporte a pessoas que preferem reduzir movimentos. Para o destaque principal, criou um SVG animado com CSS, usando transformações e opacidade para representar a entrega e o surgimento do coração.

### O que funcionou

As animações foram implementadas sem JavaScript: o scroll usa CSS e o destaque usa SVG com `@keyframes`. A página também ganhou uma alternativa de movimento reduzido para acessibilidade.

### Erros encontrados

O ambiente não tinha um navegador integrado disponível para a inspeção visual automatizada. Também foi necessário tomar cuidado para que as animações não interferissem nos efeitos de hover dos cards.

### Como investiguei

Verifiquei o HTML e o CSS, validei a estrutura do SVG, conferi o balanço de chaves no CSS e usei `git diff --check` para revisar as alterações antes de salvar.

### O que aprendi

Aprendi que branches permitem testar mudanças sem alterar a versão principal do projeto. Também aprendi a usar `@keyframes`, `transform`, `opacity`, `prefers-reduced-motion` e `animation-timeline: view()` para criar animações mais leves e acessíveis.

### Código que consigo explicar

Consigo explicar que o SVG desenha as duas pessoas, a caixa e o coração dentro do `aside`. As classes CSS animam cada parte em momentos diferentes. Consigo explicar também que `@media (prefers-reduced-motion: reduce)` desativa movimentos para respeitar a preferência de acessibilidade da pessoa usuária.

### Commit

`6894fef` — front(3)

## Dia 4 antecipado — 25/07/2026

### Objetivo do dia

Começar a parte de JavaScript, DOM e renderização prevista para o Dia 4 do plano de aprendizagem, substituindo os anúncios escritos diretamente no HTML por dados organizados em um array.

### O que eu fiz

Criei um array temporário com quatro anúncios simulados. Cada anúncio passou a ser representado por um objeto com propriedades como ID, nome, categoria, condição, modalidade, valor, localização, descrição e autor.

Usei `querySelector` para localizar a vitrine e a seção “Meus anúncios”. Depois, criei funções responsáveis por percorrer o array com `forEach`, montar os elementos dos cartões e inseri-los no DOM.

Os cartões fixos foram removidos do `index.html`, deixando contêineres vazios que são preenchidos pelo JavaScript. A contagem de resultados também passou a ser atualizada de acordo com a quantidade de objetos no array.

Essa estrutura foi criada durante a preparação das funcionalidades do Dia 5, porque criar e excluir anúncios só seria possível depois que a vitrine tivesse uma fonte de dados única.

### Principais prompts usados

**Prompt 1 — Fonte de dados e renderização dinâmica**

> Atue como arquiteto frontend e prepare o Marketplace Vortex para as operações locais do próximo dia. Substitua os cartões de anúncio escritos diretamente no HTML por um array temporário de objetos com estrutura consistente. Crie funções separadas para transformar cada objeto em elementos do DOM e renderizar novamente a vitrine sem duplicações. Use `document.createElement`, `textContent`, `append` e `replaceChildren`; não insira dados do usuário com `innerHTML`. Atualize a contagem de resultados e preserve o HTML como estrutura semântica vazia. Considere concluído quando todos os anúncios simulados forem exibidos exclusivamente a partir do array e uma segunda renderização não criar cópias.

Esse prompt foi reconstruído de forma concisa a partir da etapa de preparação que surgiu durante a implementação do Dia 5.

### Resposta da IA

A IA identificou que os anúncios estavam duplicados entre o HTML e o comportamento esperado no JavaScript. Por isso, sugeriu transformar os exemplos em objetos e criar funções de renderização, garantindo que a vitrine sempre representasse o conteúdo atual do array.

Para reduzir o risco de inserir conteúdo inseguro na página, os elementos foram criados com `document.createElement` e os textos preenchidos com `textContent`, sem interpolar os dados do formulário em `innerHTML`.

### O que funcionou

Ao abrir a página, os quatro anúncios simulados são lidos do array e exibidos na vitrine. Os cartões mostram categoria, condição, localização, preço e autor, e a contagem informa corretamente quantos resultados estão disponíveis.

A renderização também pode ser executada novamente sem manter cópias antigas dos cartões, porque o contêiner é limpo antes de receber os elementos atuais.

### Erros encontrados

Os cartões estavam inicialmente escritos diretamente no HTML. Isso faria a tela e o array representarem fontes de dados diferentes e poderia gerar anúncios duplicados depois de uma nova renderização.

O plano do Dia 4 também prevê eventos de filtro por categoria. A interface visual dos filtros já existe, mas esse comportamento ainda não foi implementado e deverá ser concluído em uma próxima atividade.

### Como investiguei

Revisei os cartões existentes no `index.html`, comparei os campos repetidos e defini quais propriedades cada objeto deveria possuir. Depois, conferi se a quantidade de cartões gerados correspondia ao tamanho do array e se os contêineres do HTML permaneciam vazios antes da execução do JavaScript.

Também verifiquei que o script é carregado com `defer`, permitindo que os elementos da página existam antes da execução dos `querySelector`.

### O que aprendi

Aprendi que um array pode guardar vários objetos com a mesma estrutura e que `forEach` permite percorrer esses objetos para gerar a interface. `querySelector` localiza elementos já existentes, enquanto `createElement`, `append` e `replaceChildren` permitem construir e atualizar o DOM.

Também aprendi que manter uma única fonte de dados reduz duplicação: o array representa o estado dos anúncios e as funções de renderização transformam esse estado em elementos visuais.

### Código que consigo explicar

Consigo explicar que `anuncios` é o array temporário, `criarCardDaVitrine` transforma um objeto em um cartão e `renderizarAnuncios` percorre o array, cria cada cartão e atualiza a contagem de resultados.

Consigo explicar também que os atributos `data-*` guardam informações úteis no elemento e que `textContent` insere o texto do anúncio sem interpretar esse conteúdo como HTML.

### Testes realizados

- Array iniciado com quatro objetos de anúncio.
- Quatro cartões gerados na vitrine.
- Contagem de resultados atualizada pelo tamanho do array.
- Preços de venda formatados em reais.
- Doação exibida sem preço de venda.
- Segunda renderização sem duplicar os cartões anteriores.
- Sintaxe do JavaScript validada.

### Commit

A base do Dia 4 foi integrada ao commit funcional seguinte, junto com as operações locais do Dia 5.

## Dia 5 antecipado — 25/07/2026

### Objetivo do dia

Implementar as operações locais previstas para o Dia 5 do plano de aprendizagem: identificar o usuário, criar anúncios sem recarregar a página, relacionar cada anúncio ao seu autor, mostrar os anúncios próprios e permitir a exclusão somente pelo dono.

Também reuni neste salvamento os refinamentos visuais e de animação que ainda estavam pendentes no repositório.

### O que eu fiz

Transformei os cartões fixos da vitrine em anúncios gerados pelo JavaScript a partir de um array. Criei o envio do formulário com `submit` e `preventDefault`, leitura dos dados com `FormData`, criação de um objeto para o novo anúncio e inclusão com `push`.

O site agora pergunta o nome da pessoa no primeiro acesso, cria um identificador e salva esses dados no `localStorage`. Cada anúncio novo recebe o identificador e o nome do usuário atual. A seção “Meus anúncios” usa `filter` para mostrar somente os itens dessa pessoa.

Implementei a exclusão por ID com confirmação. O botão aparece somente nos anúncios próprios e a função de exclusão verifica novamente a autoria antes de remover o item do array. Assim, esconder o botão não é a única proteção.

Também foram integrados o estado vazio das listas, mensagens acessíveis de sucesso e erro, contagem atualizada da vitrine, imagem temporária do item, formatação de moeda, modalidade de doação com valor zero, animações de entrada, contadores, cabeçalho durante o scroll e ajustes visuais no formulário e no ciclo de economia circular.

### Principais prompts usados

**Prompt 1 — Planejamento das operações locais**

> Atue como desenvolvedor JavaScript e produza primeiro um plano de implementação para o Dia 5 do Marketplace Vortex. O escopo inclui: enviar o formulário sem recarregar a página, criar o anúncio no array, solicitar e persistir o usuário no `localStorage`, associar cada anúncio a um `usuarioId`, mostrar somente os anúncios próprios e permitir a exclusão apenas pelo proprietário. Divida o trabalho em etapas dependentes, defina funções, estados, riscos e critérios de aceitação antes de modificar os arquivos.

**Prompt 2 — Implementação com revisão por agentes**

> Execute o plano do Dia 5 usando agentes temporários para tarefas independentes e uma revisão final integrada. Implemente o fluxo com `submit`, `preventDefault`, `FormData`, `push`, `filter` e renderização pelo DOM. Não use o nome como identificador exclusivo e não confie apenas em esconder o botão de exclusão: valide novamente o `usuarioId` na função. Use `textContent` para dados fornecidos pelo usuário, mantenha mensagens acessíveis de sucesso e erro e preserve as funcionalidades existentes. Verifique criação, autoria, persistência do usuário, anúncios próprios, bloqueio de exclusão alheia e ausência de duplicação na renderização.

### Resposta da IA

A IA consultou o plano de aprendizagem para confirmar o escopo exato do Dia 5 e dividiu a revisão entre agentes temporários. Um agente preparou o HTML para renderização dinâmica, outro fez uma revisão independente dos riscos e testes, e a integração final foi feita no JavaScript.

Foram criadas funções separadas para recuperar o usuário, renderizar as listas, criar anúncios e excluir anúncios. A solução também evita inserir dados do formulário diretamente com `innerHTML`, usando criação de elementos e `textContent`.

### O que funcionou

O nome do usuário permanece salvo depois de atualizar a página. Um anúncio válido é criado sem recarregamento, aparece na vitrine e em “Meus anúncios” e fica associado ao usuário atual. A exclusão remove o anúncio das duas listas, enquanto uma tentativa de apagar um anúncio alheio é recusada.

O JavaScript passou na verificação de sintaxe e o fluxo principal passou por 14 verificações automatizadas com DOM, formulário e `localStorage` simulados.

### Erros encontrados

O navegador integrado não estava disponível para o teste visual automatizado. Por isso, além das verificações estáticas, foi criado um teste isolado do fluxo do JavaScript.

Um dos agentes temporários de lógica não conseguiu salvar uma implementação utilizável. A integração foi assumida pelo agente principal com base no planejamento e na revisão independente.

Durante o primeiro teste simulado, faltava o método `reset` no formulário falso usado pelo teste. O problema estava no ambiente de teste, não no código da página. Depois de completar a simulação, todas as verificações passaram.

### Como investiguei

Comparei o código com as entregas descritas no documento do plano, revisei os IDs e campos do formulário, verifiquei o array antes e depois de criar e excluir itens e testei separadamente anúncios próprios e anúncios de outros usuários.

Também usei `node --check`, `git diff --check` e uma execução isolada do `app.js` para conferir `preventDefault`, `push`, `filter`, associação pelo `usuarioId`, persistência do usuário e bloqueio da exclusão indevida.

### O que aprendi

Aprendi que `preventDefault` impede o comportamento padrão de envio do formulário, permitindo atualizar a página pelo DOM. `FormData` lê os campos pelo atributo `name`, `push` adiciona um objeto ao array e `filter` pode criar uma nova lista sem o item excluído.

Também aprendi que o nome não deve ser usado sozinho para verificar autoria, porque duas pessoas podem ter o mesmo nome. Por isso, cada usuário recebe um identificador. O `localStorage` mantém dados simples no navegador, mas não substitui autenticação ou validação no servidor.

### Código que consigo explicar

Consigo explicar que `anuncios` guarda os objetos exibidos na tela, `renderizarAnuncios` monta a vitrine e `renderizarMeusAnuncios` compara `anuncio.usuarioId` com `usuarioAtual.id`.

Consigo explicar também que `criarAnuncio` lê o formulário, cria o objeto e usa `anuncios.push`, enquanto `excluirAnuncio` procura o ID, verifica o proprietário e usa `anuncios.filter` para remover somente o item autorizado.

### Testes realizados

- Nome solicitado no primeiro acesso e recuperado do `localStorage`.
- Formulário enviado com `preventDefault`.
- Anúncio incluído no array e associado ao usuário.
- Anúncio próprio exibido em “Meus anúncios”.
- Anúncio alheio mantido na vitrine e protegido contra exclusão.
- Exclusão própria refletida nas duas listas.
- Sintaxe do JavaScript e formatação do diff verificadas.

### Commit

`feat: implementar operações locais do Dia 5`

## Dia 6 — 26/07/2026

### Objetivo do dia

Iniciar a estrutura de backend do Marketplace Vortex com Node.js e Express. O objetivo foi transformar a página estática em uma aplicação servida por um servidor local, criar a primeira rota JSON e padronizar a inicialização com `npm start`.

Também reuni neste commit refinamentos do fluxo de publicação e da vitrine: aceitar somente imagens PNG, ampliar a imagem de um anúncio, apresentar contadores dinâmicos nos filtros e tornar funcionais a busca, a ordenação, as abas do catálogo e a alternância entre grade e lista.

### O que eu fiz

Inicializei o projeto com `npm init -y`, instalei o Express e gerei o `package-lock.json`. Criei o arquivo `server.js`, configurei o middleware `express.json()`, disponibilizei a rota `GET /api/status` e usei `express.static` para servir os arquivos existentes da pasta `public`.

Atualizei o `package.json` para apontar o arquivo principal para `server.js` e adicionei o script `"start": "node server.js"`. O servidor usa a variável de ambiente `PORT` quando ela estiver disponível e adota a porta 3000 como padrão.

No formulário de anúncio, restringi o seletor e a validação do JavaScript ao formato PNG. Também implementei uma visualização ampliada para as imagens publicadas, com abertura pelo mouse ou teclado e fechamento pelo botão, pela tecla Esc ou pelo clique fora do conteúdo.

Substituí os números demonstrativos dos filtros por contagens calculadas a partir do array `anuncios`. Categorias, condições e modalidades agora mostram quantos anúncios existem em cada opção, e esses valores são recalculados após a criação ou exclusão de um item.

Conectei a barra de busca aos dados dos anúncios. A pesquisa considera nome, descrição, categoria, condição, modalidade, localização e autor. Implementei também ordenação por itens recentes, menor preço, maior preço e nome em ordem alfabética.

As abas do catálogo passaram a filtrar todos os anúncios, os três itens mais recentes, os itens à venda e as doações. Como o modelo de anúncio ainda não possui associação com coleções, substituí a aba “Coleções” por “À venda”. Os botões de layout agora alternam entre grade e lista, com adaptação para telas menores.

### Principais prompts usados

**Prompt 1 — Inicialização do backend Express**

> Atue como desenvolvedor backend e transforme o Marketplace Vortex em uma aplicação Node.js servida por Express. Antes de executar, apresente um relatório curto com arquitetura, arquivos afetados, etapas e critérios de conclusão. Depois, inicialize o npm, instale o Express, crie `server.js`, configure JSON e arquivos estáticos da pasta `public`, implemente `GET /api/status` com resposta JSON e adicione o script `npm start`. Preserve o frontend existente. Valide dependências, sintaxe, inicialização do servidor, HTTP 200 na página e conteúdo da rota de status.

**Prompt 2 — Imagens e visualização acessível**

> Revise o fluxo de imagens do formulário. Restrinja a seleção e a validação ao formato solicitado e crie uma visualização ampliada da imagem do anúncio. Prefira recursos nativos do navegador, mantenha rótulos acessíveis, suporte mouse e teclado, permita fechar pelo botão, pela tecla Esc e pelo clique fora e devolva o foco ao elemento que abriu a imagem. Não disponibilize ampliação quando o anúncio não tiver uma imagem válida.

**Prompt 3 — Contadores e controles funcionais da vitrine**

> Torne funcionais os controles existentes da vitrine sem alterar a fonte original dos anúncios. Calcule dinamicamente os contadores de categoria, condição e modalidade. Conecte a busca aos campos relevantes do anúncio, implemente ordenação por recente, preço e nome, filtre as abas do catálogo e permita alternar entre grade e lista. Os controles devem poder ser combinados, atualizar a quantidade de resultados e comunicar o estado ativo com atributos acessíveis. Centralize a lógica em funções reutilizáveis e verifique os principais cenários com dados simulados.

### Resposta da IA

A IA organizou a implementação em etapas dependentes: preparar o projeto Node.js, instalar a dependência, criar o servidor, registrar a rota da API, servir o frontend e testar o resultado.

Foi escolhida a rota `GET /api/status` como primeira resposta JSON por ser simples e adequada para verificar se o backend está ativo. A resposta contém a mensagem “API do Marketplace Vortex funcionando.”.

Para ampliar as imagens, foi utilizado o elemento nativo `dialog`, que já oferece comportamento de modal e suporte à tecla Esc. A interação recebeu rótulos acessíveis, foco visível e devolução do foco ao botão que abriu a imagem.

Para evitar números divergentes, a IA centralizou os cálculos em `atualizarContadoresDosFiltros`. A renderização passou a obter somente os anúncios visíveis de acordo com o termo pesquisado, a aba ativa e a ordenação escolhida.

Os controles receberam atributos `data-*` para relacionar os elementos do HTML aos valores dos objetos. Os estados ativos são comunicados visualmente e pelo atributo `aria-pressed`.

### O que funcionou

O comando `npm start` iniciou o Express e exibiu o endereço `http://localhost:3000`. A página inicial foi entregue pelo servidor com status HTTP 200 e a rota `/api/status` retornou o JSON esperado.

O Express foi instalado na versão 5.2.1 e a auditoria do npm não encontrou vulnerabilidades. Os arquivos anteriores do frontend permaneceram dentro da pasta `public` e continuaram sendo servidos pelos mesmos caminhos relativos.

A seleção de arquivo agora informa o formato aceito, e a validação bloqueia arquivos que não tenham o tipo MIME `image/png` e a extensão `.png`. Quando um anúncio possui uma imagem, sua miniatura se transforma em um botão que abre a visualização ampliada.

Os quatro anúncios simulados geram corretamente as contagens: um novo, dois seminovos, um usado, três vendas e uma doação. As categorias também começam com um anúncio em cada categoria existente e zero em “Outros”.

A busca atualiza a vitrine durante a digitação, as ordenações mudam a sequência dos cartões e as abas podem ser combinadas com o texto pesquisado. A quantidade de resultados informa tanto o número visível quanto o total quando existe um filtro ativo.

### Erros encontrados

No início, os comandos `node` e `npm` não foram reconhecidos pela sessão atual do terminal. A investigação mostrou que o Node.js LTS 24.18.0 já estava instalado pelo Windows Package Manager e registrado no `PATH` do usuário, mas a sessão em execução ainda conservava o valor antigo. Para concluir a atividade, utilizei diretamente os executáveis da instalação encontrada.

O navegador integrado não estava disponível para a inspeção visual automatizada do modal e dos novos controles da vitrine. Por isso, a implementação foi revisada estaticamente, e o teste do servidor foi realizado com requisições HTTP locais.

Os anúncios simulados não possuem arquivos de imagem e continuam mostrando apenas os seus fundos e emojis. A ampliação fica disponível nos anúncios criados pelo formulário com uma imagem PNG.

### Como investiguei

Conferi a instalação do Node.js pelo Windows Package Manager, localizei `node.exe` e `npm.cmd` e confirmei a versão instalada. Depois, validei a sintaxe de `server.js`, consultei a árvore de dependências com `npm list express --depth=0` e executei o servidor pelo próprio script `npm start`.

Com o servidor ativo, fiz uma requisição para `/api/status` e outra para `/`. Comparei o conteúdo JSON retornado, o código HTTP da página e a mensagem registrada pelo servidor. Ao final, encerrei o processo temporário de teste e removi os logs usados somente durante a verificação.

Também usei `git diff --check` para verificar a formatação das alterações antes do commit.

Para os filtros, simulei anúncios com diferentes categorias, condições, modalidades e preços. Conferi as quantidades esperadas, a seleção de doações, a ordenação crescente e decrescente e uma busca textual. Também confirmei pelo servidor que o HTML entregue contém os controles de busca, ordenação e abas.

### O que aprendi

Aprendi que o `package.json` descreve o projeto, registra suas dependências e centraliza comandos como `npm start`. O `package-lock.json` registra as versões resolvidas das dependências para tornar instalações futuras mais previsíveis.

Aprendi que o Express recebe requisições por meio de rotas. `app.get` responde a uma requisição GET, `response.json` envia dados JSON e `express.static` permite entregar HTML, CSS, JavaScript e imagens de uma pasta.

Também aprendi que a propriedade `accept` do campo de arquivo ajuda o usuário a escolher o formato correto, mas a validação ainda precisa ser repetida no JavaScript e, futuramente, no backend. O modal melhora a visualização, enquanto os controles de teclado e foco tornam a interação acessível.

Aprendi que filtros não devem alterar a fonte original de dados. Em vez disso, `filter`, `sort` e `map` produzem a lista que deve ser exibida naquele momento. O estado da busca, da aba e da ordenação pode ser mantido separadamente e aplicado novamente a cada renderização.

Também aprendi que números escritos diretamente no HTML ficam desatualizados. Quando a interface deriva as contagens do mesmo array usado para montar os cartões, os indicadores permanecem coerentes depois de criar ou excluir anúncios.

### Código que consigo explicar

Consigo explicar que `express()` cria a aplicação, `PORT` define a porta do servidor, `express.json()` prepara o recebimento de JSON e `app.listen` começa a aceitar conexões.

Consigo explicar também que `app.get("/api/status", ...)` registra a primeira rota da API e que `express.static(path.join(__dirname, "public"))` transforma a pasta `public` na origem dos arquivos do site.

No frontend, consigo explicar que `criarMediaDoAnuncio` cria um botão quando há uma imagem e que `abrirImagemDoAnuncio` procura o anúncio pelo ID, configura o conteúdo do modal e chama `showModal()`.

Consigo explicar que `obterAnunciosVisiveis` combina a aba ativa, o texto da busca e a ordenação sem alterar o array original. `inicializarControlesDaVitrine` registra os eventos dos controles, enquanto `atualizarContadoresDosFiltros` percorre todos os anúncios e atualiza os números mostrados na lateral.

### Testes realizados

- Projeto Node.js inicializado e arquivos do npm gerados.
- Express 5.2.1 confirmado como dependência direta.
- Auditoria do npm concluída sem vulnerabilidades.
- Sintaxe de `server.js` validada.
- Servidor iniciado pelo script `npm start`.
- Página inicial respondendo com HTTP 200.
- Rota `/api/status` respondendo com JSON válido.
- Contagens de categorias, condições e modalidades verificadas.
- Busca textual, seleção de doações e ordenação por preço simuladas.
- Controles de busca, ordenação e abas confirmados no HTML servido.
- Sintaxe do JavaScript do frontend validada.
- Formatação do diff verificada.

### Commit

`feat: iniciar backend Express do Dia 6`

## Dia 7 antecipado — 26/07/2026

### Objetivo do dia

Antecipar a etapa de SQLite e das rotas principais da API prevista para 30/07/2026. O objetivo foi criar persistência real para os anúncios, implementar as operações GET e POST e comprovar que os dados continuam disponíveis depois que o servidor é reiniciado.

### O que eu fiz

Confirmei que o Node.js 24.18.0 instalado no ambiente oferece suporte ao módulo nativo `node:sqlite`, sem necessidade de instalar outra dependência.

Criei o arquivo `database.js`. Ele cria automaticamente a pasta `data`, abre o banco `data/marketplace.db` e executa `CREATE TABLE IF NOT EXISTS anuncios`. O arquivo do banco não foi criado manualmente.

A tabela recebeu as colunas `id`, `nome`, `categoria`, `condicao`, `modalidade`, `valor`, `localizacao`, `descricao`, `imagemUrl`, `usuarioId`, `usuarioNome` e `criadoEm`. O ID é gerado automaticamente e a data de criação recebe um valor ISO produzido pelo SQLite.

Preparei consultas SQL para inserir, listar e localizar um anúncio pelo ID. As funções `listarAnuncios` e `criarAnuncio` foram exportadas para que o servidor não precise conhecer os detalhes da conexão.

No `server.js`, implementei `GET /api/anuncios` e `POST /api/anuncios`. A criação valida os campos, normaliza os textos e verifica categoria, condição, modalidade e valor antes de executar o INSERT. Uma criação válida responde com HTTP 201; entradas inválidas e JSON malformado respondem com HTTP 400 em JSON.

Também adicionei respostas JSON para rotas de API inexistentes e falhas internas. A rota `/api/status` e o serviço dos arquivos da pasta `public` foram preservados.

Atualizei o `.gitignore` para não versionar `data/*.db` nem os arquivos auxiliares que o SQLite possa gerar.

### Organização entre agentes

O trabalho foi dividido entre três agentes temporários. Um agente implementou exclusivamente `database.js`, outro implementou exclusivamente as rotas em `server.js` e o terceiro realizou uma revisão independente da estratégia de testes e da integridade do repositório.

O agente principal consultou o Plano de Aprendizagem, definiu o contrato entre banco e API, integrou os resultados, executou os testes completos e preservou uma alteração local preexistente em `public/index.html`, que não pertence ao Dia 7.

### Principais prompts usados

**Prompt 1 — Persistência SQLite e API de anúncios**

> Atue como arquiteto backend e antecipe o Dia 7 do Plano de Aprendizagem do Marketplace Vortex. Antes de editar, produza um relatório com arquitetura, contrato dos dados, etapas, divisão entre agentes, critérios de aceitação e estratégia de testes. Use o módulo nativo `node:sqlite`. Crie `database.js`, gere automaticamente a pasta `data` e o banco, inicialize a tabela `anuncios` com ID e data gerados pelo SQLite e concentre o SQL em prepared statements. Implemente `GET /api/anuncios` e `POST /api/anuncios` em `server.js`, com normalização, validação e respostas JSON coerentes para 200, 201, 400, 404 de rota e 500. Preserve `/api/status` e os arquivos estáticos. Confirme a persistência reiniciando o servidor, use banco ou registros temporários nos testes e remova apenas os dados criados pela validação. Não inclua arquivos `.db` no Git.

### Resposta da IA

Antes de modificar os arquivos, a IA apresentou um relatório com as etapas, a divisão entre agentes, os critérios de aceitação e os testes previstos.

A arquitetura foi separada em duas camadas. `database.js` concentra a pasta, a conexão, a tabela e os prepared statements. `server.js` concentra HTTP, validação, códigos de status e respostas JSON.

O formato dos registros foi alinhado aos objetos já usados no frontend para facilitar a integração prevista para o Dia 8.

### O que funcionou

Ao carregar `database.js`, a pasta e o arquivo SQLite foram gerados automaticamente. A tabela `anuncios` foi encontrada no catálogo do SQLite com as 12 colunas esperadas.

O GET respondeu com HTTP 200, `Content-Type: application/json` e um array. O POST válido respondeu com HTTP 201 e retornou o anúncio completo com ID e data gerados.

Um POST vazio e uma requisição com JSON malformado responderam com HTTP 400 em JSON. Uma doação com valor zero foi aceita, enquanto combinações inválidas de modalidade e valor foram bloqueadas.

Para verificar persistência, criei um anúncio pela API, encerrei o servidor, iniciei um novo processo e consultei o GET. O mesmo ID continuou presente. Ao final, removi diretamente do banco apenas os dois registros temporários usados pelos testes, deixando a tabela vazia.

A página inicial e `/api/status` continuaram respondendo com HTTP 200.

### Erros encontrados

As ferramentas de linha de comando do Poppler não estavam disponíveis para consultar visualmente o PDF do plano. Usei `pypdf` como alternativa para extrair somente as páginas relacionadas ao Dia 7.

Durante a revisão, foi identificada uma alteração local preexistente em `public/index.html`, removendo um pequeno texto da vitrine. Como ela não pertence ao escopo do backend e não foi feita pelos agentes, foi preservada e mantida fora do commit do Dia 7.

Um primeiro comando de inspeção do banco apresentou erro de aspas no código passado ao `node -e`. O problema estava apenas no comando de teste; a consulta foi repetida com a citação correta e confirmou a tabela e zero registros restantes.

A revisão independente observou que categoria, condição e modalidade com espaços externos seriam verificadas antes da normalização. Ajustei a validação para aplicar `trim()` antes de consultar os valores permitidos.

### Como investiguei

Consultei o Plano de Aprendizagem para confirmar o uso de `node:sqlite`, os arquivos do Dia 7 e a regra de não criar o banco manualmente. Executei `require("node:sqlite")` para verificar a compatibilidade real do ambiente.

Validei a sintaxe de `database.js` e `server.js` com `node --check`. Consultei `PRAGMA table_info(anuncios)` e `sqlite_schema` para confirmar as colunas e a existência da tabela.

Iniciei o servidor em uma porta temporária, fiz requisições HTTP para GET, POST, status e página inicial, encerrei o processo e o iniciei novamente. Comparei o ID criado antes do reinício com os dados retornados depois dele.

### O que aprendi

Aprendi que banco, tabela, linha e coluna representam níveis diferentes da persistência. `CREATE TABLE IF NOT EXISTS` permite inicializar a estrutura sem apagar dados existentes.

Aprendi que prepared statements separam os valores do comando SQL, reduzem riscos de injeção e podem ser reutilizados. `INSERT` cria uma linha, enquanto `SELECT` recupera os dados persistidos.

Também aprendi que `req.body` contém o JSON enviado pelo cliente, `res.status` define o código HTTP e `res.json` garante uma resposta JSON. HTTP 200 representa uma leitura bem-sucedida, 201 representa uma criação e 400 indica dados enviados incorretamente.

Reiniciar o processo do servidor não remove os dados porque eles estão gravados no arquivo SQLite, e não apenas em uma variável na memória.

### Código que consigo explicar

Consigo explicar que `mkdirSync(pastaDados, { recursive: true })` garante a existência da pasta, `new DatabaseSync(caminhoBanco)` abre ou cria o banco e `database.exec` inicializa a tabela.

Consigo explicar que `database.prepare` cria uma consulta preparada, `.run` executa o INSERT, `.all` retorna várias linhas e `.get` retorna somente uma.

No servidor, consigo explicar que GET chama `listarAnuncios`, POST valida `req.body`, chama `criarAnuncio` e responde com o registro criado e HTTP 201.

### Testes realizados

- Compatibilidade de `node:sqlite` confirmada.
- Sintaxe de `database.js` e `server.js` validada.
- Criação automática da pasta e do arquivo de banco confirmada.
- Tabela `anuncios` e suas 12 colunas verificadas.
- GET respondendo HTTP 200 com array JSON.
- POST válido respondendo HTTP 201 com ID gerado.
- Doação com valor zero aceita.
- POST inválido respondendo HTTP 400 em JSON.
- JSON malformado respondendo HTTP 400 em JSON.
- Persistência do mesmo ID confirmada após reiniciar o servidor.
- Página inicial e `/api/status` respondendo HTTP 200.
- Registros temporários removidos ao final.
- Processos e logs temporários encerrados e removidos.

### Commit

`feat: antecipar persistência SQLite do Dia 7`

## Dia 8 antecipado — 27/07/2026

### Objetivo do dia

Integrar o frontend do Marketplace Vortex à API e ao SQLite, substituindo o array local como fonte dos anúncios. O objetivo foi fazer a página carregar, criar, filtrar e excluir anúncios por meio de requisições HTTP, mantendo o banco como fonte oficial dos dados.

### O que eu fiz

Completei os filtros opcionais por categoria e usuário em `GET /api/anuncios`. A rota aceita `categoria`, `usuarioId` ou os dois parâmetros combinados, valida valores inválidos e envia os filtros para consultas parametrizadas no SQLite.

Implementei a exclusão por ID com `DELETE /api/anuncios/:id`. O servidor valida se o ID é um inteiro positivo, responde com HTTP 400 para IDs inválidos, HTTP 404 quando o anúncio não existe e HTTP 200 depois de uma exclusão bem-sucedida.

No frontend, removi os quatro anúncios simulados e passei a carregar o catálogo com `fetch` e `GET /api/anuncios`. A seção “Meus anúncios” consulta separadamente `GET /api/anuncios?usuarioId=...`, enquanto a seleção de categoria utiliza `GET /api/anuncios?categoria=...`.

O formulário agora transforma a imagem validada em uma data URL, envia os dados como JSON para `POST /api/anuncios` e utiliza o anúncio devolvido pela API, incluindo o ID e a data gerados no banco. O botão fica bloqueado durante a publicação para evitar envios duplicados, e o formulário só é limpo depois da confirmação do servidor.

A exclusão deixou de alterar somente o estado local. O frontend chama o endpoint DELETE, aguarda a confirmação e recarrega o catálogo e os anúncios do usuário. Falhas de rede e respostas HTTP 400, 404 e 500 geram mensagens específicas sem simular sucesso na interface.

Os arrays restantes foram renomeados como caches da API. Eles são preenchidos exclusivamente por respostas do servidor e servem apenas para busca textual, ordenação, abas, contadores e renderização. Criação e exclusão sempre terminam com um novo carregamento da API.

Como as imagens podem ter até 5 MB e sua conversão para base64 aumenta o tamanho do JSON, ajustei o limite do `express.json` para 8 MB.

### Organização entre agentes

O trabalho foi dividido em seis tarefas e uma revisão independente. Agentes separados implementaram os filtros da API, a exclusão por ID, o carregamento inicial, o envio do formulário, as operações remotas do frontend e a remoção do array como fonte de dados.

Um agente extra revisou a integração completa sem assumir que as implementações anteriores estavam corretas. Durante essa revisão, ele encontrou uma possibilidade de submissão duplicada por eventos concorrentes e adicionou a trava `publicacaoEmAndamento`.

### Principais prompts usados

**Prompt 1 — Integração completa entre frontend, API e banco**

> Atue como líder full-stack e integre o frontend do Marketplace Vortex à API e ao SQLite. Primeiro, inspecione a arquitetura atual e apresente um plano dividido por dependências, arquivos afetados e critérios de conclusão. O escopo obrigatório é: filtros por `categoria` e `usuarioId` em `GET /api/anuncios`; exclusão parametrizada por ID; carregamento inicial pela API; envio do formulário para `POST /api/anuncios`; exclusão e filtros acionados pelo frontend; e remoção do array hardcoded como fonte de dados. A API deve ser a fonte canônica, embora caches de respostas sejam permitidos para renderização. Trate carregamento, falhas de rede, respostas 400, 404 e 500, ações duplicadas e respostas assíncronas fora de ordem.

**Prompt 2 — Delegação e revisão independente**

> Após apresentar o plano, crie um agente dedicado para cada tarefa de implementação e um agente extra exclusivamente para a revisão integrada. O revisor não deve confiar nos relatórios anteriores: ele deve inspecionar o diff, procurar dados hardcoded e mutações locais usadas como persistência, validar a sintaxe e executar requisições reais em servidor e banco temporários. Teste GET sem filtro, categoria, usuário, combinação, parâmetros inválidos, POST válido e inválido e DELETE válido, inválido e inexistente. Preserve o banco real, limpe todos os recursos temporários e corrija somente falhas comprovadas.

**Prompt 3 — Roteiro de validação para o usuário**

> Ao final, explique como uma pessoa pode confirmar manualmente cada entrega usando a aplicação e a aba Network do DevTools. Inclua os métodos, URLs e códigos HTTP esperados, como diferenciar respostas 200 e 304, como verificar persistência após atualizar a página e como comprovar que os anúncios não vêm mais de um array local. Use instruções curtas, ordenadas e reproduzíveis.

### Resposta da IA

A IA inspecionou a arquitetura existente, identificou que o backend já possuía GET, POST e SQLite e organizou as atividades por dependência. Primeiro foram concluídos os contratos do backend e o carregamento inicial. Depois, o formulário, os filtros, a exclusão remota e a limpeza da fonte local foram integrados.

Cada agente trabalhou em uma tarefa delimitada dentro do mesmo workspace. A revisão final executou testes em um servidor e banco temporários, auditou o código do frontend e corrigiu a condição de envio duplicado encontrada.

### O que funcionou

Ao abrir ou atualizar a página, o catálogo é solicitado à API. O filtro por categoria envia o parâmetro correto, e “Meus anúncios” consulta somente os registros associados ao ID do usuário atual.

Um anúncio enviado pelo formulário recebe HTTP 201, é gravado no SQLite e continua disponível depois de atualizar a página. A imagem também permanece porque é armazenada como data URL, e não como uma URL temporária do navegador.

A exclusão envia o ID ao servidor, remove o registro do banco e recarrega as listas. Uma segunda tentativa com o mesmo ID recebe HTTP 404.

No DevTools, as requisições GET apareceram com HTTP 304 quando o navegador reutilizou o cache. Isso também representa uma resposta válida; com “Disable cache” ativado, a resposta completa pode ser observada com HTTP 200.

### Erros encontrados

O limite padrão do `express.json` é menor que o conteúdo de uma imagem de até 5 MB convertida para base64. Sem o ajuste, publicações com imagens reais poderiam falhar antes de chegar à validação da rota.

Durante a revisão final, foi identificado que dois eventos de envio muito próximos poderiam iniciar duas requisições POST antes que o botão desabilitado impedisse a segunda execução. A variável `publicacaoEmAndamento` passou a bloquear esse caso.

O comando `node` não ficou disponível de forma consistente no PATH de todas as sessões dos agentes. A validação final utilizou o caminho absoluto do Node.js 24.18.0 instalado no ambiente.

Não havia navegador integrado disponível para um teste visual automatizado completo. Por isso, o frontend foi auditado estaticamente e as requisições foram conferidas manualmente no DevTools.

### Como investiguei

Revisei os contratos entre `public/app.js`, `server.js` e `database.js`, conferindo os nomes dos campos e os códigos HTTP esperados.

Iniciei uma cópia do servidor em porta e diretório temporários, com um banco SQLite isolado. Executei requisições reais para listagem sem filtro, categoria, usuário, filtros combinados, criação válida e inválida e exclusão válida, inválida e inexistente. O processo, o banco e os arquivos temporários foram removidos ao final, sem alterar o banco real.

Também usei `node --check`, `git diff --check` e buscas no código para confirmar que não existem anúncios hardcoded, `push`, IDs locais de anúncios ou exclusões por `filter` funcionando como persistência.

### O que aprendi

Aprendi que a API deve ser a fonte oficial dos dados quando existe um banco. O frontend pode manter caches para renderização, mas deve atualizá-los a partir das respostas do servidor e nunca considerar uma alteração local como persistida antes da confirmação HTTP.

Aprendi a montar query strings com `URLSearchParams`, usar `fetch` com diferentes métodos HTTP e tratar os códigos 200, 201, 400, 404 e 500 de maneiras diferentes.

Também aprendi que respostas HTTP 304 indicam que o recurso não mudou e que o navegador pode usar sua cópia em cache. Isso não representa falha na API.

Aprendi que uma interface assíncrona precisa evitar respostas fora de ordem e ações duplicadas. Contadores de sequência impedem que uma requisição antiga substitua dados mais recentes, enquanto travas e botões desabilitados evitam envios e exclusões repetidos.

### Código que consigo explicar

Consigo explicar que `requisitarApi` centraliza o uso de `fetch`, converte a resposta para JSON e transforma respostas HTTP de erro em exceções com status e detalhes.

Consigo explicar que `carregarAnunciosDaApi` consulta o catálogo por categoria, enquanto `carregarMeusAnunciosDaApi` envia o `usuarioId`. As respostas alimentam caches usados apenas para montar a interface.

No backend, consigo explicar que `validarFiltrosAnuncios` verifica a query string e que `listarAnuncios` utiliza placeholders para filtrar categoria e usuário sem concatenar valores no SQL.

Consigo explicar também que `criarAnuncio` envia POST e só limpa o formulário após HTTP 201, enquanto `excluirAnuncio` envia DELETE e recarrega os dados depois do sucesso.

### Testes realizados

- Sintaxe de `server.js`, `database.js` e `public/app.js` validada.
- Formatação do diff validada.
- GET sem filtros respondendo HTTP 200.
- GET filtrado por categoria respondendo HTTP 200.
- GET filtrado por usuário respondendo HTTP 200.
- GET com categoria e usuário combinados respondendo HTTP 200.
- Filtros inválidos respondendo HTTP 400.
- POST válido com imagem respondendo HTTP 201.
- POST inválido respondendo HTTP 400 sem alterar o banco.
- DELETE válido respondendo HTTP 200.
- DELETE com ID inválido respondendo HTTP 400.
- DELETE de anúncio inexistente respondendo HTTP 404.
- Persistência confirmada após atualizar a página.
- Ausência de anúncios hardcoded e mutações locais como fonte de dados confirmada.
- 57 IDs únicos e 26 seletores principais do frontend auditados.
- Processo, banco e arquivos temporários removidos após os testes.

### Commit

`feat: integrar frontend à API no Dia 8`
