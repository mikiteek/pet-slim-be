const {encryptPassword} = require("../../utils/passwordEncryptor");
const {isPasswordValid} = require("../../utils/isPasswordValid");
const {generateAccessToken, generateRefreshToken} = require("../../utils/tokensGenerator");
const User = require("./user.model");
const {isUserExistService, createdUserToReturnService, loginUserToReturnService} = require("./user.service");
const {UserAlreadyExistError, NotFoundError} = require("../error/errors");
const {validateRegisterInput, validateLoginInput} = require("../../utils/validateUser");

class UserController {
  async registerUser(req, res, next) {
    try {
      const {body: {name, email, password}, body} = req;
      const error = validateRegisterInput(body);
      if (error) {
        return res.status(400).send(error.details);
      }
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

  async loginUser(req, res, next) {
    try {
      const {body: {email, password}, body} = req;
      const error = validateLoginInput(body);
      if (error) {
        return res.status(400).send(error.details);
      }
      const user = await User.findOne(
        {email},
        {
          email: true,
          name: true,
          credentials: true,
        }
      );
      if (!user) {
        throw new NotFoundError("Wrong email or password");
      }
      const match = await isPasswordValid(
        password,
        user.credentials.find(cred => cred.source === "slimmom").hashPass,
      );
      if (!match) {
        throw new NotFoundError("Wrong email or password");
      }
      const tokenPayload = {
        id: user._id,
        email: user.email,
      }
      return res.status(200).json({
        user: loginUserToReturnService(user),
        refreshToken: await generateAccessToken(tokenPayload),
        token: await generateRefreshToken(tokenPayload),
      });
    }
    catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();