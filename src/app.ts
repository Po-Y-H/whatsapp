/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import express, { Request, Response } from "express";
import axios from "axios";

const app = express();
app.use(express.json());

const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN, PORT, WHATSAPP_PHONE_NUMBER_ID } = process.env;

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
        url: `https://graph.facebook.com/v20.0/${business_phone_number_id}/messages`,
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
        url: `https://graph.facebook.com/v20.0/${business_phone_number_id}/messages`,
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

app.get("/", (req: Request, res: Response) => {
  res.send(`<pre>Nothing to see here.
Checkout README.md to start.</pre>`);
});

app.listen(PORT || 3000, () => {
  console.log(`Server is listening on port: ${PORT || 3000}`);
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