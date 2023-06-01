const AppError = require('../utils/appError');
const Review = require('./../models/reviewModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');

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

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.book) req.body.book = req.params.summaryId;
  if (!req.body.reviewAuthor) req.body.reviewAuthor = req.user.id;

  const review = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      review,
    },
  });
});
