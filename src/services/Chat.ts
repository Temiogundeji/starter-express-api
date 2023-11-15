import { DiscussServiceClient } from "@google-ai/generativelanguage";
import { GoogleAuth } from "google-auth-library";
import 'dotenv/config';

const MODEL_NAME = "models/chat-bison-001";
const API_KEY: string = process.env.API_KEY as string;

const client = new DiscussServiceClient({
    authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

async function main(searchQuery: string) {
    let first = searchQuery;
    let messages = [{ content: first, type: "You" }];

    const result: any = await client.generateMessage({
        model: MODEL_NAME,
        prompt: { messages },
    });

    messages.push({ content: result[0].candidates[0].content.split("/n").join("<br>"), type: "AI Assistant" });
    return messages;
}

export default main;