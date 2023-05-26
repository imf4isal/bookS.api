const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'functionality not defined.',
  });
};

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
  const user = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
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
