const request = require("supertest");
const mongoose = require("mongoose");

const User = require("../../modules/user/user.model");
const Product = require("../../modules/product/product.model");
const app = require("../../server");
const {testProduct} = require("./product.variables");
const {loginAdminTestHelper, createAdminTestHelper} = require("./product.helper");
const {loginUserTestHelper, createUserTestHelper} = require("../user/user.helper");

describe("products query", () => {
  beforeAll(done => {
    done()
  });
  afterAll(done => {
    mongoose.connection.close()
    done()
  });
  let productCreated, adminCreated, adminLogined, userCreated, userLogined, adminToken, userToken;
  describe("POST /products/", () => {
    beforeAll(async () => {
      adminCreated = await createAdminTestHelper();
      adminLogined = await loginAdminTestHelper();
      userCreated = await createUserTestHelper();
      userLogined = await loginUserTestHelper();
      adminToken = adminLogined.body.token;
      userToken = userLogined.body.token;
    });
    afterAll(async () => {
      await User.findByIdAndDelete(adminCreated._id);
      await User.findByIdAndDelete(userCreated._id);
      await Product.findByIdAndDelete(productCreated._id);
    });
    it("should return 401", async () => {
      const response = await request(app)
        .post("/products/")
        .set('Content-Type', 'application/json')
        .set("Authorization", "Bearer " + userToken)
        .send(testProduct)
        .expect(401);
    });
    it("should return 400", async () => {
      const response = await request(app)
        .post("/products/")
        .set('Content-Type', 'application/json')
        .set("Authorization", "Bearer " + adminToken)
        .send({
          ...testProduct,
          weight: -20,
        })
        .expect(400);
    });
    it("should return 201", async () => {
      const response = await request(app)
        .post("/products/")
        .set('Content-Type', 'application/json')
        .set("Authorization", "Bearer " + adminToken)
        .send(testProduct)
        .expect(201);
      productCreated = response.body;
      expect(response.body).toEqual(expect.objectContaining({
        title: expect.objectContaining({
          ru: expect.any(String),
          ua: expect.any(String),
        }),
        groupBloodNotAllowed: expect.objectContaining({
          1: expect.any(Boolean),
          2: expect.any(Boolean),
          3: expect.any(Boolean),
          4: expect.any(Boolean),
        }),
        categories: expect.arrayContaining([expect.any(String)]),
        weight: expect.any(Number),
        _id: expect.any(String),
        calories: expect.any(Number),
      }))
    });
  })
});