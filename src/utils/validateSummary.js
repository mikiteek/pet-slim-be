const Joi = require("joi");

const validateSummary = (body) => {
  const validationSchema = Joi.object({
    currentWeight: Joi.number().greater(30),
    height: Joi.number().greater(100).required(),
    age: Joi.number().integer().greater(10).required(),
    targetWeight: Joi.number().greater(30).required(),
    bloodType: Joi.number().integer().valid(1, 2, 3, 4).required(),
  });
  const validationResult = validationSchema.validate(body);
  return validationResult.error;
}

module.exports = {
  validateSummary,
};