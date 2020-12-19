const Joi = require("joi");

const validateDayForGetInfo = (dateDay) => {
  const validationSchema = Joi.date().required();
  const validationResult = validationSchema.validate(dateDay);
  return validationResult.error;
}

module.exports = {
  validateDayForGetInfo,
}