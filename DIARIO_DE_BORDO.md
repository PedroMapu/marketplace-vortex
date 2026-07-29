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

### Partes principais que eu acho bom explicar

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

### Partes principais que eu acho bom explicar

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

### Partes principais que eu acho bom explicar

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

### Partes principais que eu acho bom explicar

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

### Partes principais que eu acho bom explicar

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

### Partes principais que eu acho bom explicar

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

### Partes principais que eu acho bom explicar

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

### Partes principais que eu acho bom explicar

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

## Dia 9 antecipado — 27/07/2026

### Objetivo do dia

Finalizar a responsividade mobile do Marketplace Vortex e aplicar uma camada básica de acessibilidade. O objetivo foi adaptar a landing page, reorganizar a navegação em telas pequenas, melhorar o formulário no celular, exibir os cartões em uma coluna e eliminar riscos de overflow nas larguras mais comuns.

### O que eu fiz

Adaptei a landing page para telas menores, reduzindo espaçamentos, ajustando a escala dos títulos e tornando o destaque principal mais compacto. Os botões principais passam a ocupar uma coluna no celular, enquanto a ilustração e as métricas mantêm proporções adequadas sem forçar uma altura excessiva.

Substituí a navegação horizontal por um menu compacto em telas de até 68 rem. O novo botão possui área mínima de toque de 44 px, `aria-controls`, `aria-expanded` e rótulo atualizado conforme o estado. O menu fecha ao selecionar um link, clicar fora, pressionar `Escape` ou voltar para uma largura de desktop. Quando o fechamento acontece por `Escape`, o foco retorna ao botão.

Reorganizei o formulário de anúncio em uma coluna nas telas pequenas. Os campos usam fonte de 16 px no celular para evitar zoom automático, os controles de modalidade e o botão de publicação possuem áreas adequadas para toque e o seletor de arquivo se adapta à largura disponível.

A validação do formulário passou a apresentar mensagens específicas por campo. Os controles inválidos recebem `aria-invalid`, são associados às mensagens por `aria-describedby` e o foco é movido para o primeiro erro. As mensagens são removidas progressivamente quando a pessoa corrige os dados.

As grades da vitrine, coleções, colaboradores e “Meus anúncios” passam a utilizar uma única coluna até 768 px. Em telas ainda menores, os cartões de anúncios próprios também empilham imagem, informações e ações. Textos longos podem quebrar sem ultrapassar o cartão.

Também corrigi safe areas laterais, títulos longos no modal e o cabeçalho autenticado ou deslogado em larguras próximas de 320 px. O rótulo visual da conta pode ser ocultado quando não há espaço, mas o nome acessível completo continua disponível pelo `aria-label`.

Depois da primeira entrega, revisei as regras de upload de imagens. A exigência de proporção mínima 1:1 foi considerada rígida porque impedia fotos verticais comuns feitas pelo celular. Removi a instrução da interface, as constantes, as mensagens, a leitura de dimensões e o bloqueio baseado na proporção. Os formatos PNG, JPG e JPEG e o limite de 5 MB permaneceram ativos.

Também aumentei discretamente a altura útil da navegação interna da vitrine. O `hover` global move os botões 2 px para cima, mas o contêiner horizontal das abas não possuía espaço vertical suficiente e podia recortar a parte superior. Adicionei uma folga interna ao `.vitrine-abas-container` e à `.vitrine-abas`, preservando a rolagem horizontal e os breakpoints.

Por fim, transformei o botão “Criar Coleção” em uma funcionalidade completa. Ele agora abre e fecha um painel semelhante ao formulário de anúncio, sem deixar os dois painéis abertos ao mesmo tempo. A pessoa escolhe o nome da coleção, adiciona vários itens, informa nome e categoria para cada um e pode remover linhas, mantendo pelo menos um item.

As coleções são associadas ao usuário atual e persistidas no `localStorage`. Depois da criação, um cartão é inserido na grade de coleções e reaparece após atualizar a página ou entrar novamente na conta. O resumo do cartão mostra no máximo três nomes e informa quantos itens adicionais existem, evitando cartões excessivamente altos.

### Organização entre agentes

O trabalho foi dividido entre seis agentes. Cinco agentes receberam tarefas independentes: adaptação da landing page, navegação mobile, formulário mobile, cartões em uma coluna e auditoria de overflow. Como o ambiente permitia somente quatro agentes simultâneos, as tarefas foram executadas em duas rodadas.

Um sexto agente realizou a revisão final integrada. Ele conferiu as alterações combinadas, procurou conflitos entre media queries, revisou navegação por teclado, atributos ARIA, validação do formulário, reflow dos cartões e riscos de overflow. Durante essa revisão, foi aplicado o último ajuste de compactação do botão de conta entre 320 e 416 px.

Na implementação posterior das coleções, um agente ficou responsável pelo painel, campos dinâmicos, persistência e renderização. Outro agente foi reservado exclusivamente para responsividade e acessibilidade. Ele auditou o novo fluxo de 320 a 1440 px, corrigiu alvos de toque, fontes dos campos, quebra de texto, largura dos painéis e associação da ajuda ao `fieldset`.

### Principais prompts usados

**Prompt 1 — Implementação do Dia 9 com agentes especializados**

> Vamos para o Dia 9: responsividade mobile final e acessibilidade básica. Separe cinco agentes, um para cada tarefa, e um sexto agente para revisar tudo. As tarefas são: adaptar a landing page para celular; organizar a navegação para telas pequenas; deixar o formulário utilizável no mobile; exibir cartões em uma coluna; e testar larguras comuns, corrigindo overflow. Preserve a identidade visual, as funcionalidades existentes e o trabalho dos demais agentes.

**Prompt 2 — Validação manual das alterações**

> Explique como testar localmente as alterações do Dia 9. Inclua como iniciar o projeto, abrir a página, usar o modo responsivo do navegador, quais larguras verificar e um checklist para menu, cartões, formulário, overflow, teclado, foco, zoom e acessibilidade.

**Prompt 3 — Revisão das regras de upload**

> Revise as condições apresentadas para o upload de imagens e avalie se são realistas para uma pessoa usuária. Depois, remova a recomendação rígida de proporção mínima 1:1 e todas as regras, mensagens e instruções relacionadas, preservando as demais validações.

**Prompt 4 — Correção do hover nas abas da vitrine**

> Aumente um pouco a altura da navegação interna `.vitrine-abas-container` para impedir o recorte do botão durante o hover. Confira os breakpoints responsivos e garanta que nenhuma outra parte do frontend seja quebrada.

**Prompt 5 — Criação de coleções com vários itens**

> Torne o botão `botao-criar-colecao` funcional. Ao pressioná-lo, abra um painel semelhante ao botão “Anunciar”. Nesse painel, permita escolher o nome da coleção e adicionar vários itens de uma vez. Se utilizar agentes, reserve um agente exclusivamente para garantir a responsividade do botão e do novo fluxo.

### Resposta da IA

A IA manteve a identidade azul e verde do Marketplace Vortex e organizou a adaptação em breakpoints progressivos. Em vez de apenas reduzir elementos, alterou a composição para uma sequência vertical, preservando leitura, áreas de toque e hierarquia visual.

Os agentes trabalharam em mudanças delimitadas e compartilharam o mesmo workspace. A integração final reuniu CSS responsivo, estrutura HTML acessível e comportamento JavaScript para o menu e a validação do formulário.

A IA também forneceu um roteiro de teste manual com `npm start`, acesso por `http://localhost:3000`, modo responsivo do DevTools, uso do teclado, zoom de 200% e auditoria pelo Lighthouse.

Na revisão do upload, a IA identificou que a proporção 1:1 rejeitava qualquer imagem mais alta que larga. A validação foi simplificada sem afetar formato ou tamanho.

Para as abas, a IA relacionou o recorte ao `transform: translateY(-2px)` aplicado no hover global e adicionou espaço vertical dentro do contêiner rolável.

Na funcionalidade de coleções, a IA reutilizou o padrão visual e acessível do painel de anúncio, criou linhas dinâmicas com DOM seguro e manteve a persistência local separada da API de anúncios.

### O que funcionou

A página se reorganiza para celular sem remover conteúdo importante. A landing page mantém a identidade visual, os botões ficam fáceis de tocar e os cartões são exibidos em uma coluna até 768 px.

O menu compacto informa corretamente seu estado, pode ser operado por teclado e não permanece aberto depois da seleção de um link ou da mudança para desktop.

O formulário apresenta os campos em uma sequência simples, destaca erros de maneira visual e acessível e direciona a pessoa para o primeiro campo que precisa ser corrigido.

Fotos verticais deixaram de ser rejeitadas por uma regra de proporção. As abas da vitrine têm espaço para o movimento do hover sem recorte.

O painel de coleções abre pelo botão, fecha pelo próprio botão ou por `Escape` e devolve o foco. É possível adicionar e remover linhas, validar cada item, salvar a coleção e recuperá-la depois de atualizar a página. Os dados fornecidos pela pessoa são inseridos com `createElement` e `textContent`, sem `innerHTML`.

As respostas da página, dos arquivos CSS e JavaScript e da API foram verificadas com HTTP 200.

### Erros encontrados

O navegador visual integrado não estava disponível no ambiente. O plugin de navegador estava presente, mas a lista de backends retornou vazia. Por isso, não foi possível produzir capturas automáticas ou interagir visualmente com cada viewport.

A auditoria encontrou riscos pontuais de overflow no título do modal, nas safe areas laterais e no texto do botão de conta em 320 px. Esses casos foram corrigidos no CSS.

Durante a correção das abas, a comparação com o último commit revelou que algumas regras responsivas do Dia 9 não estavam presentes no estado momentâneo do arquivo. As regras de safe area, quebra de texto, cartões em uma coluna e compactação da conta foram restauradas antes de continuar.

O painel de coleções precisou limitar o resumo visual dos itens. Concatenar todos os nomes tornaria o cartão muito alto quando a coleção tivesse muitos elementos. O resumo passou a mostrar somente os três primeiros nomes e a quantidade restante.

O comando `node` também não permaneceu disponível de forma consistente no PATH de todas as sessões dos agentes. As verificações foram repetidas na sessão principal quando o executável estava acessível.

### Como investiguei

Revisei os breakpoints de 68, 48, 38 e 26 rem, procurando larguras fixas, grids que não encolhiam, textos sem quebra e controles menores que 44 px.

Auditei estaticamente as larguras de 320, 360, 375, 390, 414, 768, 1024 e 1440 px. Conferi o comportamento esperado do cabeçalho, menu, landing page, formulário, busca, filtros, cartões, modal e rodapé em cada faixa.

Validei os contratos entre HTML, CSS e JavaScript, incluindo IDs, `aria-controls`, `aria-expanded`, `aria-describedby`, `aria-invalid`, foco visível e fechamento por `Escape`.

Também iniciei o servidor local e fiz requisições para a página, os arquivos estáticos e a API. Ao final, encerrei o processo e removi somente os logs temporários criados durante o teste.

Para o upload, busquei todas as referências a proporção, dimensões naturais da imagem e mensagens relacionadas. Depois da remoção, confirmei que nenhuma ocorrência permaneceu.

Para as abas, comparei o deslocamento vertical do hover com o padding disponível no contêiner rolável. Conferi o CSS final contra o último commit para garantir que somente a folga vertical desejada fosse adicionada.

Para as coleções, revisei os contratos entre HTML, CSS e JavaScript, os IDs dinâmicos, as referências ARIA, o estado de login, a chave do `localStorage`, a criação dos cartões e a exclusividade entre os dois painéis. Um agente independente auditou as larguras de 320, 360, 375, 390, 414, 768, 1024 e 1440 px.

### O que aprendi

Aprendi que responsividade não significa apenas diminuir fontes. Em telas menores, é necessário reorganizar grids, empilhar ações, permitir quebra de texto e garantir que todos os elementos possam encolher com `minmax(0, 1fr)` e `min-width: 0`.

Aprendi que áreas de toque devem ter pelo menos 44 px e que campos com fonte de 16 px evitam o zoom automático em alguns navegadores móveis.

Também aprendi que `aria-expanded` comunica o estado de um menu, `aria-controls` relaciona o botão ao painel controlado, `aria-invalid` identifica um campo com erro e `aria-describedby` associa instruções ou mensagens ao controle.

Aprendi que `prefers-reduced-motion` respeita pessoas que preferem menos animações e que o zoom de 200% é um teste importante para verificar reflow e legibilidade.

Aprendi que recomendações visuais devem ser diferenciadas de bloqueios obrigatórios. Uma proporção pode produzir um resultado visual melhor, mas não deve impedir o envio de fotos verticais comuns sem uma necessidade real.

Aprendi que contêineres com rolagem horizontal também precisam reservar espaço vertical para movimentos de hover, porque o conteúdo transformado pode ser recortado.

Aprendi que o `localStorage` pode persistir estruturas simples como coleções e itens, mas continua sendo armazenamento local do navegador. Também aprendi a criar campos repetíveis com IDs exclusivos, delegação de eventos e atualização de rótulos e botões após adicionar ou remover linhas.

### Partes principais que eu acho bom explicar

Consigo explicar que `window.matchMedia("(max-width: 68rem)")` informa ao JavaScript quando o menu compacto deve ser utilizado. A função `definirMenuPrincipalAberto` sincroniza os atributos do botão, o rótulo acessível e a visibilidade da navegação.

Consigo explicar que os media queries alteram os grids para uma coluna, ajustam paddings e reorganizam imagem, conteúdo e ações sem duplicar o HTML.

No formulário, consigo explicar que `validarCamposDoFormulario` percorre os controles obrigatórios, cria mensagens específicas e identifica o primeiro campo inválido. `aria-invalid` comunica o erro e `aria-describedby` aponta para o texto que explica como corrigir.

Consigo explicar que `obterErrosImagem` agora verifica somente presença, formato e tamanho da imagem, sem ler largura, altura ou proporção.

Consigo explicar que o `padding-block` de `.vitrine-abas-container` e `.vitrine-abas` cria espaço para o deslocamento do hover sem alterar a largura dos botões.

No fluxo de coleções, consigo explicar que `criarLinhaDeItemColecao` monta cada conjunto de campos, `validarFormularioDaColecao` verifica nome e categoria, `salvarColecoes` grava o array no navegador e `renderizarColecoesDoUsuario` cria os cartões da conta atual. `definirPainelColecaoAberto` sincroniza a visibilidade, o texto do botão, `aria-expanded` e o foco.

### Testes realizados

- Sintaxe de `public/app.js`, `public/animations.js` e `server.js` validada.
- Formatação do diff validada com `git diff --check`.
- 73 IDs HTML verificados sem duplicidade.
- Referências ARIA e controles nomeados auditados.
- CSS com 522 chaves de abertura e 522 de fechamento.
- Página inicial respondendo HTTP 200.
- `styles.css`, `app.js` e `animations.js` respondendo HTTP 200.
- `/api/anuncios` respondendo HTTP 200.
- Reflow auditado em 320, 360, 375, 390, 414, 768, 1024 e 1440 px.
- Menu compacto revisado para clique, link, clique externo, `Escape` e redimensionamento.
- Formulário revisado para coluna única, erros por campo e foco no primeiro erro.
- Vitrine, coleções, colaboradores e “Meus anúncios” confirmados em uma coluna até 768 px.
- Regra de proporção 1:1 e todas as referências relacionadas removidas.
- Formatos e limite de 5 MB do upload preservados.
- Hover das abas validado com espaço vertical suficiente.
- Painel de coleções abrindo e fechando sem conflito com o painel de anúncio.
- Adição e remoção de múltiplos itens verificadas.
- Validação acessível de nome e categoria verificada.
- Persistência das coleções por usuário no `localStorage` verificada estruturalmente.
- Cards de coleção construídos sem `innerHTML`.
- Novo painel auditado entre 320 e 1440 px.
- Alvos de toque de 44 px e campos com fonte de 16 px no mobile confirmados.
- Foco visível e `prefers-reduced-motion` preservados.
- Processo do servidor e logs temporários encerrados e removidos.

### Commit

`feat: antecipar responsividade e acessibilidade do Dia 9`

## Dia 10 antecipado — 27/07/2026

### Objetivo do dia

Transformar o Marketplace Vortex em uma aplicação web progressiva instalável. O objetivo foi criar o manifesto da aplicação, adicionar ícones próprios, implementar um Service Worker, registrar esse serviço no frontend e verificar os requisitos de instalação, os recursos carregados e possíveis erros no DevTools.

### O que eu fiz

Criei o arquivo `public/manifest.json` com a identidade do Marketplace Vortex. O manifesto informa nome completo e nome curto, descrição, idioma `pt-BR`, identificador, rota inicial, escopo, modo de exibição `standalone`, orientação, cores do tema e do fundo e categorias relacionadas à finalidade da plataforma.

Adicionei os ícones `public/icons/icon-192.png` e `public/icons/icon-512.png`. Os dois arquivos são PNG reais nas dimensões indicadas, utilizam as cores azul e verde do projeto e mantêm o símbolo principal dentro da área segura necessária para recortes do tipo `maskable`.

Implementei `public/service-worker.js` com um cache versionado para o shell da aplicação. Durante a instalação, o Service Worker armazena a página inicial, HTML, CSS, JavaScript, manifesto e ícones. Durante a ativação, versões antigas do cache do Marketplace Vortex são removidas e o novo worker assume o controle das páginas abertas.

Para navegações, utilizei uma estratégia `network-first`: a aplicação tenta buscar a versão mais recente na rede e utiliza a cópia armazenada quando a conexão falha. Para recursos estáticos locais, utilizei `stale-while-revalidate`, permitindo resposta rápida pelo cache e atualização em segundo plano.

As rotas da API não são interceptadas pelo Service Worker. Requisições que não usam GET, respostas externas, solicitações parciais com cabeçalho `Range` e respostas inválidas também não são armazenadas. Essa separação evita que criação, exclusão ou listagem de anúncios use dados inadequadamente obsoletos.

Criei `public/pwa.js` para registrar `/service-worker.js` com escopo `/` depois do carregamento da página. O código verifica se o navegador oferece suporte a Service Workers e registra no Console qualquer falha de inicialização, facilitando a investigação durante o desenvolvimento.

Atualizei `public/index.html` com a referência ao manifesto, a cor do tema, o favicon, o Apple Touch Icon e o script de registro. A alteração preexistente em `public/app.js` foi preservada e não foi incorporada ao trabalho do Dia 10.

Depois da implementação, iniciei o projeto em uma porta temporária e verifiquei a página, os scripts, os estilos, o manifesto, o Service Worker, os ícones e as rotas principais da API. Os arquivos temporários e os logs criados durante os testes foram removidos, e o processo do servidor foi encerrado.

### Organização entre agentes

O trabalho foi distribuído entre sete agentes. Seis agentes receberam uma tarefa específica: criar o manifesto, adicionar os ícones, criar o Service Worker, registrar o Service Worker, testar o manifesto e a instalação e conferir erros no DevTools.

Como o ambiente permitia até quatro agentes simultâneos, as tarefas foram executadas em rodadas. Os primeiros agentes prepararam os artefatos independentes. Depois, o registro foi integrado ao HTML e os agentes de teste trabalharam sobre o conjunto completo.

Um sétimo agente realizou uma revisão independente de todas as entregas. Ele não confiou apenas nos relatórios anteriores: conferiu os arquivos, o diff, os caminhos, as dimensões dos ícones, a sintaxe, o conteúdo do cache, as exceções da API, as respostas HTTP, os processos temporários e a preservação de `public/app.js`.

O revisor classificou manifesto, ícones, Service Worker e registro como aprovados. Os testes de instalação real e a inspeção visual do DevTools ficaram pendentes por uma limitação externa: o backend de navegador integrado não estava disponível na sessão.

### Principais prompts usados

**Prompt 1 — Implementação do Dia 10 com agentes especializados**

> Vamos antecipar o dia 10. Para realizar as seguintes tarefas, use um agente para cada uma e um agente extra para conferir se cada tarefa foi feita de maneira correta: criar `manifest.json`, adicionar ícones, criar `service-worker.js`, registrar o Service Worker, testar manifesto e instalação e conferir erros no DevTools.

**Prompt 2 — Registro e publicação do trabalho**

> Registre tudo no diário de bordo desse Dia 10 antecipado seguindo o padrão. Faça os commits e o push necessário.

### Resposta da IA

A IA inspecionou o projeto, identificou os arquivos estáticos servidos pelo Express e organizou as tarefas respeitando as dependências entre manifesto, ícones, Service Worker, registro e testes.

Os agentes criaram os artefatos em arquivos separados para reduzir conflitos. O registro ficou isolado em `pwa.js`, sem modificar a lógica principal de `app.js`. O Service Worker foi planejado para oferecer uma experiência offline básica sem transformar a API em uma fonte de dados obsoleta.

Durante os testes, a IA confirmou a validade estrutural do manifesto, a integridade e as dimensões dos PNGs, a sintaxe dos scripts e a disponibilidade HTTP de todos os itens necessários ao pré-cache.

O agente de DevTools seguiu o procedimento obrigatório de diagnóstico, mas a lista de navegadores disponíveis retornou vazia. A IA não substituiu essa verificação por uma automação incompatível com o fluxo exigido. A limitação foi registrada de forma explícita, separando o que foi comprovado do que ainda depende de um navegador disponível.

A revisão independente encontrou que `pwa.js` inicialmente ocultava falhas de registro. O tratamento foi ajustado para usar `console.error`, tornando futuros problemas visíveis durante a homologação.

### O que funcionou

O navegador pode descobrir o manifesto diretamente pelo HTML. O manifesto possui os campos essenciais para identificar e apresentar o Marketplace Vortex como aplicativo independente.

Os ícones de 192 e 512 px são carregados pelos caminhos declarados e podem ser utilizados tanto na instalação quanto em contextos que aplicam máscara.

O Service Worker consegue armazenar todo o shell porque os dez recursos listados no pré-cache responderam com HTTP 200 e tipos MIME coerentes. Uma falha de rede durante a navegação pode utilizar a página já armazenada.

Arquivos estáticos podem ser servidos rapidamente pelo cache enquanto uma versão atualizada é solicitada em segundo plano. Caches antigos com o prefixo do projeto são removidos quando uma nova versão é ativada.

As rotas `/api` permanecem sob controle direto da rede. POST, DELETE, requisições Range e recursos de outros domínios não são interceptados.

O registro acontece somente em navegadores compatíveis e eventuais falhas passam a aparecer no Console com uma mensagem identificável.

### Erros encontrados

O navegador integrado não estava disponível. As tentativas de acesso retornaram `No browser is available`, e o inventário de backends retornou uma lista vazia. Por isso, não foi possível confirmar visualmente o estado `activated`, verificar `navigator.serviceWorker.controller`, observar o botão de instalação ou abrir os painéis Console, Network e Application.

Esse bloqueio pertence ao ambiente de testes e não foi classificado como erro da aplicação. Todos os recursos que participam da instalação responderam corretamente pelo servidor local.

Na primeira versão, a rejeição do registro em `pwa.js` era capturada sem registrar detalhes. Isso dificultaria descobrir uma falha real no Console. O código foi corrigido para exibir o erro.

O revisor observou que os mesmos arquivos de ícone são declarados com `purpose: "any maskable"`. Essa declaração é válida e o desenho respeita a área segura. Como melhoria futura de qualidade, podem ser criados ícones separados para `any` e `maskable`, mas isso não bloqueia a instalação atual.

O `git diff --check` geral encontrou espaços em branco em `public/app.js`, porém esse conteúdo já existia antes do Dia 10 e foi preservado fora do commit.

### Como investiguei

Revisei os contratos entre `index.html`, `manifest.json`, `pwa.js` e `service-worker.js`, conferindo se os caminhos absolutos, o escopo e os recursos do cache correspondiam aos arquivos realmente servidos pelo Express.

Validei o manifesto como JSON e conferi os campos usados pelo navegador. Inspecionei a assinatura, o formato e as dimensões reais dos ícones.

Revisei os eventos `install`, `activate` e `fetch`. Conferi a versão do cache, a remoção restrita aos caches do Marketplace Vortex, o fallback de navegação, a atualização dos recursos estáticos e as condições que impedem o cache da API.

Iniciei um servidor local isolado e solicitei cada recurso do shell. Também verifiquei `/api/status` e `/api/anuncios` para confirmar que o restante da aplicação continuava acessível.

Os agentes de instalação e DevTools seguiram o procedimento de controle do navegador e repetiram o diagnóstico da conexão. Quando o inventário permaneceu vazio, registraram exatamente quais verificações não poderiam ser comprovadas.

Por fim, um agente independente repetiu as validações estáticas e HTTP, verificou processos e arquivos temporários e produziu uma matriz de aprovação para cada tarefa.

### O que aprendi

Aprendi que um manifesto descreve como a aplicação deve aparecer quando instalada, enquanto o Service Worker controla requisições e permite definir comportamentos de cache e uso offline. Um recurso não substitui o outro.

Aprendi que `start_url`, `scope`, `display`, `theme_color`, `background_color` e os ícones precisam estar coerentes com o caminho em que a aplicação é publicada.

Aprendi que `install` prepara os recursos, `activate` limpa versões antigas e `fetch` decide quando utilizar rede ou cache. `skipWaiting()` e `clients.claim()` permitem que uma nova versão assuma o controle mais rapidamente.

Aprendi a diferença entre `network-first` e `stale-while-revalidate`. A primeira estratégia prioriza conteúdo recente e oferece fallback offline; a segunda prioriza velocidade para arquivos estáticos e atualiza o cache em paralelo.

Também aprendi que operações da API não devem ser incluídas automaticamente no mesmo cache do shell. Uma estratégia offline para anúncios precisa ser projetada separadamente e aplicada somente a requisições GET apropriadas.

Aprendi que `localhost` é aceito como contexto seguro durante o desenvolvimento, mas a aplicação publicada precisa de HTTPS para utilizar Service Workers e oferecer instalação de maneira confiável.

### Partes principais que eu acho bom explicar

Consigo explicar que `APP_SHELL` contém os arquivos mínimos necessários para abrir a interface. Durante `install`, `cache.addAll` busca esses recursos e só conclui quando todos estão disponíveis.

Consigo explicar que o evento `activate` lista os caches, seleciona somente aqueles que começam com o prefixo do Marketplace Vortex e remove as versões diferentes da atual.

Consigo explicar que `networkFirstNavigation` tenta buscar a navegação na rede, atualiza o cache quando recebe uma resposta válida e utiliza `index.html` ou `/` quando a rede falha.

Consigo explicar que `staleWhileRevalidate` procura a resposta armazenada ao mesmo tempo que solicita uma versão nova. O usuário recebe o cache rapidamente, e `event.waitUntil` mantém a atualização em segundo plano.

Consigo explicar que o evento `fetch` ignora métodos diferentes de GET, solicitações Range e caminhos da API. Isso impede que operações sensíveis ou respostas parciais sejam armazenadas incorretamente.

Consigo explicar que `pwa.js` testa a existência de `navigator.serviceWorker`, aguarda o evento `load`, registra o arquivo com escopo raiz e apresenta uma mensagem no Console se o registro falhar.

### Testes realizados

- `manifest.json` convertido e validado como JSON.
- Campos essenciais do manifesto conferidos.
- Referência ao manifesto confirmada no HTML.
- `theme-color`, favicon e Apple Touch Icon confirmados no HTML.
- Ícone de 192×192 validado como PNG real.
- Ícone de 512×512 validado como PNG real.
- Área segura dos ícones maskable inspecionada.
- Sintaxe de `service-worker.js` validada.
- Sintaxe de `pwa.js` validada.
- Registro de `/service-worker.js` com escopo `/` conferido.
- Página inicial respondendo HTTP 200.
- `index.html`, `styles.css`, `app.js`, `animations.js` e `pwa.js` respondendo HTTP 200.
- `manifest.json`, `service-worker.js` e os dois ícones respondendo HTTP 200.
- Tipos MIME dos recursos conferidos.
- Todos os itens de `APP_SHELL` disponíveis para `cache.addAll`.
- `/api/status` e `/api/anuncios` respondendo HTTP 200.
- Métodos não-GET, requisições Range e rotas `/api` excluídos do cache.
- Limpeza de caches restrita ao prefixo do projeto.
- Servidores temporários encerrados.
- Porta temporária 4173 confirmada como livre.
- Logs temporários de teste removidos.
- Revisão independente concluída para as seis tarefas.
- Teste visual de instalação marcado como pendente por ausência de navegador.
- Console, Network e Application marcados como pendentes pela mesma limitação externa.

### Commit

`feat: antecipar PWA instalável do Dia 10`

## Dia 11 — 03/08/2026

### Objetivo do dia

Validar o fluxo completo de anúncios: criar, listar, filtrar, visualizar anúncios próprios e excluir com segurança. Também conferi o contrato JSON e os códigos HTTP da API, reiniciei o servidor para comprovar a persistência no SQLite e registrei os erros e as correções encontradas.

### Organização entre agentes

O trabalho foi separado entre agentes responsáveis pelos testes de CRUD e filtros, anúncios próprios, respostas JSON e códigos HTTP, reinício e persistência e consolidação deste Diário. A revisão final foi mantida separada das execuções para que as evidências, a limpeza dos dados e as alterações de produto pudessem ser conferidas de forma independente.

### O que eu fiz

Executei testes integrados reais contra instâncias locais isoladas. Foram criados anúncios identificáveis para usuários diferentes, conferidas as listagens geral e filtrada por `categoria` e `usuarioId`, testada a combinação dos dois filtros e validada a remoção dos próprios registros.

O teste de anúncios próprios revelou que a proteção existia apenas no frontend. Antes da correção, Bruno conseguiu excluir pela API o anúncio de Alice: o servidor ignorou a identidade enviada, removeu o registro alheio e respondeu HTTP 200. Essa falha foi corrigida nas três camadas envolvidas.

No frontend, `public/app.js` passou a enviar `X-Usuario-Id` na requisição DELETE e a apresentar mensagens específicas para 401 e 403. Na API, `server.js` passou a exigir a identificação, localizar o anúncio antes da exclusão, comparar o proprietário e responder 401 sem usuário, 403 para outro proprietário, 404 para anúncio inexistente e 200 somente para o dono. No SQLite, `database.js` passou a executar `DELETE FROM anuncios WHERE id = ? AND usuarioId = ?`, impedindo que a exclusão dependa apenas de uma verificação anterior no servidor.

Também verifiquei todas as respostas com corpo quanto ao status, ao `Content-Type`, à possibilidade de leitura por `JSON.parse()` e ao formato esperado. Uma falha interna foi injetada somente em uma cópia temporária do servidor para exercitar o middleware 500 sem alterar o produto ou o banco principal.

Por fim, criei um anúncio no banco real, encerrei efetivamente o processo do servidor, confirmei a linha diretamente no SQLite, iniciei uma segunda instância na mesma porta e recuperei o registro com os mesmos 12 campos. Depois da comprovação, o anúncio foi excluído pela API com a identidade do proprietário e o ambiente ficou limpo.

### Erros encontrados e correções

O erro principal permitia a exclusão de anúncio alheio por uma chamada direta à API. A interface escondia o botão e fazia uma conferência local, mas isso não constituía uma proteção de servidor.

A investigação reproduziu a falha com duas identidades reais e acompanhou o registro antes e depois da requisição. Em seguida, revisei o contrato entre frontend, rota Express e instrução SQL. A correção foi aplicada em profundidade: cabeçalho no cliente, autorização e códigos adequados na API e condição de proprietário na própria exclusão SQL.

Na primeira rodada do teste CRUD, o DELETE retornou 401 porque o teste ainda usava o contrato anterior enquanto a regra de `X-Usuario-Id` era integrada. O teste foi corrigido para enviar o proprietário, cobrir explicitamente 401 e 403 e limpar cada fixture com a identidade correspondente. Os resíduos daquela rodada também foram removidos pela API.

Não foram encontradas outras falhas no contrato JSON/HTTP nem na persistência. Os agentes dessas áreas não modificaram arquivos do produto.

### Como investiguei

Usei marcadores exclusivos e duas identidades para distinguir propriedade, categoria e combinação de filtros. Após cada tentativa de exclusão negada, listei novamente os anúncios para confirmar que o registro continuava presente. Depois de uma exclusão autorizada, confirmei sua ausência e preservei o anúncio do outro usuário.

Para os códigos HTTP, isolei servidor e banco em uma cópia temporária e cobri sucessos, validações, JSON malformado, falta de identificação, conflito de propriedade, recursos inexistentes e erro interno seguro. Para a persistência, identifiquei o PID pelo listener da porta, confirmei seu encerramento e comparei campo a campo as respostas obtidas antes e depois do reinício.

### O que aprendi

Aprendi que esconder uma ação no frontend melhora a experiência, mas não protege um recurso. A autorização precisa ser conferida no servidor e, quando possível, reforçada na operação do banco.

Aprendi que 401 representa a ausência de identificação, 403 indica que o usuário identificado não pode executar a ação e 404 evita tratar como existente um recurso que não foi encontrado. Também aprendi que verificar somente o status não basta: o tipo de conteúdo, o JSON parseável e o formato do corpo fazem parte do contrato.

Aprendi que reiniciar o servidor é uma prova mais forte de persistência do que listar logo após criar. Conferir o arquivo SQLite com o processo parado e reencontrar todos os campos em outra instância distingue dados persistidos de estado mantido em memória.

### Partes principais que eu acho bom explicar

Consigo explicar que `X-Usuario-Id` leva a identidade funcional do usuário atual até a rota de exclusão. A API normaliza esse valor, busca o anúncio, compara `anuncio.usuarioId` com o proprietário informado e somente então solicita a remoção.

Consigo explicar que a condição `WHERE id = ? AND usuarioId = ?` faz a exclusão depender simultaneamente do anúncio e de seu proprietário. Assim, mesmo que a chamada ao banco receba um ID válido com outro usuário, nenhuma linha é removida.

Consigo explicar que o filtro por `usuarioId` alimenta “Meus anúncios”, enquanto o filtro por `categoria` atende o catálogo; os dois podem ser combinados. Também consigo explicar que o SQLite mantém os registros no arquivo `data/marketplace.db`, permitindo que uma nova instância do servidor recupere os mesmos dados.

### Testes realizados

- CRUD, filtros, validações e exclusão: 16 de 16 cenários aprovados.
- Anúncios próprios e autorização: 10 de 10 cenários aprovados após a correção.
- JSON e códigos HTTP: 32 de 32 casos aprovados, incluindo 200, 201, 400, 401, 403, 404 e 500.
- Todas as respostas testadas com corpo usaram `application/json; charset=utf-8` e JSON parseável.
- Filtros por categoria, usuário e combinação dos dois aprovados.
- Exclusão sem identidade rejeitada com 401.
- Exclusão de anúncio alheio rejeitada com 403 e registro preservado.
- Exclusão pelo proprietário aprovada com 200.
- Persistência aprovada após encerramento e reinício reais do servidor.
- Os 12 campos do anúncio permaneceram idênticos depois do reinício.
- Fixtures removidas, banco sem os marcadores de teste, porta liberada e processos temporários encerrados.
- Sintaxe de `server.js`, `database.js` e `public/app.js` validada.

### Limitação do ambiente

O navegador conectado foi solicitado para uma conferência visual do fluxo de “Meus anúncios”, mas o ambiente retornou `No browser is available`. Por isso, a interface foi conferida por inspeção reproduzível do código e os comportamentos foram comprovados pela API; não foi registrada evidência visual de clique, renderização ou DevTools.

Também permanece uma limitação conhecida do produto: `X-Usuario-Id` implementa o contrato funcional de propriedade, mas não substitui autenticação, sessão ou token assinado. Um cliente que conheça o identificador de outro usuário ainda pode falsificar o cabeçalho. Autenticação real é uma evolução futura, fora do escopo da correção mínima do Dia 11.

## Dia 12 — 04/08/2026

### Objetivo do dia

Executar um teste completo do Marketplace Vortex em desktop e mobile, revisar os requisitos da PWA, confirmar que as correções anteriores não causaram regressões, procurar mensagens de erro no Console e percorrer o fluxo principal do início ao fim.

### Organização entre agentes

As frentes de regressão e fluxo completo foram executadas separadamente, e uma auditoria independente consolidou as evidências. Os testes que dependiam de uma sessão real de navegador foram identificados como uma etapa própria, para não confundir validação estrutural com comprovação visual.

### O que eu fiz

Revisei o manifesto, os ícones, o registro e o ciclo de vida do Service Worker. O shell da aplicação continuou disponível, os arquivos obrigatórios mantiveram respostas válidas e a estratégia de cache permaneceu sem interceptar operações da API.

Repeti os testes automatizados das funcionalidades já entregues. O fluxo de anúncios continuou criando, listando, filtrando e excluindo corretamente, inclusive com as regras de propriedade implementadas no Dia 11. Também foram revalidados os contratos JSON, os códigos HTTP e a sintaxe dos arquivos JavaScript.

Ao testar as resoluções de 390×844, 360×800 e 320×568, identifiquei que os anúncios e outros elementos do catálogo ocupavam espaço vertical excessivo. Criei um breakpoint específico para telas de até 26 rem e compactei cabeçalho, seções, filtros, cartões, formulários, modais e rodapé. No catálogo mobile, os filtros passaram a usar uma faixa horizontal e a mídia dos anúncios recebeu altura controlada para preservar espaço para as informações principais.

Como o Service Worker podia manter uma folha de estilos anterior no cache, atualizei a versão do cache estático para `marketplace-vortex-static-v3`. Isso força a renovação dos arquivos do shell depois da atualização do Service Worker.

### Resultados

Os testes automatizados de regressão foram aprovados em 69 de 69 cenários. O fluxo integrado da API foi aprovado, e as validações de sintaxe e da estrutura da PWA também passaram. O cache `v3` foi criado, utilizado e limpo corretamente no teste isolado do Service Worker.

A responsividade ficou melhor após os ajustes, mas a avaliação visual mostrou que ainda há espaço para refinamento, principalmente na proporção dos cartões e na densidade das informações em telas pequenas.

### Partes principais que eu acho bom explicar

Consigo explicar que o breakpoint de 26 rem atende as três larguras críticas sem alterar o layout das telas maiores. Dentro dele, tamanhos, espaçamentos e alturas são reduzidos de forma coordenada, evitando que apenas um componente fique menor enquanto o restante continue ocupando espaço demais.

Consigo explicar que a alteração do nome do cache invalida a versão estática anterior. No evento `activate`, o Service Worker remove caches antigos do Marketplace Vortex; nas próximas requisições, o navegador passa a receber os arquivos da versão atual.

Consigo explicar que testes estruturais confirmam manifesto, ícones, rotas e lógica do Service Worker, mas a instalação pelo navegador e a aparência em cada viewport precisam de uma sessão visual real para serem comprovadas.

### Testes realizados

- Regressão automatizada: 69 de 69 cenários aprovados.
- Fluxo completo da API aprovado do início ao fim.
- Criação, listagem, filtros, anúncios próprios e exclusão novamente validados.
- Respostas JSON e códigos HTTP novamente validados.
- Sintaxe dos arquivos JavaScript aprovada.
- Manifesto, referências de ícones e registro do Service Worker conferidos.
- Ciclo de cache do Service Worker aprovado com `marketplace-vortex-static-v3`.
- Estrutura mobile revisada para 390×844, 360×800 e 320×568.
- Alterações verificadas sem erros de espaços ou conflitos no diff.

### Limitação do ambiente

O ambiente automatizado não disponibilizou um navegador conectado para concluir a instalação da PWA, capturar o Console em execução e executar toda a conferência visual de desktop e mobile. Essas etapas foram registradas como bloqueadas pela ferramenta, e não como aprovadas sem evidência.

### Observação para a revisão final

Antes de encerrar o projeto, devo voltar à responsividade e fazer uma nova rodada visual em navegador real nas resoluções 390×844, 360×800 e 320×568. É importante refinar principalmente altura e proporção dos cartões, espaçamentos e hierarquia tipográfica do catálogo. A responsividade melhorou neste dia, mas ainda não deve ser considerada finalizada.

### Commit

`fix: ajustar responsividade mobile do Dia 12`

## Dia Bônus 1 — 28/07/2026

### Objetivo do dia

Antecipar somente a primeira etapa dos requisitos bônus, originalmente planejada para 29/07/2026, preparando a base do frontend com Vite e TypeScript, organizando os comandos do projeto e separando a criação da aplicação Express da abertura da porta HTTP. Também registrei o estado inicial, preservei as alterações e o banco já existentes e deixei uma base testável para os próximos dias, sem iniciar PostgreSQL, JWT, a nova estratégia de cache offline ou qualquer deploy.

### Organização entre agentes

O trabalho foi dividido entre seis agentes de tarefa, um para cada frente independente do Dia Bônus 1: levantamento do baseline e preservação do estado existente; configuração do Vite; configuração inicial do TypeScript; scripts e dependências; separação entre aplicação e bootstrap do Express; e testes, variáveis de ambiente e conferências de integração.

Como o ambiente permitia um número limitado de agentes simultâneos, eles trabalharam em rodadas e sobre arquivos com responsabilidades distintas para reduzir conflitos. Depois da integração, um agente extra atuou como revisor independente. Ele conferiu as entregas diretamente no repositório, repetiu os comandos de validação, verificou as respostas HTTP, confirmou a preservação de `public/app.js` e do SQLite e separou limitações históricas de falhas introduzidas neste dia.

### O que eu fiz

Primeiro, registrei o baseline do projeto e identifiquei as mudanças locais que já pertenciam ao desenvolvimento anterior. A alteração existente em `public/app.js` foi tratada como conteúdo do usuário e preservada literalmente durante toda a reorganização. O arquivo SQLite também foi mantido sem migração, limpeza ou regravação, e seu hash permaneceu igual ao do início da atividade.

Criei uma entrada `index.html` na raiz para o Vite e mantive a interface já construída. Configurei `vite.config.ts` com proxy de `/api` para `http://localhost:3000`, permitindo desenvolver o frontend na porta 5173 sem trocar o contrato atual da API. Adicionei `src/main.ts` como uma entrada TypeScript neutra, sem antecipar a conversão funcional dos scripts autorais prevista para o Dia Bônus 2.

Criei `tsconfig.json` com modo estrito e `noImplicitAny`, preparando a verificação com `tsc --noEmit`. Nesta primeira etapa, o TypeScript foi introduzido como infraestrutura, sem converter antecipadamente `app.js`, `animations.js`, `pwa.js` ou o Service Worker.

Atualizei os scripts do `package.json` para disponibilizar `dev:web`, `dev:api`, `typecheck`, `build`, `test`, `migrate` e `start`. O comando `migrate` ficou intencionalmente como um aviso de que as migrações serão implementadas no Dia Bônus 3. Mantive apenas as dependências necessárias para esta etapa: Express como dependência da aplicação e Vite, TypeScript e os tipos do Node como dependências de desenvolvimento.

Separei o backend em dois papéis. `api.js` passou a criar, configurar e exportar a aplicação Express sem chamar `listen`. `server.js` ficou responsável pelo bootstrap, pela porta e pela inicialização do servidor quando executado diretamente. Essa separação permite importar a API em testes sem abrir uma porta.

Criei `tests/api-import.test.js`, que intercepta uma eventual chamada a `listen`, importa `api.js` e confirma que o módulo exporta uma aplicação Express sem criar servidor de rede. Também criei `.env.example` somente com `PORT` e `VITE_API_URL`, sem adicionar segredos ou variáveis que pertencem aos próximos dias, e ajustei o `.gitignore` para os artefatos locais da nova ferramenta.

Depois da revisão, os servidores locais foram iniciados novamente para que a interface pudesse ser vista. O frontend ficou disponível em `http://localhost:5173` e a API em `http://localhost:3000`, com respostas HTTP 200 confirmadas.

### Principais prompts usados

**Prompt 1 — Restrição ao primeiro dia bônus**

> Faça tudo na ordem estabelecida no plano. Hoje implemente apenas o que está previsto para ser construído no Dia Bônus 1: registrar o baseline, preservar o diff de `public/app.js`, preparar Vite e TypeScript, adicionar os scripts, separar o Express do `listen`, criar `.env.example`, configurar o proxy local e validar os critérios do dia. Não antecipe PostgreSQL, JWT, cache offline novo ou deploy.

**Prompt 2 — Organização entre agentes**

> Para cada tarefa do Dia Bônus 1, crie um agente de IA responsável e, ao final, use um agente extra para revisar se todas as tarefas foram feitas corretamente.

**Prompt 3 — Preservação do trabalho existente**

> Preserve integralmente a alteração local existente em `public/app.js` e não migre, apague ou modifique o SQLite. A reorganização para Vite deve manter o comportamento e o conteúdo já construídos.

**Prompt 4 — Critérios de validação**

> Confirme que a interface abre pelo Vite, que a API inicia separadamente, que os testes importam o Express sem abrir porta, que `npm run build` produz `dist` e que o diff anterior do usuário permanece preservado.

### Resposta da IA

A IA começou inspecionando o repositório e separou fatos do estado atual das tarefas que pertenciam aos dias seguintes. Em vez de iniciar a conversão completa do frontend ou a migração do banco, limitou a implementação à infraestrutura do Dia Bônus 1.

Os agentes organizaram a entrada Vite, o TypeScript estrito, os scripts, o backend testável e os arquivos de apoio. A interface existente foi reaproveitada, e a entrada TypeScript permaneceu neutra para não introduzir uma refatoração funcional antecipada.

O agente responsável pelo backend extraiu a aplicação Express para `api.js` e reduziu `server.js` ao bootstrap. O agente de testes criou uma verificação permanente que prova que importar a aplicação não abre uma porta. Os demais agentes conferiram a configuração, o baseline e a preservação dos arquivos existentes.

O revisor final repetiu `typecheck`, build, testes, auditoria e smoke tests HTTP. Ele classificou as entregas do Dia Bônus 1 como aprovadas, registrou separadamente o runner histórico incompatível com a nova localização do HTML e confirmou que os avisos de whitespace pertenciam ao conteúdo original preservado do usuário.

### O que funcionou

O frontend passou a ser servido pelo Vite na porta 5173, mantendo a interface existente e encaminhando chamadas `/api` para a API local na porta 3000.

O TypeScript estrito foi introduzido sem exigir que a conversão completa dos scripts do frontend fosse feita antes do Dia Bônus 2. A entrada `src/main.ts` participa corretamente do build e serve como ponto inicial para a próxima etapa.

A aplicação Express pode ser importada por testes sem abrir uma porta. Ao mesmo tempo, `npm start` e `npm run dev:api` continuam oferecendo um bootstrap explícito para executar o servidor.

Os scripts de verificação e build funcionaram, e o Vite produziu o diretório `dist`. O teste permanente foi aprovado e a auditoria das dependências não encontrou vulnerabilidades.

O diff local de `public/app.js` foi preservado literalmente. O SQLite permaneceu intacto, comprovado pela manutenção do mesmo hash.

Após a conclusão, o frontend e a API foram iniciados para visualização e ambos responderam HTTP 200 nos endereços locais informados.

### Erros encontrados

O runner histórico de regressão ainda procura `public/index.html`. Como a entrada principal foi movida para `index.html` na raiz para atender ao Vite, esse runner não acompanha a nova estrutura e falha por caminho inexistente. A aplicação, o build e o teste permanente novo não apresentam esse problema. A atualização do runner histórico ficou registrada como limitação conhecida, sem ampliar o escopo do primeiro dia.

O `git diff --check` geral ainda aponta trailing whitespace em `public/app.js`. Esses espaços pertencem à alteração original do usuário, já existiam antes da atividade e foram preservados deliberadamente. Não foram tratados como defeito criado no Dia Bônus 1 porque removê-los alteraria o diff que precisava permanecer literal.

Durante a revisão, os servidores temporários usados nos smoke tests foram encerrados e as portas ficaram livres. Posteriormente, eles foram iniciados novamente a pedido do usuário para permitir a visualização do frontend; isso não altera as evidências da revisão.

### Como investiguei

Comparei o estado do Git antes e depois da reorganização para distinguir alterações preexistentes das entregas do dia. Conferi especialmente `public/app.js`, evitando qualquer normalização automática que pudesse reescrever o conteúdo, e comparei o hash do arquivo SQLite.

Revisei a relação entre `index.html`, `src/main.ts`, `vite.config.ts` e `tsconfig.json`. Confirmei que a entrada da raiz é processada pelo Vite, que o TypeScript participa do build e que o proxy preserva o caminho `/api` usado pela aplicação.

Inspecionei a divisão entre `api.js` e `server.js` e executei o teste que monitora chamadas a `express.application.listen` e handles de rede ativos. Isso demonstrou que a importação da aplicação não tem o efeito colateral de abrir uma porta.

Executei os comandos de typecheck, build, teste e auditoria. Em seguida, iniciei frontend e backend em processos locais, solicitei a página inicial e `/api/status` pelo proxy e confirmei HTTP 200.

Para as limitações, rastreei a referência fixa do runner histórico a `public/index.html` e associei os avisos do `git diff --check` às linhas preexistentes de `public/app.js`, sem aplicar correções que violassem a preservação solicitada.

### O que aprendi

Aprendi que o Vite utiliza `index.html` na raiz como parte do grafo da aplicação e que o proxy de desenvolvimento permite manter frontend e backend em portas diferentes sem espalhar URLs locais pelo código.

Aprendi que ativar o modo estrito do TypeScript pode ser feito antes da conversão completa, desde que a entrada inicial seja pequena e que cada etapa futura seja convertida conscientemente. Isso permite introduzir a ferramenta sem misturar infraestrutura e mudança funcional no mesmo dia.

Aprendi que criar a aplicação Express e abrir uma porta são responsabilidades diferentes. Separá-las permite testar rotas por importação e evita servidores involuntários durante uma suíte automatizada.

Aprendi que um baseline também inclui mudanças ainda não commitadas. Preservar o trabalho do usuário exige identificar essas mudanças antes de mover arquivos ou executar ferramentas que possam formatá-las.

Aprendi que uma falha em um runner histórico pode representar uma suposição desatualizada do teste, e não necessariamente uma falha do produto. A evidência precisa indicar qual caminho o runner esperava e qual estrutura o projeto passou a adotar.

### Partes principais que eu acho bom explicar

Consigo explicar que `vite.config.ts` envia requisições iniciadas por `/api` ao servidor da porta 3000. Para o navegador, a chamada continua parecendo vir do frontend local, enquanto o Vite cuida do encaminhamento durante o desenvolvimento.

Consigo explicar que `tsconfig.json` ativa `strict` e `noImplicitAny`, fazendo o compilador sinalizar valores sem tipos seguros. `npm run typecheck` verifica os tipos sem gerar arquivos, enquanto `npm run build` produz a versão estática em `dist`.

Consigo explicar que `api.js` exporta o objeto Express já configurado, mas não chama `listen`. `server.js` importa esse objeto e só abre a porta quando é executado como programa principal. Por isso, testes podem importar a API sem iniciar um servidor.

Consigo explicar que `tests/api-import.test.js` substitui temporariamente o método `listen`, conta eventuais chamadas, importa a API e verifica os handles de rede. O teste passa apenas quando a importação não abre uma porta.

Consigo explicar que `.env.example` documenta apenas nomes e exemplos públicos de desenvolvimento. Segredos como conexão PostgreSQL e chave JWT não foram adicionados porque pertencem a etapas posteriores e nunca devem receber valores reais em um arquivo versionado.

### Testes realizados

- Regressão integrada do baseline, executada antes da reorganização: 21 de 21 cenários aprovados.
- Baseline do projeto inspecionado antes das alterações do Dia Bônus 1.
- Alteração preexistente de `public/app.js` preservada literalmente.
- Hash do SQLite conferido e mantido.
- `npm run typecheck` aprovado.
- `npm run build` aprovado e diretório `dist` produzido.
- `npm test` aprovado: 1 de 1 teste.
- Importação de `api.js` confirmada sem chamada a `listen`.
- Importação de `api.js` confirmada sem servidor de rede ativo.
- `npm audit` aprovado com zero vulnerabilidades.
- Frontend Vite respondendo HTTP 200.
- `/api/status` pelo proxy do Vite respondendo HTTP 200.
- API direta na porta 3000 respondendo HTTP 200.
- Scripts `dev:web`, `dev:api`, `typecheck`, `build`, `test`, `migrate` e `start` conferidos.
- `tsconfig.json` conferido com TypeScript estrito e `noImplicitAny`.
- `.env.example` conferido sem segredos.
- Processos temporários encerrados e portas liberadas durante a revisão.
- Servidores locais posteriormente iniciados nas portas 5173 e 3000 para visualização pelo usuário.
- Revisão independente concluída após as seis frentes de tarefa.

### Limitações e próximo passo

O runner histórico de regressão ainda precisa ser adaptado para procurar o novo `index.html` na raiz ou receber o caminho por configuração. Essa atualização não foi feita neste dia para manter a execução limitada às entregas planejadas.

O `git diff --check` geral continuará registrando trailing whitespace enquanto a alteração original de `public/app.js` for preservada literalmente. Uma eventual limpeza deve ser decidida separadamente para não misturar o conteúdo do usuário com a infraestrutura criada neste dia.

PostgreSQL, migrations reais, JWT, cadastro e login, validação com Zod, a nova estratégia de cache offline, deploy no Neon, Render e Vercel e a conversão completa dos scripts do frontend ficaram explicitamente fora do Dia Bônus 1.

O próximo passo planejado é o Dia Bônus 2: converter os scripts autorais do frontend para TypeScript, criar os tipos compartilhados, configurar o Service Worker TypeScript com `injectManifest` e preservar o comportamento atual.

### Commit

`f48f812` — `feat: preparar base TypeScript do Dia Bônus 1`

## Dia Bônus 2 — 28/07/2026

### Objetivo do dia

Converter integralmente o frontend autoral para TypeScript estrito, mantendo HTML, CSS e DOM nativos e preservando o comportamento existente. A etapa também deveria introduzir unions e contratos compartilhados, tornar seguras as fronteiras de `fetch` e migrar o registro PWA e o Service Worker para TypeScript com `injectManifest`.

### Organização entre agentes

O trabalho foi dividido entre quatro agentes especializados: DOM e eventos; unions e modelos; `fetch`, respostas e erros; e tipos do contexto Web Worker. Como havia três vagas simultâneas para subagentes, as frentes foram executadas em ondas para impedir edições concorrentes em `src/app.ts`.

Depois da integração, um quinto agente realizou a revisão independente de todo o Dia Bônus 2. Ele comparou a implementação com o plano, conferiu a compatibilidade com a API SQLite atual, auditou a ausência de escapes de tipagem e repetiu typecheck, build, testes e smoke tests HTTP.

### O que eu fiz

Migrei `public/app.js`, `public/animations.js`, `public/pwa.js` e `public/service-worker.js` para `src/app.ts`, `src/animations.ts`, `src/pwa.ts` e `src/service-worker.ts`. `src/main.ts` passou a importar os três módulos executados na janela, e `index.html` deixou de carregar os scripts JavaScript antigos.

Em `src/types.ts`, criei unions fechadas para categorias, condições e modalidades, além dos tipos de filtros, abas e ordenação. Também defini os contratos `Usuario`, `Sessao`, `Anuncio`, `ErroApi`, `RespostaOffline`, anúncios novos, coleções e a identidade legada ainda usada antes da autenticação. Constantes e guardas de runtime permitem validar valores originados do DOM, armazenamento local e HTTP.

Os elementos DOM receberam tipos concretos de formulário, input, select, botão, dialog, imagem e contêiner. Os eventos usam tipos específicos e estreitamento de `EventTarget`. A conversão não usa `any`, `@ts-ignore` ou `@ts-expect-error`.

A função de rede passou a ser genérica e exige um decodificador para cada resposta. O JSON é tratado inicialmente como `unknown`, e anúncios, listas e respostas de exclusão só entram na aplicação depois de validação. Criei uma classe de erro HTTP com guarda própria e normalizei tanto o envelope definitivo `ErroApi` quanto as respostas legadas da API atual. O cabeçalho `X-Vortex-Offline` também passou a ter detecção tipada.

O Service Worker usa `ServiceWorkerGlobalScope`, `FetchEvent`, `ExtendableEvent` e `ExtendableMessageEvent`. Adicionei `vite-plugin-pwa` e configurei a estratégia `injectManifest`. O build gera `dist/service-worker.js` e injeta seis entradas: HTML, CSS, bundle hashado, manifesto e os dois ícones. O comportamento de cache existente foi preservado; a estratégia completa de catálogo offline continua reservada ao Dia Bônus 6.

### O que funcionou

Não restam scripts frontend autorais em JavaScript. O bundle principal, o registro PWA, as animações e o Service Worker agora são produzidos a partir dos arquivos TypeScript em `src`.

O TypeScript estrito aprovou todos os módulos sem `any`, supressões ou casts duplos inseguros. O revisor confirmou que os 82 métodos funcionais do frontend anterior continuam presentes e que as adições se concentram em tipos, guardas, validadores e decodificadores.

O build PWA foi aprovado. O `injectManifest` substituiu corretamente `self.__WB_MANIFEST`, sem deixar o placeholder no arquivo final. Todas as referências locais encontradas em `dist/index.html` existem.

O preview local respondeu HTTP 200 para a página, bundle hashado, CSS, manifesto, Service Worker e ícones de 192 e 512 pixels. A API atual respondeu HTTP 200 em `/api/status`, e o revisor confirmou também o catálogo pelo smoke HTTP.

### Como investiguei

Comparei os contratos atuais de `server.js` com os tipos usados pelo frontend, mantendo a compatibilidade temporária com autoria e envelopes de erro legados. Dados externos só são convertidos para os tipos internos depois de verificações de estrutura, valores das unions e campos obrigatórios.

Auditei `src` e a configuração Vite em busca de `any`, supressões do compilador, casts duplos e referências aos scripts JavaScript removidos. Também conferi o conteúdo gerado de `dist/service-worker.js`, a lista injetada pelo Workbox e os caminhos emitidos em `dist/index.html`.

Depois do build, servi `dist` com o preview do Vite e solicitei individualmente a página e os recursos locais. A revisão final repetiu os comandos principais e verificou a paridade estrutural entre o frontend anterior e a versão TypeScript.

### O que aprendi

Aprendi que tipar o DOM exige selecionar o subtipo correto de cada elemento e ainda tratar a possibilidade de ele não existir. Eventos continuam entregando `EventTarget`, portanto o código precisa estreitar o alvo antes de acessar propriedades específicas de inputs, botões e selects.

Aprendi que unions derivadas de tuplas `as const` podem servir simultaneamente como contrato estático e fonte para guardas de runtime. Isso evita que valores arbitrários vindos de atributos `data-*`, formulários ou JSON sejam aceitos apenas por meio de casts.

Aprendi que declarar o retorno de `response.json()` como um tipo de domínio não valida a resposta. A fronteira segura recebe `unknown`, verifica a estrutura e somente então devolve `Anuncio` ou outro contrato conhecido.

Aprendi que erros capturados também são `unknown`. Uma classe de erro HTTP e uma guarda própria permitem acessar status e envelope com segurança, sem assumir que toda falha é uma instância comum de `Error`.

Aprendi que o código do Service Worker executa fora do contexto de `Window` e precisa dos tipos de Web Worker. Também confirmei que `injectManifest` depende do ponto literal `self.__WB_MANIFEST` e que a injeção deve ser comprovada no artefato final, não apenas pela configuração.

### Testes realizados

- `npm run typecheck` aprovado.
- `npm run build` aprovado.
- `npm test` aprovado: 1 de 1 teste.
- Nenhum `any`, `@ts-ignore`, `@ts-expect-error` ou cast duplo inseguro encontrado.
- Nenhum script frontend autoral em JavaScript restante.
- Paridade estrutural dos 82 métodos funcionais anteriores confirmada.
- Compatibilidade com os contratos da API SQLite atual confirmada.
- `dist/service-worker.js` gerado com seis entradas injetadas.
- Placeholder `self.__WB_MANIFEST` ausente do artefato final.
- Referências locais do build existentes.
- Página, bundle, CSS, manifesto, Service Worker e dois ícones respondendo HTTP 200 no preview local.
- `/api/status` e catálogo respondendo HTTP 200 no smoke test.
- `git diff --check` sem erros; apenas avisos informativos de LF para CRLF.
- Revisão independente concluída depois das quatro frentes.

### Limitações e próximo passo

O ambiente não disponibilizou um navegador conectado. Por isso, carregamento visual, Console, interação completa dos formulários, animações, instalação PWA e conferência visual de desktop/mobile não foram marcados como aprovados. O build, a auditoria estrutural e o smoke HTTP cobriram o que era verificável nesta sessão.

O preview inicial na Vercel não foi publicado porque o repositório não está vinculado a um projeto autenticado da Vercel nesta sessão. Esse passo exige a conta e a autorização externa previstas nas premissas do plano. O preview local não substitui essa evidência.

O próximo passo planejado é o Dia Bônus 3: criar PostgreSQL no Neon, migrations idempotentes e substituir o acesso SQLite por consultas assíncronas com `pg`, preservando o banco local como histórico.

### Commit

`feat: converter frontend para TypeScript`

## Dia Bônus 3 — 28/07/2026

### Objetivo do dia

Antecipar a etapa planejada originalmente para 31/07/2026 e substituir a persistência SQLite da aplicação por PostgreSQL no Neon. O trabalho deveria criar ambientes isolados de desenvolvimento, teste e produção, implementar migrations idempotentes, converter banco e rotas para fluxo assíncrono, preservar os DTOs usados pelo frontend e manter o SQLite local apenas como histórico, sem importar seus dados.

### Organização entre agentes

O trabalho foi dividido em sete frentes: ambientes Neon; runner de migrations; schema das tabelas; substituição de `node:sqlite` por `pg`; conversão das rotas para `async/await`; compatibilidade dos DTOs; e preservação do SQLite. Como o ambiente permitia somente três subagentes simultâneos, as tarefas foram executadas em ondas e os agentes receberam arquivos ou responsabilidades separados para reduzir conflitos.

Depois da integração, um agente extra realizou a revisão independente do Dia Bônus 3. Ele auditou o plano, o diff completo, as migrations, o acesso PostgreSQL, as rotas, os contratos HTTP, os testes e a preservação do banco histórico. A revisão encontrou uma incompatibilidade entre os identificadores legados `usuario-<uuid>` e a nova coluna UUID, adicionou validação explícita e criou um smoke test PostgreSQL opt-in.

### O que eu fiz

Criei dois projetos gratuitos no Neon, ambos com PostgreSQL 18, região AWS South America East 1 (São Paulo) e Neon Auth desativado. O projeto `marketplace-vortex-nonproduction` possui `development` como branch padrão e `test` como branch filha permanente, sem expiração automática. O projeto `marketplace-vortex-production` possui somente a branch `production`, isolando os dados publicados das rotinas locais e de teste.

As credenciais das branches não produtivas foram redefinidas depois que a primeira senha apareceu durante a leitura técnica da interface. As URLs anteriores ficaram inválidas. As conexões finais foram armazenadas apenas em `.env` e `.env.production.local`, ambos ignorados pelo Git. Nenhuma senha, URL real ou endpoint Neon foi incluído no commit, na documentação ou nas mensagens finais.

Criei `scripts/migrate.js`. O runner exige `DATABASE_URL_DIRECT`, descobre arquivos SQL em ordem lexicográfica, usa advisory lock para impedir duas execuções concorrentes, cria `schema_migrations` e registra nome, checksum e data de aplicação. Cada migration roda em sua própria transação; o registro só é inserido depois do SQL bem-sucedido e na mesma transação. Em caso de erro, o runner executa rollback, libera o cliente e encerra o pool.

Criei `migrations/001_create_usuarios.sql` e `migrations/002_create_anuncios.sql`. `usuarios` usa UUID gerado pelo PostgreSQL, nome, e-mail normalizado e único, hash da senha e data de criação. `anuncios` usa ID identity, `NUMERIC(12,2)`, enums por constraints, limites de preço e texto, proprietário UUID com chave estrangeira e timestamp com fuso. Índices atendem ordenação, categoria e proprietário.

Substituí `node:sqlite` por `pg` em `database.js`. As consultas usam `Pool`, placeholders `$1` a `$9` e `JOIN` com `usuarios` para obter o nome do autor. O mapeamento converte `NUMERIC` explicitamente para número e transforma os nomes `snake_case` do banco nos campos camelCase esperados pelo frontend: `imagemUrl`, `usuarioId`, `usuarioNome` e `criadoEm`.

Converti as rotas de catálogo para `async/await`. O Express 5 encaminha rejeições assíncronas ao middleware de erro, e `/api/status` passou a executar `SELECT 1`, respondendo 200 quando o PostgreSQL está disponível e 503 com mensagem segura quando a conexão falha.

Mantive temporariamente os campos de autoria no contrato anterior ao JWT, mas passei a exigir UUID válido nos filtros, na criação e no cabeçalho de exclusão. Assim, IDs legados são rejeitados com 400 antes de chegar ao cast UUID do PostgreSQL, evitando respostas 500. A autoria definitiva derivada do token continua reservada ao Dia Bônus 4.

Adicionei testes para o runner, fluxo assíncrono da API, mapeamento dos DTOs, preservação do SQLite e integração real com PostgreSQL. O smoke test usa somente `TEST_DATABASE_URL`, recusa uma URL igual às conexões normais, aplica migrations, cria uma fixture UUID, exerce CRUD, filtros e persistência entre conexões e remove apenas a fixture ao final.

### Provisionamento e migrations reais

As migrations foram executadas duas vezes em `development` e `production`. Na primeira execução, os dois arquivos foram aplicados; na segunda, ambos foram reconhecidos como já aplicados, sem duplicação.

Na branch `test`, o smoke test aplicou as mesmas migrations e executou criação, listagem, filtro por categoria, filtro por usuário, exclusão e verificação após nova conexão. A fixture e seus anúncios foram removidos no encerramento.

Ao final, uma consulta direta confirmou:

- `development`: 2 migrations, 0 usuários e 0 anúncios;
- `test`: 2 migrations, 0 usuários e 0 anúncios;
- `production`: 2 migrations, 0 usuários e 0 anúncios.

O PostgreSQL publicado começou vazio, como decidido no plano. Nenhum registro do SQLite foi copiado.

### O que funcionou

Os três ambientes Neon ficaram realmente provisionados e separados. A API conectou à URL pooled de `development`, `/api/status` respondeu 200 e o catálogo vazio respondeu 200.

O runner comprovou idempotência tanto em testes unitários quanto nas execuções reais do Neon. Checksums impedem que uma migration já aplicada seja alterada silenciosamente, e o advisory lock protege contra inicializações concorrentes.

O contrato do catálogo permaneceu compatível com `src/types.ts`. O ID e o valor chegam ao frontend como números, o timestamp chega em ISO e nenhum nome `snake_case` vaza na resposta.

As consultas são parametrizadas e os filtros não alteram a estrutura do SQL. O nome do autor vem do `JOIN`, não do valor `usuarioNome` enviado pelo cliente.

O arquivo `data/marketplace.db` permaneceu com 593.920 bytes e SHA-256 `B7E8D41AA13A0D25BA6E3A0310C9F282BF13031120938AD593D0B96539D7D1B5`. Ele continua ignorado pelo Git, e nenhum código executável contém importador SQLite.

### Erros encontrados

Na primeira tentativa de migration após redefinir as senhas não produtivas, a interface do Neon ainda mantinha a URL antiga no modal. O PostgreSQL rejeitou a conexão com `28P01`, sem aplicar migration parcial. Reconstruí as URLs usando as novas senhas, repeti a conexão e as migrations passaram.

Na primeira tentativa de produção, a conexão havia sido capturada enquanto a senha ainda aparecia mascarada. A autenticação foi rejeitada antes de qualquer alteração. Esperei o estado visível correto da interface, recapturei as URLs e executei as migrations com sucesso.

O primeiro smoke real encontrou um erro no próprio teste: `.map(({ id }))` tentava acessar uma variável inexistente. Corrigi para `.map(({ id }) => id)` e repeti a suíte. Depois da correção, os 18 testes passaram, incluindo a integração real.

O driver `pg` emitiu um aviso de compatibilidade futura relacionado a `sslmode=require`. Na versão atual, o modo continua verificando o certificado como esperado. O aviso deve ser revisto antes de uma futura atualização para `pg` 9, sem remover os parâmetros SSL fornecidos pelo Neon nesta etapa.

### Como investiguei

Comparei o schema planejado com os contratos de `src/types.ts` e com os campos usados por `src/app.ts`. Isso mostrou que `valor` precisava de conversão explícita e que o nome do autor deveria continuar disponível no DTO, embora deixasse de ser duplicado na tabela.

Usei mocks do banco para comprovar que as rotas aguardam as Promises e preservam validações, status e corpos. Um teste específico força uma rejeição assíncrona e confirma que o middleware retorna 500 sem expor detalhes internos.

Para o Neon, conferi projetos, região, versão, branches e estado do Neon Auth diretamente no painel. As credenciais foram manipuladas sem registrá-las no repositório. Depois, executei as migrations e consultei apenas contagens de `schema_migrations`, `usuarios` e `anuncios`.

Auditei o código executável em busca de `node:sqlite`, `sqlite3`, `better-sqlite3`, `marketplace.db` e importadores. Também confirmei as regras `data/*.db` e `data/*.db-*` no `.gitignore` e repeti a verificação do arquivo histórico.

### O que aprendi

Aprendi que o driver `pg` trabalha de forma assíncrona e que valores `NUMERIC` são devolvidos como texto por padrão. O contrato HTTP só permanece correto quando a camada de mapeamento converte o valor conscientemente.

Aprendi que migrations precisam de mais que `CREATE TABLE`: ordem, transação, registro, checksum, lock e fechamento de conexões fazem parte da confiabilidade do processo.

Aprendi que branches do Neon isolam o estado do banco, mas senhas redefinidas em uma branch não devem ser presumidas como atualizadas automaticamente nas demais. Cada URL precisa ser validada no ambiente ao qual pertence.

Aprendi que uma migration idempotente não significa repetir livremente o SQL do arquivo. O runner aplica cada arquivo uma vez e, nas execuções seguintes, confirma o checksum registrado sem recriar a estrutura.

Aprendi que um schema definitivo com UUID cria uma transição incompatível com identificadores legados. A solução segura foi rejeitar esses IDs e deixar a criação de usuários e a autoria pelo token para a etapa JWT, em vez de inserir usuários falsos ou enfraquecer a chave estrangeira.

### Partes principais que eu acho bom explicar

Consigo explicar que `DATABASE_URL` usa o endpoint pooled da API, enquanto `DATABASE_URL_DIRECT` usa a conexão direta para migrations. `TEST_DATABASE_URL` aponta exclusivamente para a branch `test` e nunca deve ser igual a uma conexão de desenvolvimento ou produção.

Consigo explicar que `schema_migrations` guarda o arquivo e seu checksum. Se o arquivo já foi aplicado com o mesmo conteúdo, ele é ignorado; se o conteúdo mudou, o runner falha para impedir divergência silenciosa.

Consigo explicar que placeholders como `$1` e `$2` separam dados da estrutura SQL. Mesmo que um filtro contenha caracteres especiais, ele continua sendo tratado como valor, não como parte do comando.

Consigo explicar que a tabela `anuncios` guarda `usuario_id`, enquanto `usuarioNome` é construído no `SELECT` por meio do `JOIN` com `usuarios`. Isso evita inconsistência entre um usuário e cópias antigas de seu nome.

Consigo explicar que o SQLite foi preservado como arquivo histórico, mas desapareceu completamente do caminho executável da aplicação. O PostgreSQL começou vazio e recebeu somente schema e fixtures temporárias de teste.

### Testes realizados

- Migrations reais executadas duas vezes em `development`.
- Migrations reais executadas duas vezes em `production`.
- Migrations e smoke real executados na branch isolada `test`.
- `npm test` aprovado: 18 de 18 testes, nenhum ignorado.
- CRUD PostgreSQL real aprovado com fixture UUID.
- Filtros por categoria e usuário aprovados.
- Exclusão e limpeza da fixture aprovadas.
- Persistência entre conexões aprovada.
- `/api/status` contra o Neon respondendo 200.
- `/api/anuncios` contra `development` respondendo 200 com lista vazia.
- `npm run typecheck` aprovado.
- `npm run build` aprovado.
- `node --check` aprovado para os arquivos JavaScript alterados.
- `git diff --check` aprovado.
- Auditoria sem credenciais reais em arquivos versionados.
- `development`, `test` e `production` confirmados com 2 migrations, 0 usuários e 0 anúncios.
- SQLite preservado sem leitura, importação, alteração ou remoção.
- Revisão independente concluída após as sete frentes.

### Limitações e próximo passo

O frontend ainda usa a identidade legada `usuario-<uuid>` e, portanto, não deve publicar anúncios no schema definitivo até a implementação da autenticação. Essa transição é intencional: o Dia Bônus 4 criará cadastro, login, JWT e autoria derivada exclusivamente do token.

A API ainda não foi publicada no Render e as conexões de produção ainda não foram cadastradas no serviço de hospedagem. Isso pertence ao Dia Bônus 5. O banco de produção já possui o schema, mas permanece vazio.

O próximo passo planejado é o Dia Bônus 4: implementar autenticação JWT, hash de senha, autorização, Zod e o envelope uniforme de erros.

### Commit

`55d1736` — `feat: concluir dia bonus 3 com PostgreSQL no Neon`

## Dia Bônus 5 — 28/07/2026

### Objetivo do dia

Publicar a API no plano gratuito do Render e conectar o frontend à autenticação JWT implementada na etapa anterior. O trabalho deveria fixar o runtime Node 24, executar migrations durante a inicialização, configurar as variáveis de produção, substituir a identidade local por cadastro e login acessíveis, persistir a sessão apenas na aba, enviar Bearer nas rotas protegidas e preservar as coleções antigas por meio de uma importação explícita e não destrutiva.

### Organização entre agentes

Cada uma das doze entregas do plano foi atribuída a um agente separado. Como havia somente três vagas simultâneas para subagentes, o trabalho foi executado em ondas e as tarefas que alteravam `render.yaml` ou `src/app.ts` foram mantidas em sequência para evitar sobrescritas concorrentes.

As frentes foram: manifesto Render; Node 24; comando de build; comando de inicialização; variáveis de produção; deploy e health check; dialog de cadastro/login; `sessionStorage`; Bearer; aviso de cold start; coleções por UUID; e importação da identidade legada. Depois da conclusão e do deploy, um agente adicional realizou uma revisão independente de todo o Dia Bônus 5.

### O que eu fiz

Criei `render.yaml` com um Web Service Node gratuito chamado `marketplace-vortex-api`, health check em `/api/status`, `buildCommand: npm ci` e `startCommand: npm run migrate && npm start`. As variáveis `DATABASE_URL`, `DATABASE_URL_DIRECT`, `JWT_SECRET` e `FRONTEND_ORIGINS` foram declaradas com `sync: false`, para que o Render solicite os valores no painel sem armazená-los no repositório.

Fixei Node em `24.x` no `package.json` e sincronizei o metadado no `package-lock.json`. O deploy usou o commit `89f4a8fd17cf99b19b2d5fcf0468b56cf600b6f0`.

No frontend, substituí o `window.prompt` de nome por um `<dialog>` nativo com modos de login e cadastro. O dialog possui título e descrição associados, labels visíveis, autocomplete, mensagens de erro por campo, navegação por abas, foco inicial, fechamento por `Escape`, backdrop e devolução de foco ao botão da conta.

Cadastro e login passaram a usar `POST /api/auth/register` e `POST /api/auth/login`. A resposta `{ token, usuario }` é validada antes de entrar no estado da aplicação e armazenada em `sessionStorage` na chave `marketplace-vortex:sessao`. Ao recarregar a página, `GET /api/auth/me` valida o token e atualiza a identidade.

Criei um helper central para requisições autenticadas. Ele envia `Authorization: Bearer <token>` em `POST /api/anuncios`, `DELETE /api/anuncios/:id`, `GET /api/auth/me` e `GET /api/anuncios/me`. A listagem de anúncios do usuário deixou de enviar UUID por query e passou a depender exclusivamente do token.

Somente uma resposta HTTP 401 invalida a sessão. Nesse caso, o frontend remove o valor de `sessionStorage`, limpa o estado autenticado, abre o dialog e informa que é necessário entrar novamente. Falhas de rede, indisponibilidade temporária e respostas diferentes de 401 preservam a sessão.

O cliente agora respeita `VITE_API_URL`. Quando a variável está vazia, os caminhos relativos e o proxy local continuam funcionando. Quando configurada, todas as chamadas usam a API publicada.

Adicionei um aviso atrasado de 1,5 segundo com o texto exato “A API gratuita está iniciando”. Ele aparece em carregamentos demorados do catálogo, anúncios do usuário e cadastro/login, sem piscar em respostas rápidas. Todos os timers são cancelados em sucesso, erro e requisições obsoletas.

As coleções novas e a renderização das coleções pessoais passaram a usar somente o UUID validado de `sessaoAtual.usuario`. A identidade antiga em `localStorage` deixou de autenticar o usuário, mas continua preservada para o fluxo de importação.

Criei um segundo dialog para a importação das coleções legadas. A oferta só aparece quando existem uma identidade antiga e coleções associadas a ela. A decisão é registrada por uma chave versionada e específica ao par `ID legado + UUID autenticado`.

Ao aceitar, somente as coleções cujo `usuarioId` corresponde à identidade antiga são reassociadas ao UUID e ao nome autenticados. Demais coleções, entradas desconhecidas e campos adicionais são preservados. Ao recusar, apenas o marcador de decisão é gravado; a identidade e as coleções antigas não são apagadas nem regravadas.

### Deploy no Render

Conectei o Render ao GitHub com acesso restrito ao repositório `PedroMapu/marketplace-vortex` e criei o Blueprint `marketplace-vortex`. As quatro variáveis foram preenchidas no painel sem exposição de valores.

O primeiro deploy executou `npm ci`, `npm run migrate` e `npm start`. As migrations 001 e 002 foram reconhecidas como já aplicadas, e a migration 003 de tokens de redefinição de senha foi aplicada. O servidor iniciou na porta 10000 fornecida pelo Render.

A API ficou disponível em:

`https://marketplace-vortex-api.onrender.com`

O endpoint `GET /api/status` respondeu HTTP 200 com:

`{"mensagem":"API do Marketplace Vortex funcionando."}`

Como o health check executa `SELECT 1`, essa resposta também confirmou a conexão do serviço publicado com o Neon de produção.

### O que funcionou

O serviço gratuito ficou live por HTTPS no commit esperado. O build, as migrations e a inicialização foram concluídos pelo mesmo `startCommand`, sem depender de pre-deploy indisponível no plano gratuito.

O fluxo real de produção foi comprovado com uma conta sintética: cadastro respondeu 201, `/api/auth/me` respondeu 200, login respondeu 200 com o mesmo UUID, um novo `/api/auth/me` respondeu 200 e `/api/anuncios/me` respondeu 200 com lista vazia.

O preflight de produção respondeu 204 para uma origem local autorizada e permitiu `Authorization` e `Content-Type`. Uma origem fora da allowlist recebeu 403.

A inspeção visual confirmou que o dialog de autenticação mantém a identidade visual do Marketplace Vortex, recebe foco no campo de e-mail e devolve o foco ao botão da conta quando fechado por teclado.

A revisão independente concluiu com parecer `GO`. Todos os doze itens e todos os critérios do Dia Bônus 5 foram considerados atendidos.

### Erros e riscos encontrados

Logo depois da criação do serviço, o roteamento do Render apresentou respostas intermitentes `404 Not Found` com `x-render-routing: no-server`, embora o processo permanecesse live. A primeira rodada do revisor teve 14 respostas 200 e 6 respostas 404; uma reprodução independente teve 16 respostas 200 e 4 respostas 404.

O comportamento desapareceu depois da propagação inicial. Uma nova rodada obteve 30 respostas 200 em 30 tentativas, e todo o fluxo autenticado publicado passou sem retry. O incidente foi reclassificado como risco transitório de provisionamento, não como falha da aplicação. Deve ser investigado novamente se o `no-server` reaparecer.

O `npm ci` do Render informou oito vulnerabilidades de severidade alta em dependências de desenvolvimento relacionadas a `vite-plugin-pwa` e Workbox. `npm audit --omit=dev` encontrou zero vulnerabilidades nas dependências de produção.

O driver `pg` emitiu um aviso sobre mudança futura na interpretação de `sslmode`. A conexão atual funcionou com TLS e o aviso não bloqueou o deploy, mas deverá ser revisto antes de uma atualização futura do driver.

Duas contas sintéticas, ambas sem anúncios, permaneceram no Neon de produção porque ainda não existe endpoint de exclusão de conta. A primeira foi criada durante a instabilidade inicial de roteamento; a segunda comprovou o fluxo completo.

### Como investiguei

Comparei cada entrega com a seção Dia Bônus 5 do `PLANO/PLAN.md`. Auditei o manifesto, runtime, comandos, variáveis, contratos da API, CORS, persistência de sessão, pontos de envio do Bearer, tratamento de 401, timers de cold start, autoria das coleções e transformação dos dados legados.

Executei uma busca por URLs PostgreSQL e segredos em arquivos versionados. Os únicos valores encontrados eram exemplos fictícios em testes. `.env` e `.env.production.local` permaneceram ignorados pelo Git.

No frontend, verifiquei o dialog no navegador local, seu estado ARIA, foco inicial, fechamento por `Escape` e retorno do foco. Para a importação, extraí a transformação para `src/legacy-import.mjs` e criei testes específicos de reassociação seletiva e marcador idempotente.

No ambiente publicado, acompanhei os logs do Render até `Build successful`, execução das migrations, inicialização do servidor e estado live. Depois, repeti health checks, preflight, cadastro, login, `/me` e `/anuncios/me`.

### O que aprendi

Aprendi que o Blueprint gratuito do Render não oferece pre-deploy separado. Por isso, migrations precisam fazer parte do `startCommand` e devem ser idempotentes, protegidas por lock e seguras para execução a cada novo processo.

Aprendi que `sync: false` permite declarar a existência de um segredo no manifesto sem incluir seu valor. No primeiro sync, o Render solicita o preenchimento pelo painel; em Blueprints existentes, novas variáveis podem exigir configuração manual.

Aprendi que sessão no navegador envolve duas responsabilidades diferentes: armazenar o token e validar sua validade no servidor. `sessionStorage` limita a sessão à aba, enquanto `/api/auth/me` impede que uma identidade local seja tratada como autenticada sem Bearer.

Aprendi que falha de rede não significa sessão inválida. Remover o token em qualquer erro desconectaria o usuário durante um cold start ou período offline. A invalidação deve ocorrer somente quando o servidor responde 401.

Aprendi que uma migração de dados locais precisa oferecer escolha e manter reversibilidade. A recusa não deve alterar os dados antigos, e a aceitação deve modificar somente registros que pertencem à identidade confirmada.

Aprendi também que um serviço recém-provisionado pode apresentar propagação de roteamento mesmo depois do processo ficar live. A validação de produção deve usar várias tentativas e distinguir respostas do roteador de respostas da aplicação.

### Testes realizados

- `npm run typecheck` aprovado.
- `npm run build` aprovado.
- `npm test` aprovado: 70 testes executados, 0 falhas e 1 teste PostgreSQL real ignorado por ausência de `TEST_DATABASE_URL` nesse processo.
- Dois testes específicos de importação legada aprovados.
- `git diff --check` aprovado.
- Auditoria de segredos aprovada.
- `npm audit --omit=dev` aprovado com zero vulnerabilidades de produção.
- Build do Render aprovado com Node 24.
- `npm run migrate && npm start` confirmado nos logs de produção.
- Migration 003 aplicada no Neon de produção.
- API publicada por HTTPS.
- `/api/status` respondendo HTTP 200 e confirmando o Neon.
- Rodada estabilizada de 30 health checks com 30 respostas HTTP 200.
- Cadastro real respondendo 201.
- Login real respondendo 200 com o mesmo UUID.
- `/api/auth/me` respondendo 200 com Bearer.
- `/api/anuncios/me` respondendo 200 com lista vazia.
- Preflight respondendo 204 com `Authorization` e `Content-Type`.
- Origem não autorizada recebendo 403.
- Dialog de autenticação validado visualmente.
- Foco inicial, `Escape` e retorno de foco aprovados.
- Revisão independente final concluída com parecer `GO`.

### Limitações e próximo passo

O teste CRUD PostgreSQL real continua opt-in e foi ignorado nesta execução porque `TEST_DATABASE_URL` não estava presente no processo do revisor. Os demais 70 testes passaram.

O frontend ainda não possui uma suíte DOM/E2E automatizada para sessão, falha de rede, 401 e dialogs. Esses comportamentos foram auditados pelo código e parcialmente comprovados no navegador e na API publicada, mas devem receber automação no Dia Bônus 7.

Para executar o frontend local contra a API publicada, `VITE_API_URL` precisa apontar temporariamente para `https://marketplace-vortex-api.onrender.com`. A configuração local atual continua apontando para o servidor de desenvolvimento.

O domínio definitivo da Vercel ainda não foi incluído em `FRONTEND_ORIGINS`, porque o deploy do frontend pertence ao Dia Bônus 8.

O próximo passo planejado é o Dia Bônus 6: implementar cache público do catálogo, fallback offline, invalidação explícita e polimento visual dos estados de carregamento e reconexão.

### Commit

`89f4a8f` — `feat: concluir dia bonus 5 com deploy e autenticacao`
