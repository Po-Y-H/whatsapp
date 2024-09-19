import { Request, Response } from 'express';
import * as messageService from '../services/message.service';

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { to, body } = req.body;
    const result = await messageService.sendWhatsAppMessage(to, body);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};