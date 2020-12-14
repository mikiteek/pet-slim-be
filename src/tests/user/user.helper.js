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

module.exports = {
  createUserTestHelper,
};