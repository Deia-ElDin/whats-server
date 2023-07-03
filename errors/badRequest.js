import CustomApiError from './cutomApiError.js';

class BadRequestError extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

export default BadRequestError;
