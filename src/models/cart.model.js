const mongoose = require('mongoose');
const { productSchema } = require('./product.model');
const config = require("../config/config");
const { string } = require('joi');

// Complete cartSchema, a Mongoose schema for "carts" collection
const cartSchema = mongoose.Schema(
  {
    email: {
      type:String,
      required:true,
      unique:true,
    },
    userId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required:true,
    },
    cartItems:{
      type:[{
        product:productSchema,
        quantity:Number,
      }],
    },
    paymentOption:{
      type:String,
      default:config.default_payment_option,
    }
  },
  {
    timestamps: false,
  }
);


 
const Cart = mongoose.model('Cart', cartSchema);

module.exports.Cart = Cart;