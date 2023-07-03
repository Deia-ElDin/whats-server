import CustomApiError from './cutomApiError.js';

class ForbiddenError extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

export default ForbiddenError;
