const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");

module.exports = function () {
  // const dbPass = config.get('dbpass')
  // console.log("dbPass", dbPass)
  const atlas = `mongodb+srv://vidlyuser:admin1234@vidly.hsmmg.mongodb.net/vidlystore?retryWrites=true&w=majority`;
  const local = "mongodb://localhost/Vidly-Rentals"
  mongoose
    .connect(atlas, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => winston.info(`Connected to MongoDB...`));
};
