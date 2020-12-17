const Product = require("./product.model");

const getNotAllowedCategoryProducts = async (groupBlood) => {
  let queryParams;
  switch (groupBlood) {
    case 1:
      queryParams = { "groupBloodNotAllowed.1": true };
      break;
    case 2:
      queryParams = { "groupBloodNotAllowed.2": true };
      break;
    case 3:
      queryParams = { "groupBloodNotAllowed.3": true };
      break;
    case 4:
      queryParams = { "groupBloodNotAllowed.4": true };
      break;
    default:
      return false;
  }
  return await Product.distinct("categories", queryParams);
};

module.exports = {
  getNotAllowedCategoryProducts,
};