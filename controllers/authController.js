const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const createError = require("../utils/createError");
const { User } = require("../models");

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

    const payload = {
      id: user.id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    return res.send("Login");
  } catch (error) {
    next(error);
  }
};
