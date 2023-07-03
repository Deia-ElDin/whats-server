import express from 'express';
import {
  getChannelList,
  createChannelList,
  updateChannel,
  deleteChannel,
} from '../controllers/channels.js';
import verifyJwt from '../middleware/verifyJwt.js';

const router = express.Router();

router.post('/', verifyJwt, createChannelList);
router
  .route('/:id')
  .get(verifyJwt, getChannelList)
  .patch(verifyJwt, updateChannel)
  .delete(verifyJwt, deleteChannel);

export default router;
