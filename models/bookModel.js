const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A book must have name.'],
    unique: true,
  },
  author: {
    type: String,
    required: [true, 'Book must have author.'],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
