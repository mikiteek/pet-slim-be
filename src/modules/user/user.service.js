const User = require("./user.model");
const {UnauthorizedError} = require("../error/errors");

const isUserExistService = async (email) => {
  try {
    const user = await User.findOne({email});
    return user;
  }
  catch (error) {
    console.log(error.message)
  }
}

const createdUserToReturnService = (user) => {
  return {
    id: user._id,
    name: user.name,
    registerDate: user.registerDate
  };
}

const loginUserToReturnService = (user) => {
  return {
    id: user._id,
    email: user.email,
    name: user.name,
  };
}

const getTokenPayloadService = (user) => {
  return {
    id: user._id,
    email: user.email,
  };
}

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

const authorizeUserToReturnService = (user) => {
  return {
    id: user._id,
    email: user.email,
    role: user.role,
  };
}

const calcDailyCaloriesService = ({currentWeight, height, age, targetWeight}) => {
  const dailyCal =
    10 * currentWeight +
    6.25 * height -
    5 * age -
    161 -
    10 * (currentWeight - targetWeight);
  return dailyCal;
}

const queryToNumbersService = ({currentWeight, height, age, targetWeight, bloodType}) => {
  return {
    currentWeight: Number(currentWeight),
    height: Number(height),
    age: Number(age),
    targetWeight: Number(targetWeight),
    bloodType: Number(bloodType),
  }
}

module.exports = {
  isUserExistService,
  createdUserToReturnService,
  loginUserToReturnService,
  getTokenPayloadService,
  checkDecodedUserOrThrowByTokenService,
  authorizeUserToReturnService,
  calcDailyCaloriesService,
  queryToNumbersService,
};