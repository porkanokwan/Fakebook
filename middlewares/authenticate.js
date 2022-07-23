const jwt = require("jsonwebtoken");
const createError = require("../utils/createError");
const { User } = require("../models");

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    // console.log(authorization);
    if (!authorization || !authorization.startsWith("Bearer ")) {
      createError("Unauthenticate", 401);
    }
    const token = authorization.split(" ")[1];
    // console.log(token);
    if (!token) {
      createError("Unauthenticate", 401);
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // console.log(payload);

    const user = await User.findOne({
      where: { id: payload.id },
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      createError("Unauthenticate", 401);
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
