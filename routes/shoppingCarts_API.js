const router = require("express").Router();
const { Cart } = require("../models/shoppingCarts");
const { Movie } = require("../models/movie_model");

router.get("/", async (req, res) => {
  const carts = await Cart.find().sort("dateCreated");
  res.send(carts);
});

router.post("/:id", async (req, res) => {
  let movie = await Movie.findById(req.body.items);
  if (!movie) {
    return res.status(400).send("Invalid movie Id.");
  }

  let cart = await Cart.findById(req.params.id);
  if (cart) {
    cart.items.push({
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
      price: movie.price,
    });

    // cart.items.forEach(async (element, index, array) => {
    //   if (req.body.items[0] === element._id) {
    //     element.quantity += 1;
    //   }
    // });

    await cart.save();
    res.send(cart);
  } else {
    cart = new Cart({
      items: [
        {
          _id: movie._id,
          title: movie.title,
          dailyRentalRate: movie.dailyRentalRate,
          price: movie.price,
        },
      ],
    });
    await cart.save();
    res.send(cart);
  }
});

module.exports = router;

// const myArray = [{x:100}, {x:200}, {x:300}];

// myArray.forEach((element, index, array) => {
//     console.log(element.x); // 100, 200, 300
//     console.log(index); // 0, 1, 2
//     console.log(array); // same myArray object 3 times
// });
