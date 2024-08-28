const Joi = require("joi");
const { objectId } = require("./custom.validation");

const addProductToCart = {
  body: Joi.object().keys({
    productId: Joi.string().required().custom(objectId).messages({
      "string.custom.objectId": "Invalid product ID",
      "string.empty": "Product ID is required",
      
    }),
    quantity: Joi.number().required(),
    sellerId: Joi.string().required().custom(objectId).messages({
      "string.custom.objectId": "Invalid product ID",
      "string.empty": "Product ID is required",
      
    }),
  }),
};

module.exports = {
  addProductToCart,
};
