import express from 'express';
import { registerUser, activateUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);

router.get('/activate/:token', activateUser);

export default router;
