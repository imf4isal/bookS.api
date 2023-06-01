const Book = require('./../models/bookModel');
const factory = require('./factoryHandler');

exports.aliasTopBooks = (req, res, next) => {
  req.query.sort = '-rating';
  req.query.limit = '5';

  console.log('top books');
  console.log(req.query);

  next();
};

const populateOpt = [
  {
    path: 'summaryWriter',
    select: '-__v -passwordChangedAt',
  },
  'reviews',
];

exports.getAllBooks = factory.getAll(Book);
exports.getBook = factory.getOne(Book, populateOpt);
exports.createSummary = factory.createOne(Book);
exports.updateSummary = factory.updateOne(Book);
exports.deleteSummary = factory.deleteOne(Book);
