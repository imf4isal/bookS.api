const express = require('express');

const bookControllers = require('../controllers/bookControllers');
const reviewControllers = require('../controllers/reviewController');
const authControllers = require('./../controllers/authController');

const router = express.Router();

router
  .route('/top-5')
  .get(bookControllers.aliasTopBooks, bookControllers.getAllBooks);

router
  .route('/')
  .get(authControllers.protect, bookControllers.getAllBooks)
  .post(bookControllers.createSummary);
router
  .route('/:id')
  .get(bookControllers.getBook)
  .patch(bookControllers.updateSummary)
  .delete(
    authControllers.protect,
    authControllers.restrictTo('admin', 'moderator'),
    bookControllers.deleteSummary
  );

router
  .route('/:summaryId/reviews')
  .post(authControllers.protect, reviewControllers.createReview);

module.exports = router;
