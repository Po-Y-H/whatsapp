import { Request, Response } from 'express';
import * as webhookService from '../services/webhook.service';
import {insertIncomingMessage} from '../../db/messageDB'


export const processWebhook = (req: Request, res: Response) => {
  const { body } = req;
  const changes = body.entry[0].changes[0];
  const field = changes.field;
  if (field == "messages") {
    if (webhookService.isValidWhatsAppMessage(body)) {
      const message = webhookService.extractMessage(body);
      console.log('Received message:', message);
      // TODO: Add your business logic here
      insertIncomingMessage(message);
      res.sendStatus(200);
    } 
    else {
      res.sendStatus(404);
    }
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
