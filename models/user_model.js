const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const { timestamp } = require("winston/lib/winston/common");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
    maxlength: 255,
  },
  email: {
    type: String,
    unique: true,
    maxlength: 255,
  },
  password: {
    type: String,
  },
  mobile : Number,
  address : String,
  photo : String,
  isAdmin: {
    type: Boolean,
    default: false,
  },
},{ timestamps: true });

userSchema.methods.genrateAuthToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      isAdmin: this.isAdmin,
    },
    config.get("jwtPrivateKey")
  );
};

const User = mongoose.model("Users", userSchema);

const validate = (user) => {
  const schema = {
    name: Joi.string().min(5).max(255),
    email: Joi.string().email().max(255),
    password: Joi.string().trim(),
    isAdmin: Joi.boolean().default(false),
  };

  return Joi.validate(user, schema);
};

exports.validate = validate;
exports.User = User;
