const Product = require("./product.model");
const {validateAddProduct} = require("../../utils/validateProduct");
const {UnauthorizedError} = require("../error/errors");

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
      const product = new Product({...body});
      await product.save();
      return res.status(201).json(product);
    }
    catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();