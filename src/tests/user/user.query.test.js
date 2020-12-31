const request = require("supertest");
const mongoose = require("mongoose");

const User = require("../../modules/user/user.model");
const {createUserTestHelper, loginUserTestHelper} = require("./user.helper");
const app = require("../../server");

describe("users query", () => {
  beforeAll(done => {
    done()
  });
  afterAll(done => {
    mongoose.connection.close()
    done()
  });
  describe("GET /users/summary", () => {
    const queryStringCorrect = "currentWeight=50&height=170&age=31&targetWeight=45&bloodType=3"
    const queryStringInCorrect = "currentWeight=50&height=170&age=31&targetWeight=45&bloodType=5"
    it("should return 400", async () => {
      const response = await request(app)
        .get(`/users/summary?${queryStringInCorrect}`)
        .expect(400);
    });
    it("should return 200", async () => {
      const response = await request(app)
        .get(`/users/summary?${queryStringCorrect}`)
        .expect(200);
      expect(response.body).toEqual({
        dayNormCalories: expect.any(Number),
        notAllowedCategories: expect.arrayContaining([expect.any(String)]),
      })
    });
  });

  describe("POST /users/logout", () => {
    let userCreated, userLogined, token;
    beforeAll(async () => {
      userCreated = await createUserTestHelper();
      userLogined = await loginUserTestHelper();
      token = userLogined.body.token;
    });
    afterAll(async () => {
      await User.findByIdAndDelete(userCreated._id);
    });

    it("should return 200", async () => {
      const response = await request(app)
        .post("/users/logout")
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + token)
        .expect(200);
    });
  });
});