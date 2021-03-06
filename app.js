//Modules
const app = require("express")();
const winston = require("winston");
const joi = require("joi");
joi.objectId = require("joi-objectid")(joi);

// Logging All App Errors and Info
require("./startup/logging")();

// MongoDB Connections
require("./startup/db")();
// All Routes/Middlewares
require("./startup/routes")(app);

// Set a env to pass this error
require("./startup/config")();

// Production middlewares
require("./startup/prod")(app);

// Node Server Connections
const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  winston.info(`Node Server is Running on PORT: ${port}...`)
);

module.exports = server;
