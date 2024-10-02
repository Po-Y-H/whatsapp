import { Request, Response } from 'express';
import * as messageService from '../services/message.service';

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { toPhoneNumber, textMessage } = req.body;
    const result = await messageService.sendWhatsAppMessage(toPhoneNumber, textMessage);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};