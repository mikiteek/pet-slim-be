require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");

const userRouter = require("./modules/user/user.router");
const dayRouter = require("./modules/day/day.router");
const productRouter = require("./modules/product/product.router");

const databaseConnect = require("./utils/database");

const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();
// middleware
app.use(express.json());
app.use(cors());
app.use(morgan("combined"));
// routes
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/days", dayRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// database
databaseConnect();
// error middleware
app.use(errorMiddleware);

module.exports = app;