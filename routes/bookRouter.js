const express = require('express');

const bookControllers = require('../controllers/bookControllers');
const reviewRouter = require('../routes/reviewRouter');
const authControllers = require('./../controllers/authController');

const router = express.Router();

router.use('/:summaryId/reviews', reviewRouter);

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

module.exports = router;
