const app = require("./api");

const PORT = process.env.PORT || 3000;

function iniciarServidor(port = PORT) {
  const servidor = app.listen(port, () => {
    console.log(`Servidor disponível em http://localhost:${port}`);
  });

  servidor.on("error", (erro) => {
    console.error("Não foi possível iniciar o servidor:", erro);
    process.exitCode = 1;
  });

  return servidor;
}

if (require.main === module) {
  iniciarServidor();
}

module.exports = {
  iniciarServidor,
};
