require("dotenv").config();
const mongoose = require("mongoose");
const databaseConnect = require("../../utils/database");

const User = require("../../modules/user/user.model");
const {testUser, testSummary} = require("./user.variables");
const {createUserTestHelper} = require("./user.helper");
const {UnauthorizedError} = require("../../modules/error/errors");

const {
  isUserExistService,
  calcDailyCaloriesService,
  checkDecodedUserOrThrowByTokenService,
  getTokenPayloadService,
  loginUserToReturnService,
  createdUserToReturnService,
  authorizeUserToReturnService,
  queryToNumbersService,
} = require("../../modules/user/user.service");

describe("user service", () => {
  let userResponse, userCreated;
  beforeAll( done => {
    done();
    databaseConnect();
  });
  afterAll( done => {
     mongoose.connection.close()
    done()
  });

  describe("calculate daily calories", () => {
    it("should return number of calories", () => {
      const dailyCal = calcDailyCaloriesService(testSummary);
      expect(dailyCal).toBeGreaterThan(500);
    });
  });

  describe("when need to create user in DB beforeAll", () => {
    beforeAll(async () => {
      userCreated = await createUserTestHelper();
    });
    afterAll(async () => {
      await User.findByIdAndDelete(userCreated._id);
    });

    describe("check user exist", () => {
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

    describe("check decoded user by token", () => {
      it("should throw Unauthorized error",  () => {
        const decoded = null;
        expect(async () => {
          await checkDecodedUserOrThrowByTokenService(decoded);
        }).rejects.toThrow(new UnauthorizedError());
      });
      it("should throw Unauthorized error",  () => {
        const decoded = {
          id: "abrakadabra",
          email: testUser.email,
        };
        expect(async () => {
          await checkDecodedUserOrThrowByTokenService(decoded);
        }).rejects.toThrow(new UnauthorizedError());
      });
      it("should return user",  async () => {
        const decoded = {
          id: userCreated._id,
          email: userCreated.email,
        };
        const user = await checkDecodedUserOrThrowByTokenService(decoded);
        expect(user).toEqual(expect.objectContaining({
          email: expect.any(String),
          name: expect.any(String),
          role: expect.any(String)
        }));
      });
    });

    describe("get token payload", () => {
      it("should return token payload", () => {
        const payload = getTokenPayloadService(userCreated);
        expect(payload).toEqual({
          id: expect.any(Object),
          email: expect.any(String),
        });
      });
    });

    describe("login user return to client", () => {
      it("should return login user object to client", () => {
        const user = loginUserToReturnService(userCreated);
        expect(user).toEqual(expect.objectContaining({
          id: expect.any(Object),
          email: expect.any(String),
          name: expect.any(String),
        }));
      });
    });

    describe("create user return to client", () => {
      it("should return create user object to client", () => {
        const user = createdUserToReturnService(userCreated);
        expect(user).toEqual(expect.objectContaining({
          id: expect.any(Object),
          registerDate: expect.any(Date),
          name: expect.any(String),
        }));
      });
    });

    describe("authorize user return to client", () => {
      it("should return create user object to client", () => {
        const user = authorizeUserToReturnService(userCreated);
        expect(user).toEqual(expect.objectContaining({
          id: expect.any(Object),
          email: expect.any(String),
          role: expect.any(String),
        }));
      });
    });

    describe("query for get summary to numbers", () => {
      it("should return create user object to client", () => {
        const user = queryToNumbersService(testSummary);
        expect(user).toEqual(expect.objectContaining({
          currentWeight: expect.any(Number),
          height: expect.any(Number),
          age: expect.any(Number),
          targetWeight: expect.any(Number),
          bloodType: expect.any(Number),
        }));
      });
    });
  });
});