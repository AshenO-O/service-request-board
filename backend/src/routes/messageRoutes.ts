import express from 'express';
import { sendMessage, getConversation, getUserConversations } from '../controllers/messageController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/messages/send', auth, sendMessage);
router.get('/messages/conversation/:jobId', auth, getConversation);
router.get('/messages/conversations', auth, getUserConversations);

export default router;