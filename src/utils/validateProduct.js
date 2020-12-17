const Joi = require("joi");

const validateAddProduct = (body) => {
  const validationSchema = Joi.object({
    categories: Joi.array().items(Joi.string()),
    weight: Joi.number().positive().default(100),
    title: Joi.object({
      ru: Joi.string().required(),
      ua: Joi.string().required(),
    }),
    calories: Joi.number().positive().required(),
    groupBloodNotAllowed: Joi.object({
      1: Joi.boolean().required(),
      2: Joi.boolean().required(),
      3: Joi.boolean().required(),
      4: Joi.boolean().required(),
    }),
  });
  const validationResult = validationSchema.validate(body);
  return validationResult.error;
}

module.exports = {
  validateAddProduct,
};