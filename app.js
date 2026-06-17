const express = require("express");
const mongoose = require("mongoose");
const { celebrate, Joi, errors } = require("celebrate");
require("dotenv").config();

// Controladores
const { createUser, login } = require("./controllers/auth");
const { getCurrentUser } = require("./controllers/users");
const {
  getSavedPokemons,
  createPokemon,
  deletePokemon,
} = require("./controllers/pokemons");

// Middlewares
const auth = require("./middlewares/auth");
const { requestLogger, errorLogger } = require("./middlewares/logger");

// En producción usará la base de datos que definas en el servidor, en local mantiene tu pokemon_league_db
const {
  PORT = 3000,
  MONGO_DB = "mongodb://localhost:27017/pokemon_league_db",
} = process.env;
const app = express();

app.use(express.json());

mongoose
  .connect(MONGO_DB)
  .then(() => console.log(`Conectado con éxito a MongoDB`))
  .catch((err) => console.error("Error al conectar a MongoDB:", err));

// 1. Logger de peticiones (Debe ir antes de todas las rutas)
app.use(requestLogger);

// --- RUTAS PÚBLICAS CON VALIDACIÓN ---
app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  createUser,
);

app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

// --- RUTAS PRIVADAS (PROTEGIDAS) ---
app.use(auth); // Requiere token a partir de aquí

app.get("/users/me", getCurrentUser);

app.get("/pokemons", getSavedPokemons);

app.post(
  "/pokemons",
  celebrate({
    body: Joi.object().keys({
      keyword: Joi.string().required(),
      title: Joi.string().required(),
      text: Joi.string().required(),
      date: Joi.string().required(),
      source: Joi.string().required(),
      link: Joi.string().required().uri(),
      image: Joi.string().required().uri(),
    }),
  }),
  createPokemon,
);

app.delete(
  "/pokemons/:pokemonId",
  celebrate({
    params: Joi.object().keys({
      pokemonId: Joi.string().hex().length(24).required(),
    }),
  }),
  deletePokemon,
);

// Manejo de rutas inexistentes (404)
app.use((req, res) => {
  res.status(404).send({ message: "El recurso solicitado no fue encontrado." });
});

// 2. Logger de errores (Debe ir después de las rutas y antes de los manejadores de errores)
app.use(errorLogger);

// Manejador de errores de Celebrate (convierte errores de validación en respuestas HTTP)
app.use(errors());

// 3. Manejador de errores centralizado personalizado
app.use((err, req, res, next) => {
  // Si el error ya trae un código de estado, lo usamos; si no, por defecto es 500 (Internal Server Error)
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? "Ocurrió un error en el servidor." : message,
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
