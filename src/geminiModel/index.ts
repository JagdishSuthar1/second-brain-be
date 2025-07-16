import { ChatOllama } from "@langchain/ollama";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// const ollamaModel = new ChatOllama({
//     baseUrl: "http://localhost:11434",
//     model: "llama3.2:1b"
// });
import envFile from "dotenv";
envFile.config()

const geminiModel = new ChatGoogleGenerativeAI({
    model : "gemini-1.5-pro",
    apiKey : process.env.GEMINI_API_KEY
})

export default geminiModel