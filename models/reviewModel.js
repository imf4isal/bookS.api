const mongoose = require('mongoose');

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

reviewSchema.pre(/^find/, function (next) {
  //   this.populate({
  //     path: 'book',
  //     select: 'title',
  //   }).populate({
  //     path: 'reviewAuthor',
  //     select: 'name',
  //   });

  this.select('-__v -createdAt');

  this.populate({
    path: 'reviewAuthor',
    select: 'name',
  });

  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
