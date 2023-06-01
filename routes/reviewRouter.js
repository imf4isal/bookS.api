const express = require('express');
const reviewControllers = require('../controllers/reviewController');
const authControllers = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewControllers.getReviews)
  .post(authControllers.protect, reviewControllers.createReview);

module.exports = router;
