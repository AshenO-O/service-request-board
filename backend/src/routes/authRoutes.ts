import express from 'express';
import { signup, login, getMe, updateProfile } from '../controllers/authController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', auth, getMe);
router.put('/profile', auth, updateProfile);

export default router;