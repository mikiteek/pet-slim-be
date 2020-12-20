const Day = require("./day.model");
const {validateAddProductToDay} = require("../../utils/validateProduct");
const {validateObjectId} = require("../../utils/objectIdValidator");
const {validateDayForGetInfo} = require("../../utils/validateDay");
const {BadRequestError} = require("../error/errors");

class DayController {
  async addProductToDay(req, res, next) {
    try {
      const {body, user} = req;
      const error = validateAddProductToDay(body);
      if (error) {
        return res.status(400).send(error.details);
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
        throw new BadRequestError("Wrong 'id' param");
      }
      const dayRemoved = await Day.findByIdAndRemove(id);
      if (!dayRemoved) {
        return res.status(204).json({message: "Nothing to remove"})
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
        return res.status(400).send(error.details);
      }
      const dayProducts = await Day.getDayProducts(date, user);

      return res.status(200).json(dayProducts);
    }
    catch (error) {
      next(error);
    }
  }
}

module.exports = new DayController();