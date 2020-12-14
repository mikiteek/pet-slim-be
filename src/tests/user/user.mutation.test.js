const request = require("supertest");
const mongoose = require("mongoose");

const User = require("../../modules/user/user.model");
const app = require("../../server");
const {testUser} = require("./user.variables");
const {createUserTestHelper} = require("./user.helper");

describe("users mutations", () => {
  beforeAll(done => {
    done()
  });
  afterAll(done => {
    mongoose.connection.close()
    done()
  });
  let userResponse, userCreated;
  describe("POST /users/register", () => {
    describe("when user does not exist", () => {
      it("should return 201, user created success", async () => {
        const response = await request(app)
          .post("/users/register")
          .set('Content-Type', 'application/json')
          .send({
            ...testUser,
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
});