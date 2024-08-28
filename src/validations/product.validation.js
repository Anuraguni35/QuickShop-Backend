const Joi = require("joi");
const { objectId } = require("./custom.validation");

const getProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

const addProduct={
  body:Joi.object().keys({
    name: Joi.string().required(),
    category: Joi.string().required(),
    cost:Joi.number().required(),
    rating: Joi.number().required(),
    image:Joi.string().required(),
  }),
}
module.exports = {
  getProduct,
  addProduct
};
