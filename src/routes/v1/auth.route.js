const express = require("express");
const validate = require("../../middlewares/validate");
const authValidation = require("../../validations/auth.validation");
const authController = require("../../controllers/auth.controller");
const auth = require("../../middlewares/auth");
const router = express.Router();

//"/v1/auth/register" and "/v1/auth/login" routes with request validation
router.get('/authCheck',auth,authController.authCheck)
router.post('/register',validate(authValidation.register),authController.register);
router.post('/login',validate(authValidation.login),authController.login);


module.exports = router;
