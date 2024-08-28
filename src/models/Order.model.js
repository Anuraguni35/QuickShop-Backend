const mongoose = require('mongoose');
const config = require("../config/config");

const OrderSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cartItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product', // This should match your Product model name
        },
        quantity: {
          type: Number,
          required: true, // Added required to ensure quantity is specified
        },
      }
    ],
    paymentOption: {
      type: String,
      default: config.default_payment_option,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    orderAddress: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered"],
      default: "pending",
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', OrderSchema); // Ensure model name is capitalized

module.exports.Order = Order;