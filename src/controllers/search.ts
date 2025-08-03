import { RequestHandler } from "express";
import createEmbeddings from "../geminiModel/embeddings";
import contentModel from "../db/content";
import { ChatPromptTemplate } from "@langchain/core/prompts"
import z from "zod"
import geminiModel from "../geminiModel/index";
import { StructuredOutputParser } from "langchain/output_parsers";
import { Document } from "langchain/document";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents"
import userModel from "../db/user";


export const GetTop2Document: RequestHandler = async (req, res) => {
    const { text } = req.body;

    if (text != null) {
        //console.log(text);
        try {
            const searchEmbedding = await createEmbeddings(text);
            // here i am calling to mongodb with this embeddings;
            const results = await contentModel.collection.aggregate([
                {
                    $vectorSearch: {
                        index: "embedForContent",
                        queryVector: searchEmbedding,
                        path: 'embedding',
                        numCandidates: 5,
                        limit: 2
                    }
                },
                {
                    $project: {
                        link: 1,
                        type: 1,
                        title: 1,
                        data: 1,
                        allTags: 1,
                        userId: 1,
                        created: 1,
                    }
                }
            ]).toArray();

            //console.log(results);
            res.status(200).json({
                success: true,
                message: "Suggestion fetched Successfully",
                data: results
            })

        }
        catch (err) {
            //console.log(err);
            res.json({
                success: false,
                message: "Embeddings not created"
            })
        }
    }


}


export const GetSummaryFromAi: RequestHandler = async (req, res) => {
    const { reqQuery, documents } = req.body;
    //console.log(req.body)
    // if (reqQuery && documents) {
    try {
        const docs = [];
        for (let i = 0; i < documents.length; i++) {
            const newdoc = new Document({
                pageContent: documents[i].data,
            })

            docs.push(newdoc)
        }

        //console.log(docs);
        const zodSchema = z.object({
            title: z.string().describe("Title"),
            summary: z.string().describe("Summary about the query"),
            keyPoints: z.array(z.string()).describe("Array of 10 key points"),
            detailInformation: z.string().describe("detail Information about the query"),


        })

        // const prompt = ChatPromptTemplate.fromTemplate("Generate the contents for the query : {query} with the given context : {context} in the following json schema : {instructions}");
        const prompt = ChatPromptTemplate.fromMessages([
            ["system",
                `You are a JSON-only generator. Your task is to return a JSON object that strictly matches the following structure:


  "title": string,                  // A short title summarizing the content
  "summary": string,     // Generate A Summary related to the input with the context and your knowledge
  "keyPoints": string[20]          // Exactly 20 key points as an array of strings
  "detailInformation": string,     // Generate A Detail explanation related to the input with the context and your knowledge



RULES:
- Output ONLY a valid JSON object.
- Do NOT include explanations, comments, markdown, or code blocks.
- Do NOT return anything other than the JSON object.
`],
            ["user", "Input: {query}\nContext: {context}\n\nRespond with the JSON:"]
        ]);



        const chain = await createStuffDocumentsChain({
            llm: geminiModel,
            prompt: prompt
        })

        const outPutParser =  StructuredOutputParser.fromZodSchema(zodSchema as any)
        const outputChain = chain.pipe(outPutParser);

        const response = await outputChain.invoke({
            query: reqQuery,
            context: docs
        })

        res.status(200).json({
            success: true,
            message: "Ai Response fetched Successfully",
            data: response
        })
    }


    catch (err) {
        res.status(400).json({
            success: false,
            message: "Ai is not working",
        })
    }
    // }

    // else {
    //     res.status(400).json({
    //         success: false,
    //         message: "Query and Documents are not given",
    //     })
    // }


}



export const GetAllUsers: RequestHandler = async (req, res) => {
    const { query } = req.body;

    if (query != null) {
        //console.log(query);
        try {
            const regex = new RegExp(query, "i");
            const results = await userModel.find({ username: regex });


            //console.log(results);
            res.status(200).json({
                success: true,
                message: "Users fetched Successfully",
                data: [...results]
            })

        }
        catch (err) {
            //console.log(err);
            res.json({
                success: false,
                message: "Embeddings not created"
            })
        }
    }
    else {
        res.json({
            success: false,
            message: "Query if not defined"
        })
    }


}

