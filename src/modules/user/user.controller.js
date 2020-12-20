const User = require("./user.model");
const Summary = require("./summary.model");
const {encryptPassword} = require("../../utils/passwordEncryptor");
const {isPasswordValid} = require("../../utils/isPasswordValid");
const {generateAccessToken, generateRefreshToken} = require("../../utils/tokensGenerator");
const {
  isUserExistService,
  createdUserToReturnService,
  loginUserToReturnService,
  getTokenPayloadService,
  checkDecodedUserOrThrowByTokenService,
  authorizeUserToReturnService,
  calcDailyCaloriesService,
  queryToNumbersService,
} = require("./user.service");
const {getNotAllowedCategoryProducts} = require("../product/product.service");
const {UserAlreadyExistError, NotFoundError, UnauthorizedError} = require("../error/errors");
const {validateRegisterInput, validateLoginInput} = require("../../utils/validateUser");
const {verifyAccessToken, verifyRefreshToken} = require("../../utils/verifyToken");
const {validateSummary} = require("../../utils/validateSummary");

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
      const user = await User.findOne({email});
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
      const tokenPayload = getTokenPayloadService(user);
      return res.status(200).json({
        user: loginUserToReturnService(user),
        refreshToken: await generateRefreshToken(tokenPayload),
        token: await generateAccessToken(tokenPayload),
      });
    }
    catch (error) {
      next(error);
    }
  }

  async authorizeUser(req, res, next) {
    try {
      const authorizationHeader = req.get("Authorization");
      if (!authorizationHeader) {
        throw new UnauthorizedError();
      }
      const token = authorizationHeader.replace("Bearer ", "");
      const decoded = await verifyAccessToken(token);
      const user = await checkDecodedUserOrThrowByTokenService(decoded);

      req.user = authorizeUserToReturnService(user);
      req.token = token;
      next();
    }
    catch (error) {
      next(error);
    }
  }

  async regenerateAccessToken(req, res, next) {
    try {
      const {body: {refreshToken}} = req;
      const decoded = await verifyRefreshToken(refreshToken);
      const user = await checkDecodedUserOrThrowByTokenService(decoded);

      const tokenPayload = getTokenPayloadService(user);
      const token = await generateAccessToken(tokenPayload);
      return res.status(200).json({token});
    }
    catch (error) {
      next(error);
    }
  }

  async summaryPublic(req, res, next) {
    try {
      const {query} = req;
      const error = validateSummary(query);
      if (error) {
        return res.status(400).send(error.details);
      }
      const queryNumbersType = queryToNumbersService(query);
      const summary = {
        dayNormCalories: calcDailyCaloriesService(queryNumbersType),
        notAllowedCategories: await getNotAllowedCategoryProducts(queryNumbersType.bloodType),
      }
      return res.status(200).json(summary)
    }
    catch (error) {
      next(error);
    }
  }

  async summaryPrivate(req, res, next) {
    try {
      const {body, user} = req;
      const error = validateSummary(body);
      if (error) {
        return res.status(400).send(error.details);
      }
      let summary = await Summary.findOneAndUpdate(
        {
          user: user.id
        },
        {
          ...body,
          dayNormCalories: calcDailyCaloriesService(body),
          notAllowedCategories: await getNotAllowedCategoryProducts(body.bloodType),
        },
        {
          new: true,
        }
      );
      if (!summary) {
        summary = new Summary({
          ...body,
          user: user.id,
          dayNormCalories: calcDailyCaloriesService(body),
          notAllowedCategories: await getNotAllowedCategoryProducts(body.bloodType),
        });
        await summary.save();
        return res.status(201).json(summary);
      }
      return res.status(200).json(summary);
    }
    catch (error) {
      next(error);
    }
  }

}

module.exports = new UserController();