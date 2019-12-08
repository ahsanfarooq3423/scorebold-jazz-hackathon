const jwt = require("jsonwebtoken");
const config = require("../config/keys");

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");

  // Check for token
  if (!token)
    res
      .status(401)
      .send({ message: "Unauthorized error. Please login to continue" });

  try {
    // Verify token
    req.user = jwt.verify(token, config.jwtSecret);
    next();
  } catch (e) {
    res.status(400).json({ message: "Token is not valid" });
  }
};
