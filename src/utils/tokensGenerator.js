const jwt = require("jsonwebtoken");

const expiresInAccess = 60 * 60 * 24;
const expiresInRefresh = 60 * 60 * 24 * 7;

const generateAccessToken = async (payload) => {
  try {
    return await jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET,
      {expiresIn: expiresInAccess}
    );
  }
  catch (error) {
    console.log(error.message);
  }
}

const generateRefreshToken = async (payload) => {
  try {
    return await jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET,
      {expiresIn: expiresInRefresh}
    );
  }
  catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};