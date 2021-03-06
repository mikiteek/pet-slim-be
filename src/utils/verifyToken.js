const jwt = require("jsonwebtoken");

const verifyAccessToken = async (token) => {
  try {
    return await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  }
  catch (error) {
    return false;
  }
};

const verifyRefreshToken = async (token) => {
  try {
    return await jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  }
  catch (error) {
    return false;
  }
};

module.exports = {
  verifyAccessToken,
  verifyRefreshToken,
}