/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import express, { Request, Response } from "express";
import axios from "axios";
import {initializeDB} from '../db/initializeDB';
import {getAllReceivedMessages, getAllSentMessages} from '../db/messageDB';
import router from './routes/routes'
import path = require('path');

const app = express();
app.use(express.json());
app.use('/', router);

const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN, PORT, WHATSAPP_PHONE_NUMBER_ID } = process.env;


// Route for the root path with form
app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

app.get("/sendMessage", (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, '../public/sendMessage.html'));
});

// Endpoint to get all messages
app.get('/messages', async (req, res) => {
  try {
    const receivedMessages = await getAllReceivedMessages();
    const sentMessages = await getAllSentMessages();

    const receivedMessageList = receivedMessages.map(message => 
      `<li>ID: ${message.id}, From: ${message.from}, Body: ${message.body}, Created At: ${message.created_at}</li>`
    ).join('');
    const sentMessageList = sentMessages.map(message => 
      `<li>To: ${message.to}, Body: ${message.body}, Created At: ${message.created_at}</li>`
    ).join('');

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>All Messages</title>
      </head>
      <body>
        <h1>All Received Messages</h1>
        <ul>
          ${receivedMessageList}
        </ul>
        <h1>All Sent Messages</h1>
        <ul>
          ${sentMessageList}
        </ul>
      </body>
      </html>
    `);
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

app.post("/webhook", async (req: Request<{}, {}, WebhookRequestBody>, res: Response) => {
  console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));

  const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];

  if (message?.type === "text") {
    const business_phone_number_id = WHATSAPP_PHONE_NUMBER_ID
      req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;

    try {
      // Send a reply message
      await axios({
        method: "POST",
        url: `https://graph.facebook.com/v20.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
        headers: {
          Authorization: `Bearer ${GRAPH_API_TOKEN}`,
        },
        data: {
          messaging_product: "whatsapp",
          to: message.from,
          text: { body: "Echo: " + message.text.body },
          context: {
            message_id: message.id,
          },
        },
      });

      // Mark message as read
      await axios({
        method: "POST",
        url: `https://graph.facebook.com/v20.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
        headers: {
          Authorization: `Bearer ${GRAPH_API_TOKEN}`,
        },
        data: {
          messaging_product: "whatsapp",
          status: "read",
          message_id: message.id,
        },
      });

      res.sendStatus(200);
    } catch (error) {
      console.error("Error sending message or marking as read:", error);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(200);
  }
});

app.get("/webhook", (req: Request, res: Response) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
    res.status(200).send(challenge as string);
    console.log("Webhook verified successfully!");
  } else {
    res.sendStatus(403);
  }
});


app.listen(PORT || 3000, async () => {
  try {
    await initializeDB(); // Initialize the database
    console.log("Database initialized successfully.");
    console.log(`Server is listening on port: ${PORT || 3000}`);
  } catch (err) {
    console.error("Database initialization failed:", err);
    process.exit(1); // Exit the process with an error code
  }
});

/*
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import router from './routes/routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use( bodyParser.json() );
app.use( router );

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


const axios = require('axios');

const sendMessage = async () => {
    try {
        const response = await axios({
            method: 'POST',
            url: `https://graph.facebook.com/v20.0/426724537181127/messages`,
            headers: {
                'Authorization': `Bearer EAAEN87sStHcBOZCd0bq5Lm7XuNK9cXKrQV5YcIXh4ZAZBpovbD8Nm9qXFxQcZAIxcGTKfI1Ksun06355ODmIjxt0ZCtWFhNwkXSj6ZBuMCiolMHsf4BFwogKbfclZAYtLfQFtmwITv6gHxUmrLJpg3nD0iXPOPRzCaygWVj7dvodkgx8UMgwpo4l0pdQxfrD3Tbtly62KLxxkA2vN82SeGH`,
                'Content-Type': 'application/json',
            },
            data: {
                "messaging_product": "whatsapp",
                "to": "15162053001",
                "text": {"body" : "Let me know you get this"}
            }
        });

        console.log('Message sent:', response.data);
    } catch (error) {
        console.error('Error sending message:', error.response ? error.response.data : error.message);
    }
};

sendMessage();
 */