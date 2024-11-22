/**
 * ExpressJS server which connects to OpenAI backend. REST API to interact with gpt model.
 * Provides for context injections, basic testing, and user feedback.
 */
import express from 'express';
import cors from "cors";
import {getGPTSummarizeResponse, isDev} from './openaiService.js';
import fs from 'fs';

const app = express();

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}
app.use(express.json());
app.use(cors(corsOptions));

// Default route (unhidden)
app.get('/', (req, res) => {
    res.send("The server is online!");
});

/**
 * Endpoint: /summarize
 * Send data to OpenAI API to summarize
 * @param req Request from client. Should contain:
 *      - 'message': text to summarize
 *      - 'context': instruct OpenAPI about what potential avoidance and dangerous content
 *      - 'vocabLevel': level of vocabulary that we expect from OpenAI API response
 * @return string summarization from OpenAI API
 */
app.post('/summarize', async (req, res) => {
    const message = req.body.params['0']['message'];
    const context = req.body.params['0']['context'];
    const vocab = req.body.params['0']['vocabLevel'];

    if (!message || !context) {
        return res.status(400).send("No message or context provided");
    }

    if (!vocab) {
        return res.status(400).send("Missing vocabLevelContext under context")
    }

    if (isDev){
        res.send("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.");
    } else {
        const response = await getGPTSummarizeResponse(message, context, vocab);
        res.send(response.choices[0].message.content); // Send back to FE
    }
});


// Web Port
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
