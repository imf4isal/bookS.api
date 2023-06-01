const AppError = require('../utils/appError');
const Book = require('./../models/bookModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./factoryHandler');

exports.aliasTopBooks = (req, res, next) => {
  req.query.sort = '-rating';
  req.query.limit = '5';

  console.log('top books');
  console.log(req.query);

  next();
};

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

exports.createSummary = factory.createOne(Book);
exports.updateSummary = factory.updateOne(Book);
exports.deleteSummary = factory.deleteOne(Book);
