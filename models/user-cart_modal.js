// const { schema } = require('joi/lib/types/object')
// const mongoose = require('mongoose')

// const movieSchema = new mongoose.Schema({
//     _id : {
//       type: String
//     },
//     title: {
//       type: String,
//       trim: true,
//       minlength: 5,
//       maxlength: 255,
//     },
//     price: {
//       type: Number,
//       min: 0,
//     },
//     dailyRentalRate: {
//       type: Number,
//       min: 0,
//       max: 255,
//     },
//     quantity: {
//       type: Number,
//       default: 1,
//     },
// });

// const userCart = new mongoose.Schema({
//   user_id : {
//     type : String
//   },
//   movies : [movieSchema]
// })

// const UserCartProduct = new mongoose.model('user-cart', userCart)

// exports.userCart = userCart;
// exports.UserCartProduct = UserCartProduct;

const mongoose = require("mongoose");
const { User } = require("./user_model");

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
    products: [
      {
        movieID: { type : mongoose.Schema.Types.ObjectId },
        image : String,
        quantity: Number,
        title: String,
        price: Number      
      },
    ],
    totalPrice: {
      type : Number,
      default : 0
    },
    active: {
      type: Boolean,
      default: true,
    },
    modifiedOn: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const CartNew = mongoose.model("Cart-New", CartSchema);

exports.CartNew = CartNew;
