import express from 'express';
import payStackWebHook from '../controllers/payment/webhook';

const router = express.Router();

router.post("/webhook", payStackWebHook);

export default router;