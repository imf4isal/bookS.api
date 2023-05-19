const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('../utils/appError');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    //only allow selected field
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmedPass: req.body.confirmedPass,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(200).json({
    status: 'success',
    token,
    data: {
      newUser,
    },
  });
});

exports.login = catchAsync((req, res, next) => {
  // TODO: check if there are email and password field
  if (!req.body.email || !req.body.password)
    return next(new AppError('Provide email and password', 400));

  // TODO: check if user exists and password is correct
  // TODO: create and provide token to the client

  const token = '';

  res.status(200).json({
    status: 'success',
    token,
  });
});
