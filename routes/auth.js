import express from 'express';
import { signIn, refresh, signOut } from '../controllers/auth.js';

const router = express.Router();

// router.post('/signup', signUp);
router.post('/signin', signIn);
router.get('/refresh', refresh);
router.post('/signout', signOut);

export default router;
