const {Types: {ObjectId: {isValid}}} = require("mongoose");

const validateObjectId = (id) => {
  return isValid(id);
}

module.exports = {
  validateObjectId,
};