const User = require("../models/user");

// Devuelve información sobre el usuario conectado (GET /users/me)
const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "Usuario no encontrado." });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "ID de usuario inválido." });
      }
      res
        .status(500)
        .send({ message: "Error interno del servidor al obtener el usuario." });
    });
};

module.exports = {
  getCurrentUser,
};
