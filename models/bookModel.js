const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A book must have name.'],
    unique: true,
  },
  author: {
    type: String,
    required: [true, 'Book must have author.'],
  },
  coverImage: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
  categories: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  summaryWriter: String,
  writingAt: Date,
  updatedAt: Date,
  readingTime: Number,
  rating: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: Number,
  topQuotes: {
    type: [String],
    default: [],
  },
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
