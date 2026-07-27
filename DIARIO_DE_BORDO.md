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

### Prompt usado

Analisando o planejamento de aprendizado e desenvolvimento, diga tudo que tem que ser feito hoje e explique os conceitos necessários.

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

### Prompt usado

Revise o arquivo CSS, veja o que está tendo overflow e revise a responsividade. Se necessário crie agentes para checar o que foi solicitado de forma independente

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

### Prompt usado

Usa a skill de frontend e cria uma animação de scroll pra quando a pessoa scrollar pra baixo as coisas irem renderizando suavemente mas em um tempo rápido.

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

### Prompt usado

Não houve um prompt separado apenas para o Dia 4. A atividade apareceu como uma etapa necessária durante o pedido para planejar e implementar a criação, a exibição e a exclusão local de anúncios do Dia 5.

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

### Prompts usados

Faça um planejamento para fazer cada uma das atividades: criar anúncio sem recarregar a página, excluir anúncio do array, pedir e salvar o nome do usuário, associar usuário ao anúncio, mostrar os próprios anúncios e permitir exclusão somente dos anúncios próprios.

Depois, crie agentes temporários para trabalharem em paralelo e realizarem todas as tarefas necessárias para o Dia 5 de acordo com o planejamento de desenvolvimento.

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

### Prompts usados

Execute `npm init -y`, instale Express, crie o servidor, sirva a pasta `public`, crie a primeira rota JSON e crie o script `npm start`.

Faça um planejamento em relatório de tudo que será feito e, depois, siga o planejamento.

Permita somente o envio de imagens PNG na publicação e possibilite que o usuário abra a imagem do anúncio para visualizá-la mais de perto.

Faça os contadores de categorias, condições e modalidades representarem dinamicamente os anúncios existentes.

Torne funcionais a barra superior de busca e ordenação, as ações de visualização e as abas do catálogo.

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
