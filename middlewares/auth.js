const jwt = require("jsonwebtoken");

const { DEFAULT } = require("../utils/errors");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(DEFAULT)
      .send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    // trying to verify the token
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(DEFAULT)
      .send({ message: "Authorization required" });
  }
  req.user = payload;
  return next();
};

module.exports = { auth };