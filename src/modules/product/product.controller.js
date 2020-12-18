const Product = require("./product.model");
const {validateAddProduct} = require("../../utils/validateProduct");
const {UnauthorizedError, BadRequestError, NotFoundError} = require("../error/errors");
const {checkQueryParamsService} = require("./product.service");

class ProductController {
  async addProduct(req, res, next) {
    try {
      const {body, user} = req;
      if (user.role !== "admin") {
        throw new UnauthorizedError();
      }
      const error = validateAddProduct(body);
      if (error) {
        return res.status(400).send(error.details);
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
        throw new BadRequestError("Wrong query params");
      }
      const products = await Product.findByQuery(title, queryParams);
      if (!products.totalDocs) {
        throw new NotFoundError();
      }
      return res.status(200).json(products);
    }
    catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();