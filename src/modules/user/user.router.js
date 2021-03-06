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
  "/logout",
  userController.authorizeUser,
  userController.logout,
);

userRouter.post(
  "/regenerateToken",
  userController.regenerateAccessToken,
);

userRouter.get(
  "/summary",
  userController.summaryPublic,
);

userRouter.post(
  "/summary",
  userController.authorizeUser,
  userController.summaryPrivate,
);

module.exports = userRouter;