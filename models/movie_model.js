const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre_model");

const Movie = mongoose.model(
  "Movies",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 255,
    },
    genre: {
      type: genreSchema,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    trailerUrl: {
      type: String,
    },
    summery: {
      type: String,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    numberInStock: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
    dailyRentalRate: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
    inCart : {
      type : Boolean,
      default : false
    }
  })
);

function validateMovie(movie) {
  const schema = {
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.objectId().required(),
    imageUrl: Joi.string().trim(),
    trailerUrl: Joi.string().trim(),
    summery: Joi.string(),
    rating: Joi.number().min(0).max(5).required(),
    price: Joi.number().min(0).required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  };

  return Joi.validate(movie, schema);
}

exports.Movie = Movie;
exports.validate = validateMovie;
