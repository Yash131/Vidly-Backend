const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");

module.exports = function () {
  const db = config.get('db')
  console.log("dbPass", db)
  // const atlas = `mongodb+srv://admin:admin1234@vidly.hsmmg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  // const local = "mongodb://localhost/Vidly-Rentals"
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => winston.info(`Connected to MongoDB...`));
};
