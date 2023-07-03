import CustomApiError from './cutomApiError.js';

class UnauthorizedError extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

export default UnauthorizedError;
