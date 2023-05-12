const express = require('express');
const fs = require('fs');

const morgan = require('morgan');

const app = express();

//middleware
app.use(morgan('dev'));

app.use(express.json());

app.use((req, res, next) => {
  console.log('hello.');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// reading the dummy json data from files
const books = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/summaries-simple.json`)
);

const getAllBooks = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedTime: req.requestTime,
    results: books.length,
    data: {
      books,
    },
  });
};

const getBook = (req, res) => {
  const id = req.params.id * 1;

  const book = books.find((b) => b.id === id);

  if (!book) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      book,
    },
  });
};

const createSummary = (req, res) => {
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

const updateSummary = (req, res) => {
  const id = req.params.id * 1;
  const book = books.find((b) => b.id === id);

  if (!book) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      book: '<updated book>',
    },
  });
};

const deleteSummary = (req, res) => {
  if (req.params.id * 1 > books.length - 1) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid id',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

app.route('/api/v1/books').get(getAllBooks).post(createSummary);

app
  .route('/api/v1/books/:id')
  .get(getBook)
  .patch(updateSummary)
  .delete(deleteSummary);

// running application at particular port
const port = 3000;
app.listen(port, () => {
  console.log('app is running....');
});
