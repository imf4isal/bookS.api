const express = require('express');

const bookControllers = require('../controllers/bookControllers');

const bookRouter = express.Router();

bookRouter
  .route('/')
  .get(bookControllers.getAllBooks)
  .post(bookControllers.createSummary);
bookRouter
  .route('/:id')
  .get(bookControllers.getBook)
  .patch(bookControllers.updateSummary)
  .delete(bookControllers.deleteSummary);

module.exports = bookRouter;
