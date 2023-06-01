const mongoose = require('mongoose');
const slugify = require('slugify');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, `Book's Title is missing.`],
      unique: true,
      trim: true,
    },
    slug: String,
    author: {
      type: String,
      required: [true, `Book's author name is missing. `],
    },
    coverImage: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: [true, `Book's brief description is missing. `],
    },
    categories: {
      type: [String],
      required: [true, `Select the category where the book belongs. `],
    },
    summary: {
      type: String,
      required: [true, `Write a valid summary.`],
      validate: {
        validator: function (summaryText) {
          const wordCount = summaryText.trim().split(/\s+/).length;
          return wordCount >= 20;
        },
        message: 'Summary should be at least of 500 words.',
      },
    },
    summaryWriter: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
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
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: Number,
    topQuotes: {
      type: [String],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

bookSchema.index({ slug: 1 });
bookSchema.index({ rating: 1 });

// Virtual Populate
bookSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'book',
  localField: '_id',
});

bookSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
