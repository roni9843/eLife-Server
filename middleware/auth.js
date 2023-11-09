const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    console.log("this is token -> ", token);

    // ! if request does not carry any token then return Unauthorized
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // * unless continue

    token = token.split(" ")[1];

    const decoded = jwt.verify(token, "secret-key");

    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // req.user = user;

    next();
  } catch (e) {
    return res.status(400).json({
      message: "invalid token",
    });
  }
};

module.exports = auth;
