import Message from '../model/Message.js';
import Room from '../model/Room.js';

// `const getPrevMessages = async (req, res) => {
//   const { userId } = req.params;

//   const roomsIds = await Room.find({ accessedBy: userId }, { _id: 1 });

//   const messages = [];
//   for (let i = 0; i < roomsIds.length; i++) {
//     // once we get more than 20 messages, we want to fetch only the last 20 message (.sort('-createdAt')) of each room, then reverse()
//     // this function will be called only once at the start up of the app, then we will be using getCurrentRoomMessages()
//     const currentRoomMessages = await Message.find({ roomId: roomsIds[i]._id })
//       .sort('-createdAt')
//       .limit(20);
//     messages.push(currentRoomMessages.reverse());
//   }

//   res.status(200).json({ messages });
// };`

// const getCurrentRoomMessages = async (req, res) => {
//   const { roomId } = req.params;
//   const messages = await Message.find({ roomId });
//   res.status(200).json({ messages });
// };

const getPrevMessages = async (req, res) => {
  const { roomId, page } = req.query;
  // console.log('page', page);

  const firstMessage = await Message.find({ roomId: roomId }).limit(1);

  let result = Message.find({ roomId: roomId }).sort('-createdAt');
  result = result.skip((page - 1) * 3).limit(3);

  let prevMessages = await result;
  prevMessages = prevMessages.reverse();

  const gotAllData =
    `${prevMessages[0]._id}` === `${firstMessage[0]._id}` ? true : false;
  // console.log('prevMessages[0]._id', prevMessages[0]._id);
  // console.log('firstMessage[0]._id', firstMessage[0]._id);
  // console.log('gotAllData', gotAllData);
  // console.log('prevMessages', prevMessages);
  res.status(200).json({ prevMessages, gotAllData });
};

const getLastMessages = async (req, res) => {
  const { roomId } = req.params;
  const messages = await Message.find({ roomId }).sort('-createdAt').limit(1);
  res.status(200).json({ lastMessage: messages[0] });
};

const createMessage = async (req, res) => {
  // console.log('req.body', req.body);
  const isArr = Array.isArray(req.body);
  if (isArr) {
    const newMessages = await Message.insertMany(req.body);
    console.log('newMessages', newMessages);
    const ids = newMessages.map((msg) => msg.id);
    console.log('ids', ids);
    await Room.findOneAndUpdate(
      { _id: newMessages[0].roomId },
      { $push: { messages: [...ids] } }
    );
    res.status(201).json({ newMessages });
  } else {
    const newMessage = await Message.create(req.body);
    await Room.findOneAndUpdate(
      { _id: newMessage.roomId },
      { $push: { messages: newMessage._id } }
    );
    res.status(201).json({ newMessage });
  }
};

const createMultipleMessages = async (req, res) => {
  // console.log('req.body', req.body);
};

const deleteMessage = async (req, res) => {
  const { userId, messageId } = req.query;

  const deletedMessage = await Message.findOneAndUpdate(
    { _id: messageId },
    { $pull: { accessedBy: userId } },
    { new: true }
  );

  if (deletedMessage.accessedBy.length === 0) {
    await deletedMessage.deleteOne({ _id: messageId });
  }

  await res.sendStatus(200);
};

const deleteManyMessages = async (req, res) => {
  const { messagesIds } = req.body;
  await Message.deleteMany({ _id: { $in: messagesIds } });
  res.sendStatus(200);
};

export {
  // getCurrentRoomMessages,
  getPrevMessages,
  getLastMessages,
  createMessage,
  deleteMessage,
  deleteManyMessages,
};

// await Room.findOneAndUpdate(
//   { _id: deletedMessage.roomId },
//   { $pull: { messagesIds: deletedMessage._id } },
//   { new: true }
// );

// await Room.findOneAndUpdate(
//   { _id: roomId },
//   { $push: { messagesIds: newMessage._id } },
//   { new: true }
// );

//  db.orders.deleteOne( { "_id" : ObjectId("563237a41a4d68582c2509da") } )
