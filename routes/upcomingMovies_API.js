const {
  UpcominMovie,
  validateUpcomingMovie,
} = require("../models/upcomingMovies_modal");

const auth = require("../middlewares/auth");

const express = require("express");
const admin = require("../middlewares/admin");
const validateObjId = require("../middlewares/validateObjId");
const { find } = require("lodash");
const router = express.Router();

router.get("/get", async (req, res) => {
  const upcomingMovie = await UpcominMovie.find();
  res.send(upcomingMovie);
});

router.post("/add", [auth, admin], async (req, res) => {
  const { title, trailerURL, posterURL, releaseDate } = req.body;
  const { error } = validateUpcomingMovie(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const upmovie = await UpcominMovie.findOne({ 'title' : title });
  console.log(upmovie);

  if(upmovie){
   return res.status(400).send({message : "Movie Already Exists"})
  }

  const upcomingMovie = UpcominMovie.create({
    title: title,
    trailerURL: trailerURL,
    posterURL: posterURL,
    releaseDate: releaseDate,
  });

  (await upcomingMovie).save()
  res.send({
    message: "upcoming movie added successfully",
    data: upcomingMovie,
  });
});

router.delete('/delete/:id', [auth, admin,validateObjId], async (req,res )=> {
  const id = req.params.id

  const upcomingMovie = await UpcominMovie.findByIdAndRemove(id);
  if (!upcomingMovie) {
    return res.status(404).send("The movie with the given ID was not found.");
  }
  res.send({ message: "Movie Deleted Successfully" ,data:upcomingMovie});
});


module.exports = router;
