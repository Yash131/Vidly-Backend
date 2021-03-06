const router = require("express").Router();
const { User } = require("../models/user_model");
const { CartNew } = require("../models/user-cart_modal");
// const validateObjId = require("../middlewares/validateObjId");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
const { Movie } = require("../models/movie_model");

router.post("/", auth, async (req, res) => {
  const { movieID, quantity, title, price , image} = req.body;

  try {
    // console.log(req.user)
    let user = await User.findById(req.user._id);
    if (!user) {
      return res.status(400).send("Invalid user ID.");
    }
    const userId = req.user._id;

    const movie = await Movie.findById(movieID);
    if (!movie) {
      return res.status(400).send("Invalid Movie ID.");
    }

    let cart = await CartNew.findOne({ userId: userId });
    // console.log("Cart: ", cart);
    if (cart) {
      //cart exists for user
      console.log("cart exists for user");
      let itemIndex = cart.products.findIndex((p) => p.movieID == movieID);

      if (itemIndex > -1) {
        console.log("product exists in cart ++ quantity");
        // product exists in the cart, update the quantity
        let productItem = cart.products[itemIndex];
        productItem.quantity = quantity;
        productItem.totalPrice += parseInt(price * quantity);
        cart.products[itemIndex] = productItem;

        // try {
        //   movie.numberInStock = true;
        //   await movie.save()
        // } catch (error) {
        //   console.log(error);
        // }
      } else {
        console.log("product does not exists in cart, add new item");
        //product does not exists in cart, add new item
        cart.products.push({ movieID, quantity, title, price , image});
        cart.totalPrice += parseInt(price * quantity);
      }
      // console.log(cart);

      try {
        movie.numberInStock = parseInt(movie.numberInStock - 1);
        await movie.save();
      } catch (error) {
        console.log(error);
      }

      cart = await cart.save();
      return res.send(cart);
    } else {
      console.log("no cart for user, create new cart");
      //no cart for user, create new cart
      const newCart = await CartNew.create({
        userId,
        products: [{ movieID, quantity, title, price, image}],
        totalPrice: parseInt(price * quantity),
      });
      try {
        movie.numberInStock = parseInt(movie.numberInStock - 1);
        await movie.save();
      } catch (error) {
        console.log(error);
      }
      return res.send(newCart);
    }
  } catch (err) {
    console.log(err);
    return res.send("Something went wrong");
  }
});

router.get("/", auth, async (req, res) => {
  const cart = await CartNew.findOne({ userId: req.user._id });
  if (!cart) {
    res.send({ message: "You'r Cart Is Empty" });
  }
  res.send(cart);
});

router.get("/totalItems", auth, async (req, res) => {
  let userId = req.user._id;
  const cart = await CartNew.findOne({ userId: userId });
  if (!cart) {
    return res.send({ totalItems: 0, status: "User not logged in yet" });
  }
  let totalItems = cart.products.length;
  res.send({ totalItems: totalItems, status: "success" });
});

router.delete("/emptyCart", auth, async (req, res) => {
  let userId = req.user._id;
  let cart = await CartNew.findOne({ userId: userId });
  if (!cart) {
    return res.send({ status: "Cart Is Already Empty!" });
  }
  cart.products = [];
  cart.totalPrice = 0;
  cart = await cart.save();
  res.send({ status: "Cart Is Empty Now.", data: cart });
});

router.delete("/removeAMovie/:id", auth, async (req, res) => {
  let userId = req.user._id;
  let movieObjId = req.params.id;
  // console.log(movieObjId)
  let cart = await CartNew.findOne({ userId: userId });
  if (!cart) {
    return res.send({ status: "Cart Is Already Empty!" });
  }

  let indexOfMovie = cart.products.findIndex((el) => el._id == movieObjId);

  const movie = await Movie.findById(cart.products[indexOfMovie].movieID);
  if (!movie) {
    return res.status(400).send("Invalid Movie ID.");
  }
  
  try {
    movie.numberInStock = parseInt(movie.numberInStock + 1);
    await movie.save();
  } catch (error) {
    console.log(error);
  }

  cart.totalPrice = parseInt(
    cart.totalPrice - cart.products[indexOfMovie].price
  );
  cart.products.splice(indexOfMovie, 1);

  cart = await cart.save();
  return res.send({
    movieObjId: movieObjId,
    message: "movie removed from cart successfully",
    data: cart,
  });
});

module.exports = router;
