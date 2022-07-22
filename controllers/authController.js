const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const createError = require("../utils/createError");
const { User } = require("../models");
const { Op } = require("sequelize");

const genToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIREIN,
  });
  return token;
};

exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, emailOrphone, password, confirmPassword } =
      req.body;

    if (!emailOrphone) {
      createError("email or phoneNumber is required", 400);
    }
    if (!password) {
      createError("password is required", 400);
    }
    if (password !== confirmPassword) {
      createError("Password is not match", 400);
    }

    // method ใน validator ใช้ได้กับ String เท่าน้น
    const isMobilePhone = validator.isMobilePhone(String(emailOrphone));
    const isEmail = validator.isEmail(String(emailOrphone));
    if (!isEmail && !isMobilePhone) {
      createError("email or phoneNumber is invalid format", 400);
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email: isEmail ? emailOrphone : null,
      phoneNumber: isMobilePhone ? emailOrphone : null,
      password: hashPassword,
    });

    const token = genToken({ id: user.id });

    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { emailOrphone, password } = req.body;
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: emailOrphone }, { phoneNumber: emailOrphone }],
      },
    });

    console.log(user);
    if (!user) {
      createError("invalid credential", 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      createError("password incorrect", 400);
    }

    const token = genToken({ id: user.id });
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};
