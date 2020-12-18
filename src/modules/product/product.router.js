const {Router} = require("express");

const productRouter = Router();
const productController = require("./product.controller");
const userController = require("../user/user.controller");

productRouter.post(
  "/",
  userController.authorizeUser,
  productController.addProduct,
);

productRouter.get("/",
  productController.getListProducts,
);

module.exports = productRouter;