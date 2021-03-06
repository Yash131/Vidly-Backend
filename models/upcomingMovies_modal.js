const mongoose = require("mongoose");
const Joi = require("joi");

const upcomingMovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 255,
  },
  trailerURL: {
    type: String,
    required: true,
  },
  posterURL: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: String,
    required: true,
  },
});

const UpcominMovie = mongoose.model("upcoming-movies", upcomingMovieSchema);

function validateUpcomingMovie(upcomingMovie) {
  const schema = {
    title: Joi.string().max(50).required(),
    trailerURL: Joi.string().required(),
    posterURL: Joi.string().required(),
    releaseDate: Joi.string().required(),
  };

  return Joi.validate(upcomingMovie, schema);
}

exports.UpcominMovie = UpcominMovie;
exports.validateUpcomingMovie = validateUpcomingMovie;
