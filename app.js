const express = require('express');
const fs = require('fs');

const app = express();

//middleware
app.use(express.json());

// reading the dummy json data from files
const books = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/summaries-simple.json`)
);

// get all the books
app.get('/api/v1/books', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: books.length,
    data: {
      books,
    },
  });
});

// get only one book data
app.get('/api/v1/books/:id', (req, res) => {
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
});

// add books data
app.post('/api/v1/books', (req, res) => {
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
});

app.patch('/api/v1/books/:id', (req, res) => {
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
});

app.delete('/api/v1/books/:id', (req, res) => {
  if (req.params.id * 1 > books.length - 1) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid id',
    });
  }

  res.status(204).json({
    status: 'success',
  });
});

// running application at particular port
const port = 3000;
app.listen(port, () => {
  console.log('app is running....');
});
