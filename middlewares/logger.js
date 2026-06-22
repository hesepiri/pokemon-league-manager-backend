const winston = require("winston");
const expressWinston = require("express-winston");

// Logger para almacenar información sobre todas las solicitudes de la API
const requestLogger = expressWinston.logger({
  transports: [new winston.transports.File({ filename: "request.log" })],
  format: winston.format.json(),
});

// Logger para almacenar información sobre los errores devueltos por la API
const errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.File({ filename: "error.log" })],
  format: winston.format.json(),
});

module.exports = {
  requestLogger,
  errorLogger,
};
