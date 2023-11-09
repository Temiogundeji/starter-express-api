"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = __importDefault(require("openai"));
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
async function ChatAssistant(content) {
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: "user", content: content }],
        model: "gpt-3.5-turbo",
    });
    return chatCompletion;
}
exports.default = ChatAssistant;
