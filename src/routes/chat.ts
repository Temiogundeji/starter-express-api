import express from 'express';
import ChatAssistant from '../controllers/chat/chatAssistant';

const router = express.Router();

router.post("/new", ChatAssistant);

export default router;