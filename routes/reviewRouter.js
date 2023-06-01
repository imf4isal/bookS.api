const express = require('express');
const reviewControllers = require('../controllers/reviewController');
const authControllers = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewControllers.getReviews)
  .post(
    authControllers.protect,
    reviewControllers.setBookUserIds,
    reviewControllers.createReview
  );

router
  .route('/:id')
  .patch(authControllers.protect, reviewControllers.updateReview)
  .delete(reviewControllers.deleteReview);

module.exports = router;
