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

  // Only log non-404 unexpected errors in development to keep server console clean
  if (process.env.NODE_ENV === 'development' && error.statusCode !== 404) {
    console.error(error);
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    errors: error.errors || [],
  });
};

const notFound = (req, res, next) => {
  // Ignore chrome devtools and favicon noise
  if (req.originalUrl.includes('com.chrome.devtools') || req.originalUrl === '/favicon.ico') {
    return res.status(404).end();
  }
  next(new ApiError(404, `Route not found - ${req.originalUrl}`));
};

module.exports = { errorHandler, notFound };
