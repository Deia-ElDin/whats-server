import jwt from 'jsonwebtoken';
import { UnauthorizedError, ForbiddenError } from '../errors/index.js';
import getErrMsg from '../utility/errMsgs.js';

const verifyJwt = (req, res, next) => {
  const authHeader = req.headers.Authorization || req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedError(getErrMsg('unauthorized'));
  }

  const accessToken = authHeader.split(' ')[1];

  try {
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    next();
  } catch (err) {
    throw new ForbiddenError(getErrMsg('forbidden'));
  }
};

export default verifyJwt;
