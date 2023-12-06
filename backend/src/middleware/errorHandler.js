require('dotenv').config({ path: './src/config/.env' });
const ApiError = require('../utils/ApiError');

/**
 * @param {Error | ApiError} err
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * */

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error?.statusCode || 500;
    const message = error?.message || 'Something went wrong';

    error = new ApiError(
      statusCode,
      message,
      error?.errors || [],
      error?.stack
    );
  }

  const response = {
    ...error,
    message: error.message,
    ...(process.env.NODE_ENV !== 'production' ? { stack: error.stack } : {}),
  };

  res.status(error.statusCode).json(response);
};
module.exports = errorHandler;
