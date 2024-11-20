/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import express, { Request, Response } from "express";
import {initializeDB} from '../db/initializeDB';
import {getAllReceivedMessages, getAllSentMessages} from '../db/messageDB';
import router from './routes/routes'
import path = require('path');

const app = express();
app.use(express.json());
app.use('/', router);

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

app.get("/sendMessage", (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, '../public/sendMessage.html'));
});

app.get('/messages', (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, '../public/messages.html'));
});

app.get('/messagesData', async (req: Request, res: Response) => {
  try {
    const receivedMessages = await getAllReceivedMessages();
    const sentMessages = await getAllSentMessages();

    res.json({
      receivedMessages: receivedMessages,
      sentMessages: sentMessages,
    });
  } catch (error) {
    console.error('Error retrieving messages:', error);
    res.status(500).send('Failed to retrieve messages');
  }
});

interface WebhookRequestBody {
  entry: {
    changes: {
      value: {
        messages?: {
          type: string;
          from: string;
          id: string;
          text: { body: string };
        }[];
        metadata?: { phone_number_id: string };
      };
    }[];
  }[];
}

app.listen(process.env.PORT || 3000, async () => {
  try {
    await initializeDB(); // Initialize the database
    console.log(`Server is listening on port: ${process.env.PORT || 3000}`);
  } catch (err) {
    console.error("Database initialization failed:", err);
    process.exit(1); // Exit the process with an error code
  }
});
