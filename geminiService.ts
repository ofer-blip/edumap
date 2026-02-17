
import { GoogleGenAI } from "@google/genai";
import { School } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAIRecommendation = async (
  query: string,
  schools: School[],
  history: { role: 'user' | 'model'; parts: { text: string }[] }[]
) => {
  try {
    const schoolContext = schools
      .map(s => `- ${s.name} (${s.type}): ${s.city}, grades ${s.grades}`)
      .join('\n');

    const systemInstruction = `
      You are a specialized educational consultant for unique schools in Israel.
      Context: You are embedded in the "Netivim 360" app.
      List of schools currently in the user's view:
      ${schoolContext}

      Instructions:
      1. Answer in Hebrew.
      2. Be warm, professional, and pedagogical.
      3. Recommend specific schools from the list if they match the user's criteria.
      4. Explain pedagogical terms (e.g., Waldorf, Montessori, Democratic) briefly if asked.
      5. Use Google Search grounding for real-time news or details not in the provided school list.
      6. If you mention a school, ensure its name is accurate to the list.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: query }] }
      ],
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }]
      }
    });

    return {
      text: response.text,
      grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
