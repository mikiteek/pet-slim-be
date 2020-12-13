const Joi = require("joi");

const validateRegisterInput = (body) => {
  const validationSchema = Joi.object({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(50).required(),
  });
  const validationResult = validationSchema.validate(body);
  return validationResult.error;
}

const validateLoginInput = (body) => {
  const validationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(50).required(),
  });
  const validationResult = validationSchema.validate(body);
  return validationResult.error;
}

module.exports = {
  validateRegisterInput,
  validateLoginInput,
};