const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { NOT_AUTHORIZED_CODE } = require('../utils/errors/unauthorized-err');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new NOT_AUTHORIZED_CODE("Authorization required"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    // trying to verify the token
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new NOT_AUTHORIZED_CODE("Authorization required"));
  }
  req.user = payload;
  return next();
};

module.exports = { auth };