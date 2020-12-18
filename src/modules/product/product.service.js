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

const checkQueryParamsService = ({page=1, limit=10}) => {
  if (page < 1 || limit < 1 || isNaN(page) || isNaN(limit)) {
    return false;
  }
  return {
    page: Number(page),
    limit: Number(limit),
  };
}

module.exports = {
  getNotAllowedCategoryProducts,
  checkQueryParamsService,
};