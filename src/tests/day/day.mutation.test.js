const request = require("supertest");
const mongoose = require("mongoose");

const Day = require("../../modules/day/day.model");
const User = require("../../modules/user/user.model");
const app = require("../../server");
const {createUserTestHelper, loginUserTestHelper} = require("../user/user.helper");
const {testUser} = require("../user/user.variables");
const {createDayTestHelper} = require("./day.helper");
const {testDay, testWrongDayId} = require("./day.variables");

describe("days mutation", () => {
  beforeAll(done => {
    done()
  });
  afterAll(done => {
    mongoose.connection.close()
    done()
  });
  let userCreated, userLogined, token, dayCreated;
  describe("for register and login test user before and after", () => {
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

    describe("add product, POST /days/", () => {
      let dayAdded;
      it("should return 201", async () => {
        const response = await request(app)
          .post("/days/")
          .set("Accept", "application/json")
          .set("Authorization", "Bearer " + token)
          .send(testDay)
          .expect(201)
        dayAdded = response.body;
        expect(response.body).toEqual(expect.objectContaining({
          _id: expect.any(String),
          product: expect.any(String),
          weight: expect.any(Number),
          date: expect.any(String),
          user: expect.any(String),
        }))
      });
      it("should return 400", async () => {
        const response = await request(app)
          .post("/days/")
          .set("Accept", "application/json")
          .set("Authorization", "Bearer " + token)
          .send({
            date: testDay.date,
            weight: testDay.weight
          })
          .expect(400)
      });
      afterAll(async () => {
        await Day.findByIdAndDelete(dayAdded._id);
      });
    });

    describe("remove product, DELETE /days/:id", () => {
      it("should return 400", async () => {
        const response = await request(app)
          .delete("/days/abracadabra")
          .set("Accept", "application/json")
          .set("Authorization", "Bearer " + token)
          .expect(400)
      });
      it("should return 204", async () => {
        const response = await request(app)
          .delete(`/days/${testWrongDayId}`)
          .set("Accept", "application/json")
          .set("Authorization", "Bearer " + token)
          .expect(204)
      });
      it("should return 200", async () => {
        const response = await request(app)
          .delete(`/days/${dayCreated._id}`)
          .set("Accept", "application/json")
          .set("Authorization", "Bearer " + token)
          .expect(200)
      });
    });

  });

});