require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRouter = require("./modules/auth/auth.router");
const userRouter = require("./modules/user/user.router");
const dayRouter = require("./modules/day/day.router");
const productRouter = require("./modules/product/product.router");

const databaseConnect = require("./utils/database");

const errorMiddleware = require("./middleware/errorMiddleware");

const PORT = process.env.PORT || 4000;

class Server {
  #server;

  constructor() {
    this.#server = express();
  }

  async start() {
    await this.initServices();
    this.startListening();
  }
  async initServices() {
    this.initMiddleware();
    this.initRoutes();
    await this.initDatabase();
    this.initErrorMiddleware();
  }

  startListening() {
    this.#server.listen(PORT, () => {
      console.log("Server is listening on port", PORT);
    });
  }

  get server() {
    return this.#server;
  }

  async initDatabase() {
    await databaseConnect();
  }

  initRoutes() {
    this.#server.use("/auth", authRouter);
    this.#server.use("/users", userRouter);
    this.#server.use("/products", productRouter);
    this.#server.use("/days", dayRouter);
  }

  initMiddleware() {
    this.#server.use(express.json());
    this.#server.use(cors());
    this.#server.use(morgan("combined"));
  }
  initErrorMiddleware() {
    this.#server.use(errorMiddleware);
  }
}

module.exports = Server;