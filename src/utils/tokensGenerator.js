const jwt = require("jsonwebtoken");

const expiresInAccess = 60 * 60 * 24;

const generateAccessToken = async (payload) => {
  try {
    return await jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {expiresIn: expiresInAccess}
    );
  }
  catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  generateAccessToken,
};