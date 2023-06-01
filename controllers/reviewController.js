const AppError = require('../utils/appError');
const Review = require('./../models/reviewModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./factoryHandler');

exports.getReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.summaryId) filter = { book: req.params.summaryId };

  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    data: {
      results: reviews.length,
      reviews,
    },
  });
});

exports.setBookUserIds = (req, res, next) => {
  if (!req.body.book) req.body.book = req.params.summaryId;
  if (!req.body.reviewAuthor) req.body.reviewAuthor = req.user.id;

  next();
};

exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
