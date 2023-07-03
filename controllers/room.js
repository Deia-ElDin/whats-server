import Room from '../model/Room.js';
import User from '../model/User.js';
import Message from '../model/Message.js';

const getAllRooms = async (req, res) => {
  const { userId } = req.params;

  const rooms = await Room.find({ accessedBy: userId })
    .populate('accessedBy', '-contacts -refreshToken')
    .populate({
      path: 'messages',
      options: { limit: 5, sort: { createdAt: -1 } },
    })
    .sort('-updatedAt');

  res.status(200).json({ rooms });
};

const getRoom = async (req, res) => {
  const { roomId } = req.params;

  const room = await Room.findOne({ _id: roomId })
    .populate('accessedBy', '-contacts -refreshToken')
    .populate('messages');

  res.status(200).json({ room });
};

const createRoom = async (req, res) => {
  // console.log('createRoom');
  // console.log('req.body', req.body);
  let newRoom = await Room.create(req.body);
  newRoom = await newRoom.populate('accessedBy', '-contacts -refreshToken');
  // console.log('newRoom', newRoom);
  res.status(201).json({ newRoom });
};

const updateRoom = async (req, res) => {
  const { roomId } = req.params;
  const messages = await Message.find({ roomId });
  res.status(200).json({ messages });
};

const deleteRoom = async (req, res) => {
  const { userId, roomId } = req.query;

  const deletedRoom = await Room.findOneAndUpdate(
    { _id: roomId },
    { $pull: { accessdBy: userId } },
    { new: true }
  );

  await Message.updateMany(
    { roomId },
    { $pull: { accessdBy: userId } },
    { new: true }
  );

  if (deletedRoom.accessdBy.length === 0) {
    await Room.deleteOne({ _id: roomId });
    await Message.deleteMany({ roomId });
  }

  res.sendStatus(200);
};

const deleteChat = async (req, res) => {
  const { roomId } = req.params;
  await Room.deleteOne({ _id: roomId });
  res.sendStatus(204);
};

export { getAllRooms, getRoom, createRoom, updateRoom, deleteRoom, deleteChat };

// const updateRoom = async (req, res) => {
//   const { roomId } = req.body;

//   // we send the user to this route only if the user created this room
//   // 1- we find the room
//   const foundRoom = await Room.findOne({ _id: roomId }).exec();

//   // 2- we create the message and pass the message id to the room
//   const newMessage = await Message.create(req.body);

//   // 3- update the cuurent room with the new messages Id's (so we avoid dublicating data)
//   const query = { _id: roomId };
//   const updates = { messagesIds: [...foundRoom.messagesIds, newMessage._id] };
//   const options = { new: true };
//   await Room.findOneAndUpdate(query, updates, options);

//   // 4- find the messages
//   const currentMessages = await Message.find({ roomId }).exec();

//   // 6- send them to the user
//   res.status(200).json(currentMessages);
// };

// const updateRoom = async (req, res) => {
//   const { roomId } = req.params;
//   const { accessdBy } = req.body;
//   const newRoom = await Room.findOneAndUpdate(
//     { _id: roomId },
//     { accessdBy },
//     { new: true }
//   );
//   res.status(200).json(newRoom);
// };

// City.find({}).populate({
//   path:'Articles',
//   options: {
//       limit: 2,
//       sort: { created: -1},
//       skip: req.params.pageIndex*2

//   }
