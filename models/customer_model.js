const Joi = require('joi');
const mongoose = require('mongoose');

const Customer = mongoose.model('Customer', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email :{
    type : String,
    required : true,
    maxlength : 255
  },
  mobile: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },  
  isGoldMember: {
    type: Boolean,
    required : true
  },
}));

function validateCustomer(customer) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email : Joi.string().email().max(255).required(),
    mobile: Joi.string().min(5).max(50).required(),
    isGoldMember: Joi.boolean().required()
  };

  return Joi.validate(customer, schema);
}

exports.Customer = Customer; 
exports.validate = validateCustomer;