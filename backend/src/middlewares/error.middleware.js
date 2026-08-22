const ApiError = require('../utils/ApiError');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let error = err;

  // Postgres unique_violation (e.g. duplicate email)
  if (error.code === '23505') {
    error = new ApiError(409, 'A record with this value already exists.');
  }

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    error = new ApiError(statusCode, error.message || 'Internal Server Error');
  }

  if (process.env.NODE_ENV === 'development') {
    console.error(error);
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    errors: error.errors || [],
  });
};

const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found - ${req.originalUrl}`));
};

module.exports = { errorHandler, notFound };
