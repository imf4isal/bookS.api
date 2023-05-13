const Book = require('./../models/bookModel');

exports.getAllBooks = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludeQ = ['sort', 'page', 'limit', 'fields'];
    excludeQ.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|in)\b/g,
      (match) => `$${match}`
    );

    let query = Book.find(JSON.parse(queryStr));

    //sorting
    if (req.query.sort) {
      const sortEl = req.query.sort.split(',').join(' ');
      query.sort(sortEl);
    }

    //particular fields // projecting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    const books = await query;

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
