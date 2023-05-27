const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('../utils/appError');

const generateJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: '1d',
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    //only allow selected field
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
    confirmedPass: req.body.confirmedPass,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  const token = generateJWT(newUser._id);

  res.status(200).json({
    status: 'success',
    token,
    data: {
      newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check if there are email and password field
  if (!email || !password)
    return next(new AppError('Provide email and password', 400));

  // check if user exists and password is correct

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Invalid email or password.', 400));
  }

  // create and provide token to the client
  const token = generateJWT(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // get the token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return next(new AppError('You are not logged in.', 404));

  // verified the token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  if (currentUser.isPassChanged(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // carry user
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 404)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res) => {
  // check if user exists
  const user = User.findOne({ email: req.body.email });
  if (!user)
    return next(new AppError('User with this email does not exist.', 404));

  // generate random password reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
});

exports.resetPassword = catchAsync(async (req, res) => {});
