require("dotenv").config();
const routes = require("./src/routes/index.routes");
const swaggerUI = require("swagger-ui-express");
const db = require("./src/config/db.js");
const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 8877;

app.use(cors());
routes(app);
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}
app.use("/", swaggerUI.serve, swaggerUI.setup(require("./swagger.json")));
db.on(
  "error",
  console.error.bind("Houver um erro ao conectar o banco de dados")
);

db.once("open", () => {
  console.log("Conexão com banco de dados feita com sucesso");
});

module.exports = app;
