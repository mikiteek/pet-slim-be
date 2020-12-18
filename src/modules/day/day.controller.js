const Day = require("./day.model");
const User = require("../user/user.model");
const {validateAddProductToDay} = require("../../utils/validateProduct");
const {validateObjectId} = require("../../utils/objectIdValidator");
const {BadRequestError} = require("../error/errors");
const {optionsUpdateUserService} = require("./day.service");

class DayController {
  async addProductToDay(req, res, next) {
    try {
      const {body, user} = req;
      const error = validateAddProductToDay(body);
      if (error) {
        return res.status(400).send(error.details);
      }
      const day = new Day(body);
      await day.save();
      const userUpdated = await User.findByIdAndUpdate(
        user.id,
        {
          $push: {daysProducts: day._id}
        },
        optionsUpdateUserService,
      );
      return res.status(201).json(userUpdated);
    }
    catch (error) {
      next(error);
    }
  }

  async removeProductFromDay(req, res, next) {
    try {
      const {params: {id}, user} = req;
      const valid = validateObjectId(id);
      if (!valid) {
        throw new BadRequestError("Wrong 'id' param");
      }
      const dayRemoved = await Day.findByIdAndRemove(id);
      if (!dayRemoved) {
        return res.status(204).json({message: "Nothing to remove"})
      }
      const userUpdated = await User.findByIdAndUpdate(
        user.id,
        {
          $pull: { daysProducts: id },
        },
        optionsUpdateUserService,
      );
      return res.status(200).json(userUpdated);
    }
    catch (error) {
      next(error);
    }
  }

  async getDayInfo(req, res, next) {
    try {

    }
    catch (error) {
      next(error);
    }
  }
}

module.exports = new DayController();