const {Router} = require("express");

const userRouter = Router();
const userController = require("./user.controller");

userRouter.post(
  "/register",
  userController.registerUser,
);

userRouter.post(
  "/login",
  userController.loginUser,
);

userRouter.post(
  "/regenerateToken",
  userController.authorizeUser,
  userController.regenerateAccessToken,
);

module.exports = userRouter;