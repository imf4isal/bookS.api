const express = require('express');

const bookControllers = require('../controllers/bookControllers');

const router = express.Router();

router
  .route('/')
  .get(bookControllers.getAllBooks)
  .post(bookControllers.createSummary);
router
  .route('/:id')
  .get(bookControllers.getBook)
  .patch(bookControllers.updateSummary)
  .delete(bookControllers.deleteSummary);

module.exports = router;
