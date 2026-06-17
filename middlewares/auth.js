const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  // Verificamos que la cabecera exista y empiece con 'Bearer '
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(401)
      .send({
        message: "Autorización requerida. Token no proporcionado o inválido.",
      });
  }

  // Extraemos el token puro
  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    // Verificamos el token con la firma correspondiente según el entorno
    payload = jwt.verify(
      token,
      process.env.NODE_ENV === "production"
        ? process.env.JWT_SECRET
        : "dev-secret-key",
    );
  } catch (err) {
    return res
      .status(401)
      .send({ message: "Autorización requerida. Token inválido." });
  }

  // Asignamos el payload (que contiene el _id del usuario) al objeto req para los siguientes controladores
  req.user = payload;

  next(); // Damos luz verde al siguiente controlador
};
