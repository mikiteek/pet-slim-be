const request = require("supertest");
const mongoose = require("mongoose");

const User = require("../../modules/user/user.model");
const Server = require("../../server");
const {testUser} = require("./user.variables");

const server = new Server();
server.initServices();

const app = server.server;

describe("users mutations", () => {
  beforeAll(done => {
    done()
  });
  afterAll(done => {
    mongoose.connection.close()
    done()
  });
  let userResponse;
  describe("POST /users/register", () => {
    describe("when user does not exist", () => {
      it("should return 201, user created success", async () => {
        const response = await request(app)
          .post("/users/register")
          .set('Content-Type', 'application/json')
          .send({
            ...testUser,
          })
          .expect(201)
        userResponse = response.body;
      });
      afterAll(async () => {
        await User.findByIdAndDelete(userResponse.id);
      });
    });
  });
});