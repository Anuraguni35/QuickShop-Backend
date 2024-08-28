const express = require("express");
const validate = require("../../middlewares/validate");
const productValidation = require("../../validations/product.validation");
const productController = require("../../controllers/product.controller");
const auth = require("../../middlewares/auth");
const router = express.Router();

router.get("/", productController.getProducts);
router.get(
  "/:productId",
  validate(productValidation.getProduct),
  productController.getProductById
);
router.post("/addProduct",auth,productController.addProduct)

module.exports = router;
