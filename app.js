const express = require('express');
const fs = require('fs');

const app = express();

// reading the dummy json data from files
const books = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/summaries.json`)
);

app.get('/api/v1/books', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: books.length,
    data: {
      books,
    },
  });
});

// running application at particular port
const port = 3000;
app.listen(port, () => {
  console.log('app is running....');
});
