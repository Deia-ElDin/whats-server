import whiteList from './whiteList.js';
import { UnauthorizedError } from '../errors/index.js';

const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.includes(origin) || !origin) callback(null, true);
    else callback(new UnauthorizedError('Not Allowed By Cors'));
  },
};

export default corsOptions;
