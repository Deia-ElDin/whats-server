import mongoose from 'mongoose';

const { Schema } = mongoose;

const channelsSchema = Schema({
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  chattingRooms: Array,
});

channelsSchema.method({
  isRoomExist: function (sentToUserId) {
    let roomIndex;
    const chatRoom = this.chattingRooms.find((room, index) => {
      if (`${room.sentTo}` === `${sentToUserId}`) {
        roomIndex = index;
        return room;
      }
    });
    return { chatRoom, roomIndex };
  },
  addNewMessage: function ({ roomIndex, newMessage }) {
    const currentMessages = this.chattingRooms[roomIndex].messages;
    const updateMessages = [...currentMessages, newMessage];
    return updateMessages;
  },
  createNewRoom: function ({ sentTo, message }) {
    return { sentTo, messages: [message] };
  },
  updateChattingRooms: function (newRoom) {
    return [...this.chattingRooms, newRoom];
  },
  deleteRoom: function (sentToUserId) {
    const updatedChattingRooms = this.chattingRooms.filter(
      (room) => `${room.sentTo}` !== `${sentToUserId}`
    );
    return updatedChattingRooms;
  },
});

const Channels = mongoose.model('channel', channelsSchema);

export default Channels;
