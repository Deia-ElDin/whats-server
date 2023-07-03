import mongoose from 'mongoose';

const { Schema } = mongoose;

const MessageSchema = Schema(
  {
    content: String,
    document: {
      type: Map,
      of: {
        name: String,
        src: String,
        type: String,
        content: String,
        selected: Boolean,
      },
    },
    createdBy: { type: mongoose.Types.ObjectId, ref: 'User' },
    accessedBy: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    seenBy: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    roomId: { type: mongoose.Types.ObjectId, ref: 'Room' },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', MessageSchema);

export default Message;
