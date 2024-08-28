const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { productService } = require("../services");

/**
 * Get product by productId
 *
 * Example responses:
 * HTTP 200
 * {
 *      "_id": "5f71c1ca04c69a5874e9fd45",
 *      "name": "ball",
 *      "category": "Sports",
 *      "rating": 5,
 *      "cost": 20,
 *      "image": "google.com",
 *      "__v": 0
 * }
 *
 *
 */
const getProductById = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }
  res.send(product);
});

/**
 * Get list of all products
 *
 * [
 *  {
 *      "_id": "5f71c1ca04c69a5874e9fd45",
 *      "name": "ball",
 *      "category": "Sports",
 *      "rating": 5,
 *      "cost": 20,
 *      "image": "google.com",
 *      "__v": 0
 *  },
 *  {
 *      "_id": "5f71c1ca04c69a5874e9fd46",
 *      "name": "bat",
 *      "category": "Sports",
 *      "rating": 3,
 *      "cost": 20,
 *      "image": "google.com",
 *      "__v": 0
 *  }
 *]
 *
 */
const getProducts = catchAsync(async (req, res) => {
  const products = await productService.getProducts();
  res.send(products);
});

const addProduct = catchAsync(async (req, res) => {
  console.log(req.user);
   const product = await productService.addProduct(req.body,req.user);
    res.status(httpStatus.CREATED).send(product);
});

module.exports = {
  getProductById,
  getProducts,
  addProduct,
};
