const bcryptjs = require("bcryptjs");

const isPasswordValid = async (inputPass, userPass) => {
  return await bcryptjs.compare(inputPass, userPass);
}

module.exports = {
  isPasswordValid,
};