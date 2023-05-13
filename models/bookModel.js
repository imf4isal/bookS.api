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
    type: [String],
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  summaryWriter: String,
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false, // will not show this field at response
  },
  // updatedAt: Date,
  readingTime: Number,
  rating: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: Number,
  topQuotes: {
    type: [String],
  },
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
