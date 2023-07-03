import User from '../model/User.js';
import Contact from '../model/Contact.js';
import { queryUser } from '../utility/fn.js';

const getAllContacts = async (req, res) => {
  res.status(200).send('getAllContacts');
};

const addContact = async (req, res) => {
  const { userId } = req.params;
  const { contactInfo } = req.body;

  console.log('userId', userId);
  console.log('contactInfo', contactInfo);

  const user = await User.findOne({ _id: userId }).exec();
  const friend = await User.findOne({
    [queryUser(contactInfo)]: contactInfo,
  }).exec();

  const contact = new Contact({ name: de });
  console.log('user', user);
  console.log('friend', friend);

  res.status(200).send('addContact');
};

const deleteContact = async (req, res) => {
  res.status(200).send('deleteContact');
};

const shareContact = async (req, res) => {
  res.status(200).send('shareContact');
};

export { getAllContacts, addContact, deleteContact };
