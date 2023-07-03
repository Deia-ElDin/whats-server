import CustomApiError from './cutomApiError.js';

class ConflictError extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

export default ConflictError;
