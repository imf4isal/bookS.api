const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Book = require('./../../models/bookModel');

dotenv.config({ path: './config.env' });

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection for importing data successfull.'));

const books = JSON.parse(
  fs.readFileSync(`${__dirname}/summaries.json`, 'utf-8')
);

const importData = async () => {
  try {
    await Book.create(books);
    console.log('summaries successfully loaded into database.');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Book.deleteMany();
    console.log('all summaries successfully deleted.');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') importData();
if (process.argv[2] === '--delete') deleteData();
