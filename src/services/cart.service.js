const httpStatus = require("http-status");
const { Cart, Product, Order,User } = require("../models");
const ApiError = require("../utils/ApiError");
const config = require("../config/config");

const { x } = require("joi");
const catchAsync = require("../utils/catchAsync.js");

const getCartByUser = async (user) => {
  let cart = await Cart.findOne({ email: user.email });
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not have a cart");
  }
  return cart;
};

//  let cart = await Cart.findOne({ email: user.email });

//  //If the item is not in cart, create new Item
//  if (!cart) {
//    try {
//      cart = await Cart.create({
//        email: user.email,
//        cartItems: [],
//        paymentOption: config.default_payment_option,
//      });

//    } catch (error) {
//      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed");
//    }
//  }
//  //Additional check
//  if (cart == null)
//    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed");

//  //If the added Item already exists in the cart
//  //we are using == because the item.product._id is an object whereas productId is a string

//  if (cart.cartItems.some((item) => item.product._id == productId))
//    throw new ApiError(
//      httpStatus.BAD_REQUEST,
//      "Product already in cart. Use the cart sidebar to update or remove product from cart"
//    );

//  const product = await Product.findOne({ _id: productId });

//  if (!product)
//    throw new ApiError(
//      httpStatus.BAD_REQUEST,
//      "Product doesn't exist in database"
//    );

//  cart.cartItems.push({ product, quantity });
//  await cart.save(); //save in mongodb

//  return cart;

const addProductToCart = async (user, productId, quantity) => {
  let { email, _id } = user;

  const cart = await Cart.findOne({ userId: _id });

  let product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Product doesn't exist in database"
    );
  }
  if (!cart) {
    let newItem = new Cart({
      email: user.email,
      userId: _id,
      cartItems: [
        {
          product: product,
          quantity: quantity,
          seller_id: product.seller_id,
        },
      ],
    });
    let result = await newItem.save();
    return result;
  }

  cart.cartItems.forEach((element) => {
    if (element.product._id.toString() == productId) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Product already in cart. Use the cart sidebar to update or remove product from cart"
      );
    }
  });
  cart.cartItems.push({ product: product, quantity: quantity });
  let result = await cart.save();
  return result;
};

const updateProductInCart = async (user, productId, quantity) => {
  const userCart = await Cart.findOne({ userId: user._id });
  let count = 0;

  userCart.cartItems.forEach((element) => {
    if (element.product._id.toString() == productId) {
      count++;
    }
  });
  if (count == 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product not in cart");
  }
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Product doesn't exist in database"
    );
  }
  if (!userCart) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "User does not have a cart. Use POST to create cart and add a products"
    );
  }
  if (userCart) {
    userCart.cartItems.forEach((element) => {
      if (element.product._id.toString() == productId) {
        element.quantity = quantity;
      }
    });
    const result = await userCart.save();
    return result;
  }
  if (userCart == null) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed");
  }
};

const deleteProductFromCart = async (user, productId) => {
  let userCart = await Cart.findOne({ email: user.email });
  let count = 0;

  if (!userCart) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User does not have a cart");
  }
  userCart.cartItems.forEach((element, index) => {
    if (element.product._id.toString() == productId) {
      userCart.cartItems.splice(index, 1);
      count++;
    }
  });
  if (count == 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User does not have a cart");
  }
  const result = await userCart.save();
  // console.log(result);
  return result;
};

const checkout = async (user) => {
  try {
    let cart = await Cart.findOne({ email: user.email });
    if (!cart) {
      throw new ApiError(httpStatus.NOT_FOUND, "User does not have a cart");
    }

    if (cart.cartItems.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, "No product in user cart");
    }

    let check = await user.hasSetNonDefaultAddress();
    if (!check) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Address not set");
    }

    let totalWalletPrice = 0;
    cart.cartItems.forEach((element) => {
      totalWalletPrice += element.product.cost * element.quantity;
    });

    const newOrder = new Order({
      email: user.email,
      userId: user._id,
      cartItems: cart.cartItems,
      totalAmount: totalWalletPrice,
      status: "pending",
      paymentOption: cart.paymentOption,
      orderAddress: user.address,
    });
    const orders = await newOrder.save();

    cart.cartItems.forEach(async (item) => {
      console.log(item.product.seller_id);
      const pendingOrder = {
        orderId:orders._id,
        product_id: item.product._id,
        quantity: item.quantity,
        order_status: "pending",
        order_date: new Date(),
      };
      const seller = await User.findOne({_id: item.product.seller_id})
      seller.pendingOrders.push(pendingOrder)
      await seller.save();
    });

    cart.cartItems = [];
    await cart.save();

    return orders;
  } catch (err) {
    console.log(err);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err);
  }
};

module.exports = {
  getCartByUser,
  addProductToCart,
  updateProductInCart,
  deleteProductFromCart,
  checkout,
};
