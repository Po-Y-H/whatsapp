import express from 'express';
import * as messageController from '../controllers/message.controller';
import * as webhookController from '../controllers/webhook.controller';

const router = express.Router();

router.post('/webhook', webhookController.handleIncomingMessage);
router.get('/webhook', webhookController.verifyWebhook);
router.post('/sendMsg', messageController.sendMessage);

export default router;