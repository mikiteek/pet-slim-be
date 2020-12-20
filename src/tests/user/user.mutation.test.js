const request = require("supertest");
const mongoose = require("mongoose");

const User = require("../../modules/user/user.model");
const Summary = require("../../modules/user/summary.model");
const app = require("../../server");
const {testUser, testUserRegisterBlock, testSummary} = require("./user.variables");
const {createUserTestHelper, loginUserTestHelper} = require("./user.helper");

describe("users mutations", () => {
  beforeAll(done => {
    done()
  });
  afterAll(done => {
    mongoose.connection.close()
    done()
  });
  let userResponse, userCreated, userLogined, refreshToken, token;
  describe("POST /users/register", () => {
    describe("when user does not exist", () => {
      it("should return 201, user created success", async () => {
        const response = await request(app)
          .post("/users/register")
          .set('Content-Type', 'application/json')
          .send({
            ...testUserRegisterBlock,
          })
          .expect(201);
        userResponse = response.body;
      });
      afterAll(async () => {
        await User.findByIdAndDelete(userResponse.id);
      });
    });

    describe("when user exist", () => {
      it("should return 409", async () => {
        const response = await request(app)
          .post("/users/register")
          .set('Content-Type', 'application/json')
          .send({
            ...testUser,
          })
          .expect(409);
      });
      beforeAll(async () => {
        userCreated = await createUserTestHelper();
      });
      afterAll(async () => {
        await User.findByIdAndDelete(userCreated._id);
      });
    });

    describe("when wrong input email or password", () => {
      it("should return 400, bad request, bad email", async () => {
        const response = await request(app)
          .post("/users/register")
          .set('Content-Type', 'application/json')
          .send({
            name: testUser.name,
            email: "darkogmail.com",
            password: testUser.password,
          })
          .expect(400);
        expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining({
          message: expect.any(String),
        })]));
      });
      it("should return 400, bad request, bad name", async () => {
        const response = await request(app)
          .post("/users/register")
          .set('Content-Type', 'application/json')
          .send({
            name: "j",
            email: testUser.email,
            password: testUser.password,
          })
          .expect(400);
        expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining({
          message: expect.any(String),
        })]));
      });
      it("should return 400, bad request, bad password", async () => {
        const response = await request(app)
          .post("/users/register")
          .set('Content-Type', 'application/json')
          .send({
            name: testUser.email,
            email: testUser.email,
            password: "1111",
          })
          .expect(400);
        expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining({
          message: expect.any(String),
        })]));
      });
      it("should return 400, bad request, params are required", async () => {
        const response = await request(app)
          .post("/users/register")
          .set('Content-Type', 'application/json')
          .send({})
          .expect(400);
        expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining({
          message: expect.any(String),
        })]));
      });
    });
  });

  describe("POST /users/login", () => {
    beforeAll(async () => {
      userCreated = await createUserTestHelper();
    });
    afterAll(async () => {
      await User.findByIdAndDelete(userCreated._id);
    });
    describe("when wrong input email or password", () => {
      it("should return 400, bad request, bad email", async () => {
        const response = await request(app)
          .post("/users/login")
          .set('Content-Type', 'application/json')
          .send({
            email: testUser.email.replace("@", ""),
            password: testUser.password,
          })
          .expect(400);
        expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining({
          message: expect.any(String),
        })]));
      });
      it("should return 400, bad request, bad pass", async () => {
        const response = await request(app)
          .post("/users/login")
          .set('Content-Type', 'application/json')
          .send({
            email: testUser.email,
            password: "1111",
          })
          .expect(400);
        expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining({
          message: expect.any(String),
        })]));
      });
      it("should return 404, not found, wrong email or password", async () => {
        const response = await request(app)
          .post("/users/login")
          .set('Content-Type', 'application/json')
          .send({
            email: testUser.email,
            password: testUser.password + "1",
          })
          .expect(404);
      });
      it("should return 404, not found, wrong email or password", async () => {
        const response = await request(app)
          .post("/users/login")
          .set('Content-Type', 'application/json')
          .send({
            email: Date.now() + testUser.email,
            password: testUser.password,
          })
          .expect(404);
      });
    });
    describe("correct email and password" , () => {
      it("should return 200", async () => {
        const response = await request(app)
          .post("/users/login")
          .set('Content-Type', 'application/json')
          .send({
            email: testUser.email,
            password: testUser.password,
          })
          .expect(200);
        expect(response.body).toHaveProperty("user");
        expect(response.body).toHaveProperty("refreshToken");
        expect(response.body).toHaveProperty("token");
        expect(response.body).toEqual({
          user: expect.objectContaining({
            id: expect.any(String),
            email: expect.any(String),
            name: expect.any(String),
          }),
          refreshToken: expect.any(String),
          token: expect.any(String),
        });
      });
    });
  });

  describe("POST /users/regenerateToken", () => {
    beforeAll(async () => {
      userCreated = await createUserTestHelper();
      userLogined = await loginUserTestHelper();
      token = userLogined.body.token;
      refreshToken = userLogined.body.refreshToken;
    });
    afterAll(async () => {
      await User.findByIdAndDelete(userCreated._id);
    });

    it("should return 401", async () => {
      const badToken = "!" + refreshToken.substr(0, refreshToken.length - 2) + "!";
      const response = await request(app)
        .post("/users/regenerateToken")
        .set("Accept", "application/json")
        .send({
          refreshToken: badToken,
        })
        .expect(401);
    });
    it("should return 200", async () => {
      const response = await request(app)
        .post("/users/regenerateToken")
        .set("Accept", "application/json")
        .send({
          refreshToken,
        })
        .expect(200);
      expect(response.body).toEqual({
        token: expect.any(String),
      });
    });
  });

  describe("POST /users/summary", () => {
    beforeAll(async () => {
      userCreated = await createUserTestHelper();
      userLogined = await loginUserTestHelper();
      token = userLogined.body.token;
    });
    afterAll(async () => {
      await User.findByIdAndDelete(userCreated._id);
    });
    it("should return 400", async () => {
      const response = await request(app)
        .post("/users/summary")
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + token)
        .send({
          ...testSummary,
          bloodType: 5,
        })
        .expect(400);
    });
    describe("when summary already exist", () => {
      let summaryCreated;
      beforeAll(async () => {
        summaryCreated = new Summary({
          ...testSummary,
          user: userCreated._id,
          dayNormCalories: 1800,
          notAllowedCategories: ["зерновые", "мучные"],
        });
        await summaryCreated.save();
      });
      afterAll(async () => {
        await Summary.findByIdAndDelete(summaryCreated._id);
      });
      it("should return 200", async () => {
        const response = await request(app)
          .post("/users/summary")
          .set("Accept", "application/json")
          .set("Authorization", "Bearer " + token)
          .send(testSummary)
          .expect(200);
        expect(response.body).toEqual(expect.objectContaining({
          _id: expect.any(String),
          user: expect.any(String),
          currentWeight: expect.any(Number),
          height: expect.any(Number),
          age: expect.any(Number),
          targetWeight: expect.any(Number),
          bloodType: expect.any(Number),
          dayNormCalories: expect.any(Number),
          notAllowedCategories: expect.arrayContaining([expect.any(String)]),
        }));
      });

    });

    describe("when summary does not exist", () => {
      let summaryCreated;
      afterAll(async () => {
        await Summary.findByIdAndDelete(summaryCreated._id);
      });
      it("should return 201", async () => {
        const response = await request(app)
          .post("/users/summary")
          .set("Accept", "application/json")
          .set("Authorization", "Bearer " + token)
          .send(testSummary)
          .expect(201);
        summaryCreated = response.body;
        expect(response.body).toEqual(expect.objectContaining({
          _id: expect.any(String),
          user: expect.any(String),
          currentWeight: expect.any(Number),
          height: expect.any(Number),
          age: expect.any(Number),
          targetWeight: expect.any(Number),
          bloodType: expect.any(Number),
          dayNormCalories: expect.any(Number),
          notAllowedCategories: expect.arrayContaining([expect.any(String)]),
        }));
      });
    });
  });
});