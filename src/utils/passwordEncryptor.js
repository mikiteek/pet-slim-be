const bcryptjs = require("bcryptjs");

const encryptPassword = async (password) => {
  return await bcryptjs.hash(password, 12);
}

module.exports = {
  encryptPassword,
}