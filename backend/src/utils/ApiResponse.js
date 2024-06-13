class ApiResponse {
  constructor(statusCode, payload, message = 'Success') {
    this.statusCode = statusCode;
    this.payload = payload;
    this.message = message;
    this.success = statusCode < 400;
  }
}

module.exports = ApiResponse;
