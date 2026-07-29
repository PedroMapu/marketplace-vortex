# Suíte permanente

`npm test` executa todos os arquivos `*.test.js` desta pasta com o test runner
nativo do Node.js.

Os testes de `service-worker.test.js` e `pwa.test.js` são a versão permanente
dos harnesses temporários registrados no Diário de Bordo. Eles executam os
fontes TypeScript atuais em contextos isolados e simulam somente APIs do
navegador que o Node não oferece: eventos do Service Worker, Cache Storage e
MessageChannel.

Os scripts históricos em `tmp/` não fazem parte da suíte. Eles permanecem como
evidência das etapas antigas, mas dependem da implementação SQLite removida e
de contratos HTTP que não existem mais.
