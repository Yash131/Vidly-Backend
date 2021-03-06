const mongoose = require("mongoose");
const Joi = require("joi");

const contactUsSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    minlength: 10,
    maxlength: 150,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const ContactUs = mongoose.model("contact-Us", contactUsSchema);

const contactUsValidator = (contact) => {
  const joiSchema = {
    name: Joi.string().min(3).required(),
    email: Joi.string().email().trim().required(),
    message: Joi.string().min(10).max(150).required(),
  };
  return Joi.validate(contact, joiSchema);
};

module.exports.ContactUs = ContactUs;
module.exports.contactUsValidator = contactUsValidator;
