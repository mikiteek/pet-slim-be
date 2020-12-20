require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

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
// database
databaseConnect();
// error middleware
app.use(errorMiddleware);

module.exports = app;