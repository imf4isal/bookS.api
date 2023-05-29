const AppError = require('../utils/appError');
const Book = require('./../models/bookModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');

exports.aliasTopBooks = (req, res, next) => {
  req.query.sort = '-rating';
  req.query.limit = '5';

  console.log('top books');
  console.log(req.query);

  next();
};

exports.createSummary = catchAsync(async (req, res, next) => {
  const book = await Book.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      book,
    },
  });
});

exports.getAllBooks = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Book.find(), req.query)
    .filter()
    .sort()
    .project()
    .pagination();

  const books = await features.query;

  res.status(200).json({
    status: 'success',
    results: books.length,
    data: {
      books,
    },
  });
});

exports.getBook = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.id)
    .populate({
      path: 'summaryWriter',
      select: '-__v -passwordChangedAt',
    })
    .populate('reviews');

  res.status(200).json({
    status: 'success',
    data: {
      book,
    },
  });
});

exports.updateSummary = catchAsync(async (req, res, next) => {
  const summary = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!summary) {
    return next(new AppError(`couldn't find the data for this id.`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      summary,
    },
  });
});

exports.deleteSummary = catchAsync(async (req, res, next) => {
  const summary = await Book.findByIdAndDelete(req.params.id);

  if (!summary) {
    return next(
      new AppError(`couldn't find the summary for this id to delete.`, 404)
    );
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
