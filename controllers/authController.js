const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const bcrypt = require("bcryptjs");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    });
    const token = generateToken(newUser._id);
    res.status(201).send({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    next(new AppError(`${err.message}`, 400, err).getErrorObj());
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    let checkPassword;
    if (user) {
      checkPassword = await bcrypt.compare(password, user.password);
    } else {
      return next(
        new AppError(`Incorrect Email or Password`, 400, {}).getErrorObj()
      );
    }

    if (!user || !checkPassword)
      return next(
        new AppError(`Incorrect Email or Password`, 400, {}).getErrorObj()
      );

    const token = generateToken(user._id);
    res.status(200).send({
      status: "success",
      token,
    });
  } catch (err) {
    next(new AppError(`${err.message}`, 400, err).getErrorObj());
  }
};
