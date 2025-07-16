// import axios from "axios";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

// async function createEmbeddings(text:string) {
//     const response = await axios.post("http://localhost:11434/api/embeddings" , {
//         model : "nomic-embed-text:v1.5",
//         prompt : text
//     })


//     return response.data.embedding
// }

const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "textembedding-gecko@001",
});

export default async function createEmbeddings(text : string) {
    const vectors = await embeddings.embedQuery(text);
    return vectors;
}

