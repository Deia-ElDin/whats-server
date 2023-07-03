import mongoose, { mongo } from 'mongoose';
// import User from './User';
// import Message from './Message';

const { Schema } = mongoose;

const RoomSchema = Schema(
  {
    roomName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    accessedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  },
  { timestamps: true }
);

const Room = mongoose.model('Room', RoomSchema);

// RoomSchema.static({
//   getContactDetails: async function () {
//     const contactDetails = await User.findOne({userId: contactId}).exec();

//   }
// })

export default Room;
