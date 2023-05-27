const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('../utils/appError');
const sendEmail = require('./../utils/sendEmail');
const crypto = require('crypto');

const generateJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: '1d',
  });
};

const createAndSendToken = (user, statusCode, res) => {
  const token = generateJWT(user._id);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
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

  createAndSendToken(newUser, 200, res);
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
  createAndSendToken(user, 200, res);
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

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // check if user exists
  if (!req.body.email) {
    res.status(400).json({
      message: 'Invalid Email.',
    });
  }
  const user = await User.findOne({ email: req.body.email });

  console.log(user);

  if (!user) {
    return next(new AppError('User with this email does not exist.', 404));
  }

  // generate random password reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // send reset token to the user email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Reset your BookSynop Password(valid for 10min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedResetToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedResetToken,
    passwordResetExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new AppError(
        'Invalid Reset Token or Token has been expired. Try Again',
        404
      )
    );
  }

  user.password = req.body.password;
  user.confirmedPass = req.body.confirmedPass;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;

  await user.save();

  createAndSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // check if fields are valid
  if (
    !req.body.passwordCurrent ||
    !req.body.password ||
    !req.body.confirmedPass
  ) {
    return next(
      new AppError(
        'Invalid Field for changing password, Recheck and Try again.',
        401
      )
    );
  }

  // check if current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Current Password is not correct', 404));
  }

  // change the password
  user.password = req.body.password;
  user.confirmedPass = req.body.confirmedPass;

  await user.save();

  createAndSendToken(user, 200, res);
});
