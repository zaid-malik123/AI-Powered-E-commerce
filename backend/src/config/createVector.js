import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})

const generateVector = async (data) => {
    const response = await ai.models.embedContent({
         model: "gemini-embedding-001",
         contents: data,
         config: {
            outputDimensionality: 768
         }
    })

    return response.embeddings[0].values;
}

export {generateVector}