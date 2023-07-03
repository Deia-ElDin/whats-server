import 'express-async-errors';
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './db/connectDB.js';
import credentials from './middleware/credentials.js';
import errorHanlder from './middleware/errorHanlder.js';
import notFound from './middleware/notFound.js';
import authRouter from './routes/auth.js';
import searchRouter from './routes/search.js';
import contactsRouter from './routes/contact.js';
import channelRouter from './routes/channel.js';
import messageRouter from './routes/message.js';
import roomRouter from './routes/room.js';
import corsOptions from './config/corsOptions.js';
import whiteList from './config/whiteList.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import * as events from './events/socket.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5500;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: whiteList,
  },
});

app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/api/v1/channel', channelRouter);
app.use('/api/v1/search', searchRouter);
app.use('/api/v1/contacts', contactsRouter);
app.use('/api/v1/message', messageRouter);
app.use('/api/v1/room', roomRouter);

app.use(notFound);
app.use(errorHanlder);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    io.on('connection', (socket) => {
      socket.on('setup', (userId) => {
        socket.join(userId);
        socket.emit('connected');
      });

      socket.on('join room', (roomId) => socket.join(roomId));

      socket.on('send new message', (newMessage) => {
        const { accessedBy } = newMessage;
        accessedBy.forEach((id) => {
          if (id !== newMessage.createdBy) {
            socket.in(id).emit('receive new message', newMessage);
          }
        });
      });
    });
  } catch (err) {
    console.log(err);
  }
};

start();

// socket.on(
//   'start new chat',
//   async ({ senderId, receiverId }, callback) => {
//     const newRoom = await events.createRoom({ senderId, receiverId });
//     // console.log('newRoom', newRoom);
//     callback({ newRoom });
//     socket.join(newRoom._id);
//   }
// );

// socket.on(
//   'send one to one message',
//   async ({ message, receiverName }, callback) => {
//     // const { user, contact } = await events.getUsersIds(message);
//     const { createdBy, accessedBy, roomId } = message;
//     const receivedBy = accessedBy.find((id) => id !== createdBy);
//     if (receivedBy) {
//     } else {
//       // console.log('else');
//       const { receiver, newMessage } =
//         await events.sendOneToOneMessageWithUpdates({
//           message,
//           receiverName,
//         });
//       callback({ newMessage });
//       const receiverSokcetId = receiver.socketId;
//       if (!receiverSokcetId) return;
//       io.to(receiverSokcetId).emit('join request', roomId);
//     }

//     io.to(roomId).emit('receive one to one message', roomId, message);
//   }
// );

// socket.on('join room', async ({ roomId, receiverId }, callback) => {
//   // console.log('join room');
//   // console.log('socket.id', socket.id);
//   socket.join(roomId);
//   const room = await events.getRoom({ roomId, receiverId });
//   callback({ room });
//   const { accessedBy } = room;
//   // console.log('accessedBy', accessedBy);
//   const socketsArray = await events.getSockets([
//     ...accessedBy,
//     receiverId,
//   ]);
//   // console.log('socketsArray', socketsArray);
//   for (let i = 0; i < socketsArray.length; i++) {
//     io.to(socketsArray[i]).emit('update request', roomId);
//   }
// });

// socket.on('update room', async ({ roomId, userId }, callback) => {
//   // console.log('update room');
//   // console.log('socket.id', socket.id);
//   const updatedRoom = await events.updateRoom({ roomId, userId });
//   callback({ updatedRoom });
// });

// socket.on(
//   'get prev messages',
//   async ({ roomId, page, firstMessages }, callback) => {
//     // console.log('page', page);
//     const { prevMessages, gotAllData } = await events.getPrevMessages({
//       roomId,
//       page,
//       firstMessages,
//     });
//     callback({ prevMessages, gotAllData });
//   }
// );

// socket.on('disconnect', async () => {
//   // console.log('disconnect');
//   // socket.emit('cleare data', { data: 1 });
//   await events.handleDisconnect(socket.id);
// });
