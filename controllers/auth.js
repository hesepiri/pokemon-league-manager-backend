const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Controlador para el Registro (POST /signup)
const createUser = (req, res) => {
  const { email, password, name } = req.body;

  // Encriptamos la contraseña con un factor de costo de 10
  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      return User.create({
        email,
        password: hashedPassword,
        name,
      });
    })
    .then((user) => {
      // Retornamos el usuario creado, pero omitimos la contraseña por seguridad
      const userResponse = user.toObject();
      delete userResponse.password;
      res.status(201).send(userResponse);
    })
    .catch((err) => {
      // Manejo de error por email duplicado (Código 11000 en MongoDB)
      if (err.code === 11000) {
        return res
          .status(409)
          .send({ message: "El correo electrónico ya está registrado." });
      }
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      res
        .status(500)
        .send({ message: "Error interno del servidor al registrar usuario." });
    });
};

// Controlador para el Inicio de Sesión (POST /signin)
const login = (req, res) => {
  const { email, password } = req.body;

  // Buscamos al usuario e incluimos explícitamente el password que está oculto por defecto
  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .send({ message: "Correo electrónico o contraseña incorrectos." });
      }

      // Comparamos la contraseña ingresada con el hash de la base de datos
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return res
            .status(401)
            .send({ message: "Correo electrónico o contraseña incorrectos." });
        }

        // Si las credenciales son correctas, generamos el token JWT
        // Nota: En desarrollo usamos una clave harcodeada, en producción usaremos process.env.JWT_SECRET
        const token = jwt.sign(
          { _id: user._id },
          process.env.NODE_ENV === "production"
            ? process.env.JWT_SECRET
            : "dev-secret-key",
          { expiresIn: "7d" },
        );

        // Devolvemos el token al cliente
        res.send({ token });
      });
    })
    .catch(() => {
      res
        .status(500)
        .send({ message: "Error interno del servidor al iniciar sesión." });
    });
};

module.exports = {
  createUser,
  login,
};
