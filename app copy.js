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
app.use(express.json());
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
      socket.on('new room', async ({ room, userId, contactId }, callback) => {
        console.log('socket.id1', socket.id);
        const { modifiedRoom, contact } = await events.newRoom({
          room,
          contactId,
        });
        const roomId = modifiedRoom._id;
        const contactSokcetId = contact.socketId;
        socket.join(roomId);
        if (contactSokcetId) {
          socket.to(contactSokcetId).emit('join request', roomId);
          console.log('join request');
        }

        callback({ modifiedRoom });

        console.log('modifiedRoom', modifiedRoom);
      });
      socket.on('join room', (roomId) => {
        console.log('join room');
        console.log('socket.id2', socket.id);
        socket.join(roomId);
      });
      // socket.on('create message', async (message, callback) => {
      //   console.log(message);
      // });

      socket.on('send private message', async (message) => {
        const { roomId } = message;
        console.log('roomId', roomId);
        console.log('message', message);
        // socket.join(roomId);
        // const socketId = await events.sendPrivateMessage(message);
        // if (!socketId) return;
        // const room = await events.receivePrivateMessage(message);
        // socket.in(socketId).emit('receive private message', room, message);
        io.to(roomId).emit('receive private message', roomId, message);
        // socket.emit('receive private message', (callback) => {
        //   console.log('socket', socket);
        //   callback({ roomId });
        // });
      });

      socket.on('receive private message', (userId, callback) => {
        console.log('userId', userId);
        // callback({ roomId });
      });

      socket.on(
        'get prev messages',
        async ({ roomId, page, firstMessages }, callback) => {
          console.log('page', page);
          const { prevMessages, gotAllData } = await events.getPrevMessages({
            roomId,
            page,
            firstMessages,
          });
          callback({ prevMessages, gotAllData });
        }
      );

      socket.on('disconnect', async () => {
        await events.handleDisconnect(socket.id);
      });
    });
  } catch (err) {
    console.log(err);
  }
};

start();
