const request = require("supertest");
const mongoose = require("mongoose");

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
});