const request = require("supertest");
const mongoose = require("mongoose");

const Product = require("../../modules/product/product.model");
const app = require("../../server");

describe("product queries", () => {
  beforeAll(done => {
    done()
  });
  afterAll(done => {
    mongoose.connection.close()
    done()
  });
  describe("GET /products", () => {
    it('should return 200', async () => {
      const response = await request(app)
        .get("/products")
        .expect(200);
    });

    it('should return products, where name includes query', async () => {
      const uri = encodeURI("/products?title=омлет");
      const response = await request(app)
        .get(uri)
        .expect(200);

      expect(response.body).toEqual({
        docs: expect.arrayContaining([
          expect.objectContaining({
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
          })
        ]),
        totalDocs: expect.any(Number),
        limit: expect.any(Number),
        totalPages: expect.any(Number),
        page: expect.any(Number),
        pagingCounter: expect.any(Number),
        hasPrevPage: expect.any(Boolean),
        hasNextPage: expect.any(Boolean),
        prevPage: expect.any(Object), // how to define null or Number
        nextPage: expect.any(Object), // how to define null or Number
      });
    });
    it('should return 404', async () => {
      const uri = encodeURI("/products?title=абра-кадабра");
      const response = await request(app)
        .get(uri)
        .expect(404);
    });
  });
});