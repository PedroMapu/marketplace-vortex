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

Revise o arquivo CSS, veja o que está tendo overflow e revise a responsividade.

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

