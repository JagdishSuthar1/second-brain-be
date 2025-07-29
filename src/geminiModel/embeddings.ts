import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import dotenv from "dotenv";

dotenv.config();

const embeddings = new GoogleGenerativeAIEmbeddings({
  model:  "models/embedding-001",
  apiKey: process.env.GEMINI_API_KEY,
});


export default async function createEmbeddings(text: string) {
  const vectors = await embeddings.embedQuery(text);
  return vectors;
}
