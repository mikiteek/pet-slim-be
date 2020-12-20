const request = require("supertest");
const mongoose = require("mongoose");

const Day = require("../../modules/day/day.model");
const User = require("../../modules/user/user.model");
const app = require("../../server");
const {createUserTestHelper, loginUserTestHelper} = require("../user/user.helper");
const {testUser} = require("../user/user.variables");
const {createDayTestHelper} = require("./day.helper");
const {testDay} = require("./day.variables");

describe("days query", () => {
  beforeAll(done => {
    done()
  });
  afterAll(done => {
    mongoose.connection.close()
    done()
  });
  let userCreated, userLogined, token, dayCreated;
  describe("GET /days/:date", () => {
    beforeAll(async () => {
      userCreated = await createUserTestHelper();
      userLogined = await loginUserTestHelper();
      token = userLogined.body.token;
      dayCreated = await createDayTestHelper(userCreated._id);
    });
    afterAll(async () => {
      await User.findByIdAndDelete(userCreated._id);
      await Day.findByIdAndDelete(dayCreated._id);
    });

    it("should return 400", async () => {
      const response = await request(app)
        .get("/days/dfsfs")
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + token)
        .expect(400)
    });

    it("should return 400", async () => {
      const response = await request(app)
        .get("/days/2020-20-10")
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + token)
        .expect(400)
    });

    it("should return 404", async () => {
      const response = await request(app)
        .get("/days/")
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + token)
        .expect(404)
    });

    it("should return 200", async () => {
      const response = await request(app)
        .get(`/days/${testDay.date}`)
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + token)
        .expect(200);
      expect(response.body).toEqual(expect.arrayContaining([
        expect.objectContaining({
          _id: expect.any(String),
          product: expect.objectContaining({
            _id: expect.any(String),
            weight: expect.any(Number),
            title: expect.objectContaining({
              ru: expect.any(String),
              ua: expect.any(String),
            }),
            calories: expect.any(Number),
          }),
          date: expect.any(String),
          totalWeight: expect.any(Number),
          totalCalories: expect.any(Number),
        }),
      ]));
    });
  });
});