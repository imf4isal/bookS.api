const fs = require('fs');

// reading the dummy json data from files
const books = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/summaries-simple.json`)
);

exports.checkIdValidation = (req, res, next, val) => {
  if (val > books.length - 1) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid id',
    });
  }

  next();
};

exports.getAllBooks = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedTime: req.requestTime,
    results: books.length,
    data: {
      books,
    },
  });
};

exports.getBook = (req, res) => {
  const id = req.params.id * 1;
  const book = books.find((b) => b.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      book,
    },
  });
};

exports.createSummary = (req, res) => {
  const newId = books[books.length - 1].id + 1;
  const newBook = Object.assign({ id: newId }, req.body); // merging object

  books.push(newBook);

  fs.writeFile(
    `${__dirname}/dev-data/data/summaries-simple.json`,
    JSON.stringify(books),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          book: newBook,
        },
      });
    }
  );
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
