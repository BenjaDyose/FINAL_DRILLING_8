const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require('./app/models');
const usuarioRoutes = require("./app/routes/user.routes");
const bootcampRoutes = require("./app/routes/bootcamp.routes");

const app = express();
const PORT = 3000

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Rutas
app.use("/api/v1/usuario", usuarioRoutes);
app.use("/api/v1/bootcamp", bootcampRoutes);

//db.sequelize.sync()
db.sequelize.sync({ force: false }).then(() => {
  console.log("Base de datos sincronizada.");
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}.`);
  });
});
