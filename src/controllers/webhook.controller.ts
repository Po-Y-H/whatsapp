import { Request, Response } from 'express';
import * as webhookService from '../services/webhook.service';

export const handleIncomingMessage = (req: Request, res: Response) => {
  const { body } = req;

  if (webhookService.isValidWhatsAppMessage(body)) {
    const message = webhookService.extractMessage(body);
    console.log('Received message:', message);
    // TODO: Add your business logic here
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
};

export const verifyWebhook = (req: Request, res: Response) => {
  const verifyToken = process.env.VERIFY_TOKEN;

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (webhookService.isValidVerification(mode, token, verifyToken)) {
    console.log('Webhook verified');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
};
