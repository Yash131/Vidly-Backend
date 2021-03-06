// const mongoose = require("mongoose");
// const { defaults } = require("joi");

// const movieSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     trim: true,
//     minlength: 5,
//     maxlength: 255,
//   },
//   price: {
//     type: Number,
//     min: 0,
//   },
//   dailyRentalRate: {
//     type: Number,
//     min: 0,
//     max: 255,
//   },
//   quantity: {
//     type: Number,
//     default: 1,
//   },
// });

// const cartSchema = new mongoose.Schema({
//   dateCreated: {
//     type: Date,
//     default: new Date().getTime(),
//   },
//   items: [movieSchema],
// });

// const Cart = mongoose.model("Cart", cartSchema);

// exports.Cart = Cart;
