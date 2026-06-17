const Pokemon = require("../models/pokemon");

// Devuelve todos los Pokémon guardados por el usuario conectado (GET /pokemons)
const getSavedPokemons = (req, res) => {
  Pokemon.find({ owner: req.user._id })
    .then((pokemons) => res.send(pokemons))
    .catch(() =>
      res
        .status(500)
        .send({ message: "Error interno del servidor al obtener Pokémon." }),
    );
};

// Crea un objeto de datos de Pokémon (POST /pokemons)
const createPokemon = (req, res) => {
  const { keyword, title, text, date, source, link, image } = req.body;
  const owner = req.user._id;

  Pokemon.create({ keyword, title, text, date, source, link, image, owner })
    .then((pokemon) => {
      // Convertimos a objeto para limpiar el campo 'owner' antes de responder
      const response = pokemon.toObject();
      delete response.owner;
      res.status(201).send(response);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      res
        .status(500)
        .send({ message: "Error interno del servidor al guardar Pokémon." });
    });
};

// Borra el Pokémon almacenado por su _id (DELETE /pokemons/pokemonId)
const deletePokemon = (req, res) => {
  const { pokemonId } = req.params;

  // Buscamos el registro pidiendo explícitamente el campo 'owner' para validar
  Pokemon.findById(pokemonId)
    .select("+owner")
    .then((pokemon) => {
      if (!pokemon) {
        return res
          .status(404)
          .send({ message: "El Pokémon solicitado no existe." });
      }

      // Validación estricta de propiedad
      if (pokemon.owner.toString() !== req.user._id) {
        return res
          .status(403)
          .send({ message: "No tienes permisos para eliminar este Pokémon." });
      }

      // Si todo coincide, procedemos al borrado
      return Pokemon.findByIdAndDelete(pokemonId).then(() =>
        res.send({ message: "Pokémon eliminado correctamente de tu lista." }),
      );
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "ID de Pokémon inválido." });
      }
      res
        .status(500)
        .send({ message: "Error interno del servidor al intentar borrar." });
    });
};

module.exports = {
  getSavedPokemons,
  createPokemon,
  deletePokemon,
};
