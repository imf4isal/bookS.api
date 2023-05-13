exports.getAllBooks = (req, res) => {
  res.status(200).json({
    status: 'success',
    // data: {
    //   books,
    // },
  });
};

exports.checkBookData = (req, res, next) => {
  if (!req.body.name || !req.body.author) {
    return res.status(400).json({
      status: 'error',
      message: 'invalid data. check again',
    });
  }
  next();
};

exports.getBook = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      // book,
    },
  });
};

exports.createSummary = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      // book,
    },
  });
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
