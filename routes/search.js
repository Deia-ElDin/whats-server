import express from 'express';
import { findUserInDB } from '../controllers/search.js';

const searchRouter = express.Router();

searchRouter.get('/', findUserInDB);

export default searchRouter;
