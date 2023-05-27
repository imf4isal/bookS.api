const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    data: {
      results: users.length,
      users,
    },
  });
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // restrict this route from updating password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // allow only specific field to update
  const filteredData = filterObj(req.body, 'name', 'email');

  // update user data
  const user = await User.findByIdAndUpdate(req.user.id, filteredData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'Success',
    data: {
      user,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(200).json({
    status: 'Success',
    message: 'Account has been scheduled to be deleted.',
    data: null,
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'functionality not defined.',
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'functionality not defined.',
  });
};

exports.updateUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!user) {
    return next(new AppError(`couldn't find the user for this id.`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'functionality not defined.',
  });
};
