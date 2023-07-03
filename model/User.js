import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const UserSchema = mongoose.Schema({
  username: { type: String, trim: true, default: '' },
  photoURL: String,
  email: {
    type: String,
    trim: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    ],
    lowercase: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
    match: [/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/],
  },
  contacts: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  refreshToken: { type: String, default: '' },
});

UserSchema.method({
  createAccessToken: function () {
    const payload = {
      userId: this._id,
      userName: this.userName ?? '',
      userEmail: this.email ?? '',
      userPhoneNumber: this.phoneNumber ?? '',
    };
    const jwtPw = process.env.ACCESS_TOKEN_SECRET;
    const jswExpiresIn = { expiresIn: process.env.ACCESS_TOKEN_EXPIRE };

    return jwt.sign(payload, jwtPw, jswExpiresIn);
  },
  createRefreshToken: function () {
    const payload = {
      userId: this._id,
      userName: this.userName ?? '',
      userEmail: this.email ?? '',
      userPhoneNumber: this.phoneNumber ?? '',
    };
    const jwtPw = process.env.REFRESH_TOKEN_SECRET;
    const jwtExpiresIn = { expiresIn: process.env.REFRESH_TOKEN_EXPIRE };

    return jwt.sign(payload, jwtPw, jwtExpiresIn);
  },
});

const User = mongoose.model('User', UserSchema);

export default User;
