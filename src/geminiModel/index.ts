import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";

dotenv.config();

const geminiModel = new ChatGoogleGenerativeAI({
  model: "models/gemini-1.5-pro",
  apiKey: process.env.GEMINI_API_KEY,
  temperature: 0.7,
});

export default geminiModel;

