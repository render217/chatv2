const ApiError = require('../utils/ApiError');

const notFound = (req, res) => {
  throw new ApiError(404, 'Route not found');
};
module.exports = notFound;
