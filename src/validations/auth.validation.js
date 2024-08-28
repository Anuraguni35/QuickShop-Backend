const Joi = require("joi");
const { password } = require("./custom.validation");

/**
 * Check request *body* for fields (all are *required*)
 * - "email" : string and satisyfing email structure
 * - "password": string and satisifes the custom password structure defined in "src/validations/custom.validation.js"
 * - "name": string
 * - "role":string
 */
const register = {
  body:Joi.object().keys({
    email:Joi.string().email().required().messages({
      'string.email':"email should be a valid email",
       'any.required': `email is a required field`
    }),   //email validation missing here.
    password:Joi.string().min(8).pattern(new RegExp('[^a-zA-Z0-9]')).required().messages({
      'string.base': `password should be a type of text`,
      'string.empty': `password cannot be an empty field`,
      'string.min': `password should have a minimum length of {#limit}`,
      'any.required': `password is a required field`,
      'string.pattern.base': `password should contain at least one special character`,
    }),
    name:Joi.string().required(),
    role: Joi.string().valid('buyer', 'seller').required().messages({
      'any.only': `role must be either 'buyer' or 'seller'`,
      'any.required': `role is a required field`
    })
  })
};

/**
 * Check request *body* for fields 
 * - "email" : string and satisyfing email structure
 * - "password": string and satisifes the custom password structure 
 */
const login = {
  body:Joi.object().keys({
    email:Joi.string().email().required().messages({
      'string.email':"email should be a valid email",
      'any.required': `email is a required field`
    }),
    password:Joi.string().min(8).pattern(new RegExp('[^a-zA-Z0-9]')).required().messages({
      'string.base': `password should be a type of text`,
      'string.empty': `password cannot be an empty field`,
      'string.min': `password should have a minimum length of {#limit}`,
      'any.required': `password is a required field`,
      'string.pattern.base': `password should contain at least one special character`,
    }),
  })
};

module.exports = {
  register,
  login,
};
