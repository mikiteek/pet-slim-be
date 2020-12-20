const {Router} = require("express");

const productRouter = Router();
const productController = require("./product.controller");
const userController = require("../user/user.controller");

productRouter.post( // only for admin
  "/",
  userController.authorizeUser,
  productController.addProduct,
);

productRouter.get("/",
  userController.authorizeUser,
  productController.getListProducts,
);

module.exports = productRouter;