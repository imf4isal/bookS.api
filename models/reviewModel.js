const mongoose = require('mongoose');
const Book = require('./bookModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'No review has been written to post.'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    reviewAuthor: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
    book: {
      type: mongoose.Schema.ObjectId,
      ref: 'Book',
      required: [
        true,
        'A review can not be exist without particular book summary. ',
      ],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// reviewSchema.index({ book: 1, reviewAuthor: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.select('-__v -createdAt');

  this.populate({
    path: 'reviewAuthor',
    select: 'name',
  });

  next();
});

reviewSchema.statics.calculateRatings = async function (bookId) {
  const stats = await this.aggregate([
    {
      $match: { book: bookId },
    },
    {
      $group: {
        _id: '$book',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  console.log(stats);
  if (stats.length > 0) {
    await Book.findByIdAndUpdate(bookId, {
      ratingsQuantity: stats[0].nRating,
      rating: stats[0].avgRating,
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calculateRatings(this.book);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
