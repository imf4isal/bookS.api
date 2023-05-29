const express = require('express');
const reviewControllers = require('../controllers/reviewController');

const router = express.Router();

router
  .route('/')
  .get(reviewControllers.getReviews)
  .post(reviewControllers.createReview);

module.exports = router;
