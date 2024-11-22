/**
 * Used for connecting to OpenAI.
 * Provides connection, and response function wrapper
 */
import OpenAI from 'openai';
import fs from 'fs';

let apiKey = ""
try {
    apiKey = fs.readFileSync("./api_key.txt", 'utf8').trim();
} catch (error) {
    console.error("API key file not found. Assuming this is dev mode");
}
const isDev = !apiKey;

// Creates an OpenAI connection using the provided api key
const openai = new OpenAI({
    apiKey: apiKey
});

/**
 * Function for getting a response from the gpt model.
 * @param message the text to summarize
 * @param context the context message to help form a response
 * @param vocabLevel vocab level
 * @returns gpt response object
 */
const getGPTSummarizeResponse = async (message, context, vocabLevel) => await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
        {
            "role": "user",
            "content": "Summarize this given user message in a neutral and concise manner, but still contains good amount of detail. Use bullet points and headings."
        },
        {
            "role": "user",
            "content": message
        },
        {
            "role": "system",
            "content": context
        },
        {
            "role": "system",
            "content": vocabLevel
        }
    ],
});


export {getGPTSummarizeResponse, isDev};