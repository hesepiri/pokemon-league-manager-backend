const mongoose = require("mongoose");

const pokemonSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true, // Ej: "NAIC 2025", "VGC", "Favorito"
  },
  title: {
    type: String,
    required: true, // Nombre del Pokémon. Ej: "Onderlagua" / "Walking-wake"
  },
  text: {
    type: String,
    required: true, // Notas o estrategia. Ej: "Variante de set con Protosynthesis"
  },
  date: {
    type: String,
    required: true, // Fecha en la que se registra o añade al equipo
  },
  source: {
    type: String,
    required: true, // Origen del dato. Ej: "PokéAPI", "Personal"
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) =>
        /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/.test(
          v,
        ),
      message: "El enlace al recurso no es una URL válida.",
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) =>
        /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/.test(
          v,
        ),
      message: "El enlace de la imagen no es una URL válida.",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
    select: false, // La base de datos no lo expone por defecto
  },
});

module.exports = mongoose.model("pokemon", pokemonSchema);
