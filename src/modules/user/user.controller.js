const {encryptPassword} = require("../../utils/passwordEncryptor");
const {generateAccessToken} = require("../../utils/tokensGenerator");
const User = require("./user.model");
const {isUserExistService, createdUserToReturnService} = require("./user.service");
const {UserAlreadyExistError} = require("../error/errors");

class UserController {
  async registerUser(req, res, next) {
    try {
      const {body: {name, email, password}} = req;
      if (await isUserExistService(email)) {
        throw new UserAlreadyExistError();
      }
      const encryptedPass = await encryptPassword(password);
      const user = new User({
        name,
        email,
        credentials: [
          {
            source: "slimmom",
            hashPass: encryptedPass,
          },
        ],
      });
      const savedUser = await user.save();
      return res.status(201).json(createdUserToReturnService(savedUser));
    }
    catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();