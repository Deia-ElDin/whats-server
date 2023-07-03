import jwt from 'jsonwebtoken';
import User from '../model/User.js';
import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
} from '../errors/index.js';
import getErrMsg from '../utility/errMsgs.js';

const signIn = async (req, res) => {
  // res.status(201).json({ msg: 'signin' });
  console.log('here');
  res.status(201).send('signin');
};

// const signIn = async (req, res) => {
//   const { email, phoneNumber } = req.body;

//   let user;
//   if (email) user = await User.findOne({ email }).exec();
//   else if (phoneNumber) user = await User.findOne({ phoneNumber }).exec();
//   if (!user) user = await User.create(req.body);

//   const accessToken = user.createAccessToken();
//   const refreshToken = user.createRefreshToken();

//   user.refreshToken = refreshToken;
//   await user.save();

//   const cookieOptions = {
//     httpOnly: true,
//     sameSite: 'None',
//     maxAge: 24 * 60 * 60 * 1000,
//     secure: true,
//   };

//   res.cookie('jwt', refreshToken, cookieOptions);
//   res.status(201).json({ user, accessToken });
// };

const refresh = async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.jwt) throw new UnauthorizedError(getErrMsg('unauthorized'));

  const refreshToken = cookie.jwt;
  const foundUser = await User.findOne({ refreshToken }).exec();

  if (!foundUser) throw new ForbiddenError(getErrMsg('forbidden'));

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  const accessToken = foundUser.createAccessToken();

  res.status(200).json({ accessToken });
};

const signOut = async (req, res) => {
  if (!req?.cookies?.jwt) return res.sendStatus(204);

  const cookie = req.cookies;
  const refreshToken = cookie.jwt;

  const loggedOutUser = await User.findOne({ refreshToken }).exec();
  if (!loggedOutUser) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    return res.sendStatus(403);
  }

  loggedOutUser.refreshToken = '';
  // loggedOutUser.socketId = '';
  loggedOutUser.save();

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  res.sendStatus(204);
};

export { signIn, refresh, signOut };
