import express from 'express';
import {
  getAllRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  deleteChat,
} from '../controllers/room.js';
import verifyJwt from '../middleware/verifyJwt.js';

const roomRouter = express.Router();

roomRouter.get('/rooms/:userId', verifyJwt, getAllRooms);
roomRouter.post('/', verifyJwt, createRoom);
roomRouter
  .route('/:roomId')
  .get(verifyJwt, getRoom)
  .patch(verifyJwt, updateRoom)
  .delete(verifyJwt, deleteRoom);

roomRouter.delete('/delete/:roomId', verifyJwt, deleteChat);

export default roomRouter;
