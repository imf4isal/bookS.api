const express = require('express');
const morgan = require('morgan');

const app = express();

const bookRouter = require('./routes/bookRouter');
const userRouter = require('./routes/userRouter');
const AppError = require('./utils/appError');
const errorHandler = require('./controllers/errorController');

//middleware

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('hello.');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Router Mounting
app.use('/api/v1/books', bookRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Couldn't find ${req.originalUrl} on server.`,
  // });

  next(new AppError(`Couldn't find ${req.originalUrl} on server.`, 404));
});

app.use(errorHandler);

module.exports = app;
