const User = require("./user.model");
const {UnauthorizedError} = require("../error/errors");

const isUserExistService = async (email) => {
  const user = await User.findOne({email});
  return user;
}

const createdUserToReturnService = (user) => {
  return {
    id: user._id,
    name: user.name,
    registerDate: user.registerDate
  }
};

const loginUserToReturnService = (user) => {
  return {
    id: user._id,
    email: user.email,
    name: user.name,
  }
};

const getTokenPayloadService = (user) => {
  return {
    id: user._id,
    email: user.email,
  }
};

const checkDecodedUserOrThrowByTokenService = async (decoded) => {
  try {
    if (!decoded) {
      throw new UnauthorizedError();
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new UnauthorizedError();
    }
    return user;
  }
  catch (error) {
    throw new UnauthorizedError();
  }
}

module.exports = {
  isUserExistService,
  createdUserToReturnService,
  loginUserToReturnService,
  getTokenPayloadService,
  checkDecodedUserOrThrowByTokenService,
};