import { cap } from '../utility/fn.js';

const errorHanlder = (err, req, res, next) => {
  console.log(err);
  const customError = {
    statusCode: err.statusCode || 500,
    msg: err.message || 'Something went wrong, please try again later',
  };

  if (err.code === 11000) {
    customError.statusCode = 409;
    customError.msg = Object.entries(err.keyValue).map(
      ([key, value]) => `${cap(key)}: ${value} already exist`
    )[0];
  }

  res.status(customError.statusCode).json(customError.msg);
};

export default errorHanlder;
