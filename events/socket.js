import User from '../model/User.js';
import Room from '../model/Room.js';
import Message from '../model/Message.js';

const createRoom = async ({ senderId, receiverId }) => {
  const query = { _id: { $in: [senderId, receiverId] } };
  const users = await User.find(query);
  const sender = users.find((user) => `${user._id}` === senderId);
  const receiver = users.find((user) => `${user._id}` === receiverId);

  const accessedBy = [senderId];
  const details = [
    { name: sender.email, photoURL: sender.photoURL },
    { name: receiver.email, photoURL: receiver.photoURL },
  ];

  const newRoom = await Room.create({ accessedBy, details });
  return newRoom;
};

const findUserByEmail = async (receiverName) => {
  const user = await User.findOne({ email: receiverName }).exec();
  return user;
};

const getRoom = async ({ roomId, receiverId }) => {
  const room = await Room.findOne({ _id: roomId }).exec();
  // console.log('get room');
  // console.log('room', room);

  return room;
};

const updateRoom = async ({ roomId, userId }) => {
  // console.log('updateRoom');
  // console.log('roomId', roomId);
  // console.log('userId', userId);
  const messages = await Message.find({ roomId });
  const accessedBy = messages[0].accessedBy;
  const room = await Room.findOneAndUpdate(
    { roomId },
    { accessedBy },
    { new: true }
  );
  return room;
};

const getSockets = async (accessedBy) => {
  const query = { _id: { $in: accessedBy } };
  const users = await User.find(query);
  // console.log('users', users);
  let socketsArray = [];
  for (let i = 0; i < users.length; i++) {
    socketsArray.push(users[i].socketId);
  }
  // console.log('socketsArray', socketsArray);
  return socketsArray;
};

// const createMessage = async (message) => {
//   const newMessage = await Message.create(message);
//   return newMessage;
// };

const getUsers = async ({ message, receiverName }) => {};

const sendOneToOneMessageWithUpdates = async ({ message, receiverName }) => {
  const receiver = await User.findOne({ email: receiverName }).exec();
  message.accessedBy.push(receiver._id.toString());
  // console.log('message', message);
  // const room = await Room.findOneAndUpdate(
  //   { _id: message.roomId },
  //   { $push: { accessedBy: receiver._id.toString() } },
  //   { new: true }
  // );
  // console.log('room', room);
  const newMessage = await Message.create(message);

  return { receiver, newMessage };
};

const receivePrivateMessage = async (message) => {};

const getPrevMessages = async ({ roomId, page, firstMessages }) => {
  const firstMessageInDB = await Message.find({ roomId }).limit(1);

  if (`${firstMessages?._id}` === `${firstMessageInDB[0]?._id}`) {
    return { prevMessages: [], gotAllData: true };
  }

  let result = Message.find({ roomId: roomId }).sort('-createdAt');
  result = result.skip((page - 1) * 5).limit(5);

  let prevMessages = await result;
  if (prevMessages.length === 0) return { prevMessages: [], gotAllData: true };
  prevMessages = prevMessages.reverse();

  const gotAllData =
    `${prevMessages[0]._id}` === `${firstMessageInDB[0]._id}` ? true : false;

  return { prevMessages, gotAllData };
};

const handleDisconnect = async (socketId) => {
  // console.log('socketId', socketId);
  const user = await User.findOne({ socketId }).exec();
  // console.log('user', user);
  if (user) {
    user.refreshToken = '';
    user.socketId = '';
    user.save();
  }
};

export {
  getUsers,
  createRoom,
  getRoom,
  findUserByEmail,
  // startNewChat,
  // createMessage,
  sendOneToOneMessageWithUpdates,
  receivePrivateMessage,
  getPrevMessages,
  handleDisconnect,
  getSockets,
  updateRoom,
};

// const users = await User.find({
//   _id: { $in: message.accessedBy },
// }).exec();

// sender = users.find((user) => `${user._id}` === createdBy);
// receiver = users.find((user) => `${user._id}` === receivedBy);
// console.log('sender 2', sender);
// console.log('receiver 2', receiver);

// console.log('message', message);
