require("dotenv").config();
const mongoose = require("mongoose");
const databaseConnect = require("../../utils/database");

const {
  getNotAllowedCategoryProducts,
  checkQueryParamsService,
} = require("../../modules/product/product.service");

describe("product service", () => {
  beforeAll(done => {
    done();
    databaseConnect();
  });
  afterAll(done => {
    mongoose.connection.close()
    done()
  });
  describe("get all not allowed categories of products", () => {
    it("should return array of categories", async () => {
      const categories = await getNotAllowedCategoryProducts(4);
      expect(categories).toEqual(expect.arrayContaining([expect.any(String)]));
    });

    it("should return false", async () => {
      const categories = await getNotAllowedCategoryProducts(5);
      expect(categories).toBe(false);
    });
  });

  describe("check query params for get products' list", () => {
    it("should return object with params",  () => {
      const query = {
        page: 2,
        limit: 15
      }
      const queryParams = checkQueryParamsService(query);
      expect(queryParams).toEqual({
        page: expect.any(Number),
        limit: expect.any(Number),
      });
    });

    it("should return object with params", () => {
      const query = {};
      const queryParams = checkQueryParamsService(query);
      expect(queryParams).toEqual({
        page: expect.any(Number),
        limit: expect.any(Number),
      });
    });
    it("should return false", () => {
      const query = {
        page: "5a",
        limit: "o1"
      }
      const queryParams = checkQueryParamsService(query);
      expect(queryParams).toBe(false);
    });
  });

});