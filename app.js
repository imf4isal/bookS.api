const express = require('express');
const morgan = require('morgan');

const app = express();

const bookRouter = require('./routes/bookRouter');
const userRouter = require('./routes/userRouter');

//middleware

if (process.env.NODE_ENV === 'production') {
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

// running application at particular port

module.exports = app;
