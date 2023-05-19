const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');

exports.createUser = catchAsync(async (req, res, next) => {
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
