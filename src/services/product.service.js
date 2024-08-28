const { Product } = require("../models");
const  ApiError =require("../utils/ApiError")
const httpStatus = require("http-status");
/**
 * Get Product by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getProductById = async (id) => {
  return Product.findById(id);
};

/**
 * Fetch all products
 * @returns {Promise<List<Products>>}
 */
const getProducts = async () => {
  return Product.find({}).select("-seller_id").lean();
};

const addProduct=async(product,user)=>{
  if (user.role != "seller") {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not authorized to add product"
    );
  }
  const productCheck=await Product.find({name: product.name})
  if(productCheck){
    throw new ApiError(httpStatus.BAD_REQUEST, "Product already exists");
  }
  return Product.create(product);
}

module.exports = {
  getProductById,
  getProducts,
  addProduct
};
