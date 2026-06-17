const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Controlador para el Registro (POST /signup)
const createUser = (req, res, next) => {
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
      // Pasamos el error al manejador centralizado de Express
      next(err);
    });
};

// Controlador para el Inicio de Sesión (POST /signin)
const login = (req, res, next) => {
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

        // CONDICIÓN DEL PUNTO 4 DE TRIPLETEN:
        // Si estamos en producción usa JWT_SECRET, si no, usa la clave por defecto 'dev-secret-key'
        // Esto evita que falle localmente si no existe el archivo .env
        const jwtSecret =
          process.env.NODE_ENV === "production"
            ? process.env.JWT_SECRET
            : "dev-secret-key";

        const token = jwt.sign({ _id: user._id }, jwtSecret, {
          expiresIn: "7d",
        });

        // Devolvemos el token al cliente con estatus 200 explícito
        res.status(200).send({ token });
      });
    })
    .catch(next); // Delegamos errores inesperados al manejador centralizado
};

module.exports = {
  createUser,
  login,
};
