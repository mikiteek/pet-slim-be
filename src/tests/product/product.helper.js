const request = require("supertest");
const app = require("../../server");
const {testAdmin} = require("./product.variables");
const {encryptPassword} = require("../../utils/passwordEncryptor");
const User = require("../../modules/user/user.model");

const createAdminTestHelper = async () => {
  const encryptedPass = await encryptPassword(testAdmin.password);
  const userCreated = new User({
    name: testAdmin.name,
    email: testAdmin.email,
    role: testAdmin.role,
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

const loginAdminTestHelper = async () => {
  const user = await request(app)
    .post("/users/login")
    .set('Content-Type', 'application/json')
    .send({
      email: testAdmin.email,
      password: testAdmin.password,
    });
  return user;
}

module.exports = {
  createAdminTestHelper,
  loginAdminTestHelper,
}