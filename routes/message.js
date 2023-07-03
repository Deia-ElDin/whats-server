import express from 'express';
import {
  // getCurrentRoomMessages,
  getPrevMessages,
  getLastMessages,
  createMessage,
  deleteMessage,
  deleteManyMessages,
} from '../controllers/message.js';
import verifyJwt from '../middleware/verifyJwt.js';

const messageRouter = express.Router();

// messageRouter.get('/all/:roomId', verifyJwt, getCurrentRoomMessages);
messageRouter.get('/prev', verifyJwt, getPrevMessages);
messageRouter.get('/last/:roomId', verifyJwt, getLastMessages);

messageRouter
  .route('/')
  .post(verifyJwt, createMessage)
  .delete(verifyJwt, deleteManyMessages);

messageRouter.delete('/delete', deleteMessage);

export default messageRouter;
