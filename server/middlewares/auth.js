const customError = require("../errors/customError");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    throw new customError(401, "Not Authorized. Please Login");
  }

  const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decodedToken.userID).select("-password");
  if (!user) {
    throw new customError(401, "Not Authorized. Please Login");
  }
  req.user = user;
  next();
};

module.exports = authMiddleware;
