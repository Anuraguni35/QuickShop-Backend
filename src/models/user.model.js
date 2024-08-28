const mongoose = require("mongoose");
const validator = require("validator");
const config = require("../config/config");
const bcrypt = require("bcryptjs");
const { required } = require("joi");

// Define the base user schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      validate: (value) => {
        return validator.isEmail(value);
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            "Password must contain at least one letter and one number"
          );
        }
      },
    },
    address: {
      type: String,
      default: config.default_address,
    },
    role: {
      type: String,
      enum: ["buyer", "seller"],
      required: true,
    },
  },
  {
    timestamps: true,
    discriminatorKey: "role", // Discriminator key to differentiate between buyer and seller
  }
);

userSchema.statics.isEmailTaken = async function (email) {
  const result = await this.findOne({ email });
  return !!result;
};

userSchema.methods.isPasswordMatch = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.hasSetNonDefaultAddress = async function () {
  return this.address !== config.default_address;
};

// Create the base User model
const User = mongoose.model("User", userSchema);

// Define the buyer schema as a discriminator of the User model
const buyerSchema = new mongoose.Schema({
  // Additional fields specific to buyers can be added here
});

const Buyer = User.discriminator("buyer", buyerSchema);

// Define the seller schema as a discriminator of the User model
const sellerSchema = new mongoose.Schema({
  pendingOrders: [
    {
      orderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",  
      },
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",  
      },
        quantity: {
          type: Number,
          required: true, 
        },
        order_status: {
          type: String,
          default: "pending",
          enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
        },
        order_date: {
          type: Date,
          default: Date.now,
        },
    },
  ],
  completedOrders: [
    {
      orderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",  
      },
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",  
      },
        quantity: {
          type: Number,
          required: true, 
        },
        order_status: {
          type: String,
          required:true, 
          enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
        },
        order_date: {
          type: Date,
          default: Date.now,
        },
    },
  ],
});

const Seller = User.discriminator("seller", sellerSchema);

module.exports = { User, Buyer, Seller };