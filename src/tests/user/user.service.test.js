require("dotenv").config();
const mongoose = require("mongoose");
const databaseConnect = require("../../utils/database");

const User = require("../../modules/user/user.model");
const {testUser} = require("./user.variables");
const {createUserTestHelper} = require("./user.helper");

const {
  isUserExistService,
  calcDailyCaloriesService,
  checkDecodedUserOrThrowByTokenService,
  getTokenPayloadService,
  loginUserToReturnService,
  createdUserToReturnService,
} = require("../../modules/user/user.service");

describe("user service", () => {
  beforeAll(done => {
    done();
    databaseConnect();
  });
  afterAll(done => {
    mongoose.connection.close()
    done()
  });
  let userResponse, userCreated;
  describe("check user exist", () => {
    beforeAll(async () => {
      userCreated = await createUserTestHelper();
    });
    afterAll(async () => {
      await User.findByIdAndDelete(userCreated._id);
    });

    it("should be true", async () => {
      const user = await isUserExistService(userCreated.email);
      expect(user).toEqual(expect.objectContaining({
        email: expect.any(String),
        name: expect.any(String),
        role: expect.any(String)
      }));
      expect(user.email).toBe(userCreated.email);
      expect(user.name).toBe(userCreated.name);
      expect(user.role).toBe(userCreated.role);
    });
    it("should be false", async () => {
      const user = await isUserExistService("abrakadabra" + userCreated.email);
      expect(user).toBeNull();
    });
  });

  describe("calculate daily calories", () => {

  });

});