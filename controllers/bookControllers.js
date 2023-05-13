const Book = require('./../models/bookModel');

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json({
      status: 'success',
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
