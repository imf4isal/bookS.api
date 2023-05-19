const AppError = require('../utils/appError');

const handleInvalidIdError = (err) => {
  const message = `Invalid Id: ${err.value}`;

  return new AppError(message, 400);
};

const handleDuplicationError = () => {
  const message = 'Duplicate Field Name.';

  return new AppError(message, 500);
};

const developmentError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const productionError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    developmentError(err, res);
  }

  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (error.kind === 'ObjectId') error = handleInvalidIdError(error);
    if (error.code === 11000) error = handleDuplicationError();

    console.log(error);
    productionError(error, res);
  }
};
