const Product = require("./product.model");
const {validateAddProduct} = require("../../utils/validateProduct");
const {UnauthorizedError, NotFoundError} = require("../error/errors");
const {checkQueryParamsService} = require("./product.service");

class ProductController {
  async addProduct(req, res, next) {
    try {
      const {body, user} = req;
      if (user.role !== "admin") {
        return res.status(401).json(UnauthorizedError);
      }
      const error = validateAddProduct(body);
      if (error) {
        return res.status(400).json(error.details);
      }
      const product = new Product(body);
      await product.save();
      return res.status(201).json(product);
    }
    catch (error) {
      next(error);
    }
  }

  async getListProducts(req, res, next) {
    try {
      const {query, query: {title}} = req;
      const queryParams = checkQueryParamsService(query);
      if (!queryParams) {
        return res.status(400).json({message: "Bad query params"})
      }
      const products = await Product.findByQuery(title, queryParams);
      if (!products.totalDocs) {
        return res.status(404).json(NotFoundError);
      }
      return res.status(200).json(products);
    }
    catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();