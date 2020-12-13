const {Router} = require("express");

const userRouter = Router();
const userController = require("./user.controller");

userRouter.post(
  "/register",
  userController.registerUser,
);

module.exports = userRouter;