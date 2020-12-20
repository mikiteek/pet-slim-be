const {Router} = require("express");

const dayRouter = Router();
const dayController = require("./day.controller");
const userController = require("../user/user.controller");

dayRouter.post(
  "/",
  userController.authorizeUser,
  dayController.addProductToDay,
);

dayRouter.delete(
  "/:id",
  userController.authorizeUser,
  dayController.removeProductFromDay,
);

dayRouter.get(
  "/:date",
  userController.authorizeUser,
  dayController.getDayInfo,
);

module.exports = dayRouter;