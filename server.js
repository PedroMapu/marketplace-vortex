const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/api/status", (request, response) => {
  response.json({
    mensagem: "API do Marketplace Vortex funcionando.",
  });
});

app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`Servidor disponível em http://localhost:${PORT}`);
});
