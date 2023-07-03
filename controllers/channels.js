import User from '../model/User.js';
import Channels from '../model/Channels.js';
import { queryUser } from '../utility/fn.js';

const getChannelList = async (req, res) => {
  const createdBy = req.params.id;
  const channelList = await Channels.findOne({ createdBy }).exec();
  res.status(200).json(channelList);
};

const createChannelList = async (req, res) => {
  const { msg, createdBy, createdAt, sentTo } = req.body.message;
  // accessedBy [set the users here]
  // message model
  // room modle

  await Channels.deleteMany({});
  const sentToUser = await User.findOne({ [queryUser(sentTo)]: sentTo }).exec();

  const newChattingRoom = {
    sentTo: sentToUser._id,
    messages: [{ msg, createdBy, createdAt }],
  };

  const chattingRooms = newChattingRoom;

  const newChannelList = await Channels.create({ createdBy, chattingRooms });

  res.status(201).json(newChannelList);
};

const updateChannel = async (req, res) => {
  const channelListId = req.params.id;
  const { msg, createdBy, createdAt, sentTo } = req.body.message;
  const newMessage = { msg, createdBy, createdAt };

  const foundChannelList = await Channels.findOne({
    _id: channelListId,
  }).exec();

  const sentToUser = await User.findOne({ [queryUser(sentTo)]: sentTo }).exec();

  const { chatRoom, roomIndex } = foundChannelList.isRoomExist(sentToUser._id);

  if (chatRoom) {
    const updateMessages = foundChannelList.addNewMessage({
      roomIndex,
      newMessage,
    });
    foundChannelList.chattingRooms[roomIndex].messages = updateMessages;
  } else {
    const newRoom = foundChannelList.createNewRoom({
      sentTo: sentToUser._id,
      message: newMessage,
    });
    const updateChattingRooms = foundChannelList.updateChattingRooms(newRoom);
    foundChannelList.chattingRooms = updateChattingRooms;
  }

  const updateChannelList = await Channels.findOneAndUpdate(
    { _id: channelListId },
    { chattingRooms: foundChannelList.chattingRooms },
    { new: true }
  );

  res.status(200).json(updateChannelList);
};

const deleteChannel = async (req, res) => {
  const channelListId = req.params.id;
  const { sentTo } = req.body;

  const foundChannelList = await Channels.findOne({
    _id: channelListId,
  }).exec();

  const sentToUser = await User.findOne({ [queryUser(sentTo)]: sentTo }).exec();

  const updatedChattingRooms = foundChannelList.deleteRoom(sentToUser._id);

  if (updatedChattingRooms.length > 0) {
    await Channels.findOneAndUpdate(
      { _id: channelListId },
      { chattingRooms: updatedChattingRooms },
      { new: true }
    );
  } else {
    await Channels.findOneAndDelete({ _id: channelListId });
  }

  res.sendStatus(200);
};

export { getChannelList, createChannelList, updateChannel, deleteChannel };
