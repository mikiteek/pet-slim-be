const request = require("supertest");
const app = require("../../server");
const {testUser} = require("./user.variables");
const {encryptPassword} = require("../../utils/passwordEncryptor");
const User = require("../../modules/user/user.model");

const createUserTestHelper = async () => {
  const encryptedPass = await encryptPassword(testUser.password);
  const userCreated = new User({
    name: testUser.name,
    email: testUser.email,
    credentials: [
      {
        source: "slimmom",
        hashPass: encryptedPass,
      },
    ],
  });
  await userCreated.save();
  return userCreated;
}

const loginUserTestHelper = async () => {
  const user = await request(app)
    .post("/users/login")
    .set('Content-Type', 'application/json')
    .send({
      email: testUser.email,
      password: testUser.password,
    });
  return user;
}

module.exports = {
  createUserTestHelper,
  loginUserTestHelper,
};