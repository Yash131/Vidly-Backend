const any = require('joi/lib/types/any');
const object = require('joi/lib/types/object');
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    shippingDetails : object,
    products : object,
    userDetails :object,
    paymentModeData :object,
    totalPrice : Number,
    paymentMode : String,
    paymentStaus : String,
    orderStatus : String,
    modifiedOn: {
        type: Date,
        default: Date.now,
    }   
},{ timestamps: true })

const Order = mongoose.model('orders', orderSchema);

exports.Order = Order;
