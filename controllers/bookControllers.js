const Book = require('./../models/bookModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.aliasTopBooks = (req, res, next) => {
  req.query.sort = '-rating';
  req.query.limit = '5';

  console.log('top books');
  console.log(req.query);

  next();
};

const catchAsync = (func) => {
  return (req, res, next) => func(req, res, next).catch(next);
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
  const book = await Book.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      book,
    },
  });
});

exports.updateSummary = catchAsync((req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      book: '<updated book>',
    },
  });
});

exports.deleteSummary = catchAsync((req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
