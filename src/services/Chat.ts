import OpenAI from "openai";
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function ChatAssistant(content: string) {
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: "user", content: content }],
        model: "gpt-3.5-turbo",
    });

    return chatCompletion;
}