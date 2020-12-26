const Day = require("./day.model");
const Product = require("../product/product.model");
const {validateAddProductToDay} = require("../../utils/validateProduct");
const {validateObjectId} = require("../../utils/objectIdValidator");
const {validateDayForGetInfo} = require("../../utils/validateDay");
const {BadRequestError, NotFoundError} = require("../error/errors");

class DayController {
  async addProductToDay(req, res, next) {
    try {
      const {body, user} = req;
      const error = validateAddProductToDay(body);
      if (error) {
        return res.status(400).json(error.details);
      }
      const validProductId = validateObjectId(body.product);
      if(!validProductId) {
        return res.status(404).json({message: "Wrong Id param"});
      }
      const product = await Product.findById(body.product);
      if (!product) {
        return res.status(404).json(NotFoundError);
      }

      const day = new Day({
        ...body,
        user: user.id,
      });
      await day.save();
      return res.status(201).json(day);
    }
    catch (error) {
      next(error);
    }
  }

  async removeProductFromDay(req, res, next) {
    try {
      const {params: {id}} = req;
      const valid = validateObjectId(id);
      if (!valid) {
        return res.status(400).json({message: "Wrong 'id' param"});
      }
      const dayRemoved = await Day.findByIdAndRemove(id);
      if (!dayRemoved) {
        return res.status(204).json({message: "Nothing to remove"});
      }
      return res.status(200).json(dayRemoved);
    }
    catch (error) {
      next(error);
    }
  }

  async getDayInfo(req, res, next) {
    try {
      const {params: {date}, user} = req;
      const error = validateDayForGetInfo(date);
      if (error) {
        return res.status(400).json(error.details);
      }
      const dayProducts = await Day.getDayProducts(date, user);
      if (!dayProducts.length) {
        return res.status(404).json(NotFoundError)
      }
      return res.status(200).json(dayProducts);
    }
    catch (error) {
      next(error);
    }
  }
}

module.exports = new DayController();