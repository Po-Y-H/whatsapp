import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import router from './routes/routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use( router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

/*
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