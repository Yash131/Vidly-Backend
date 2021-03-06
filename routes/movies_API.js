const { Movie, validate } = require("../models/movie_model");
const { Genre } = require("../models/genre_model");
const auth = require("../middlewares/auth");

const express = require("express");
const admin = require("../middlewares/admin");
const validateObjId = require("../middlewares/validateObjId");
const router = express.Router();

router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("name");
  res.send(movies);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) {
    return res.status(400).send("Invalid genre.");
  }

  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    imageUrl: req.body.imageUrl,
    trailerUrl: req.body.trailerUrl,
    summery: req.body.summery,
    rating: req.body.rating,
    price: req.body.price,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  await movie.save();

  res.send(movie);
});

router.put("/admin/:id", [auth, admin, validateObjId], async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) {
    return res.status(400).send("Invalid genre.");
  }

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      imageUrl: req.body.imageUrl,
      trailerUrl: req.body.trailerUrl,
      summery: req.body.summery,
      rating: req.body.rating,
      price: req.body.price,
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: true }
  );

  if (!movie) {
    return res.status(404).send("The movie with the given ID was not found.");
  }
  res.send(movie);
});

router.delete("/admin/:id", [auth, admin, validateObjId], async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);
  if (!movie) {
    return res.status(404).send("The movie with the given ID was not found.");
  }
  res.send(movie);
});

router.get("/admin/:id", [auth, admin, validateObjId], async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) {
    return res.status(404).send("The movie with the given ID was not found.");
  }
  res.send(movie);
});

router.get("/genre/:id?", async (req, res, next) => {

  let genreID = req.params.id;
  if(!genreID){
    console.log('none')
    const movies = await Movie.find().sort("name");
    return res.send(movies)
  }else{
    if(genreID == "any" || genreID == "null" || genreID == "undefined" || genreID == "[object Object]"){
      const movies = await Movie.find().sort("name");
      return res.send(movies)
    }else if(genreID != "any"){
      let genre = await Genre.findById(genreID);
      console.log(genre)
      if(genre){
        const movieByGenre = await Movie.find({ 'genre._id': genreID })
        return res.send(movieByGenre)
      }else{
        return res.send(404).send("Incorrect Genre ID")
      }
    }
  }


  // else if(!genreID){
  //   const movies = await Movie.find().sort("name");
  //   return res.send(movies)
  // }

});

module.exports = router;
