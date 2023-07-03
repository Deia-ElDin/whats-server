import express from 'express';
import {
  getAllContacts,
  addContact,
  deleteContact,
} from '../controllers/contact.js';
import verifyJwt from '../middleware/verifyJwt.js';

const contactsRouter = express.Router();

contactsRouter
  .route('/:userId')
  .get(verifyJwt, getAllContacts)
  .post(verifyJwt, addContact)
  .delete(verifyJwt, deleteContact);

export default contactsRouter;
