const User = require("./user.model");

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
}

module.exports = {
  isUserExistService,
  createdUserToReturnService,
};