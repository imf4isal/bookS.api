const Book = require('./../models/bookModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.aliasTopBooks = (req, res, next) => {
  req.query.sort = '-rating';
  req.query.limit = '5';

  console.log('top books');
  console.log(req.query);

  next();
};

exports.getAllBooks = async (req, res) => {
  try {
    //execute query
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
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: 'invalid request.',
    });
  }
};

exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        book,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: 'invalid request. Book not found.',
    });
  }
};

exports.createSummary = async (req, res) => {
  try {
    const book = await Book.create(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        book,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      data: error,
    });
  }
};

exports.updateSummary = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      book: '<updated book>',
    },
  });
};

exports.deleteSummary = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
