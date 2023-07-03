import User from '../model/User.js';
import { queryUser } from '../utility/fn.js';

const findUserInDB = async (req, res) => {
  const { search } = req.query;

  let user;
  if (isNaN(search)) {
    user = await User.findOne(
      { email: { $eq: search } },
      { refreshToken: 0, contacts: 0 }
    ).exec();
  } else {
    const phoneNumber = `+${search}`.includes(' ')
      ? `+${search}`.replace(' ', '')
      : `+${search}`;
    user = await User.findOne(
      { phoneNumber: { $eq: phoneNumber } },
      { refreshToken: 0, contacts: 0 }
    ).exec();
  }

  if (user) return res.status(200).json({ user });
  res.sendStatus(404);
};

const findUserInContacts = async (req, res) => {
  const { search } = req.query;
  if (search) {
    const query = { [queryUser(search)]: { $regex: search, $options: 'i' } };
    const result = await User.find(query, {
      refreshToken: 0,
      contacts: 0,
    }).exec();
    if (result) return res.status(200).json({ users: result });
    else return res.sendStatus(404);
  } else res.sendStatus(204);
};

export { findUserInDB };
