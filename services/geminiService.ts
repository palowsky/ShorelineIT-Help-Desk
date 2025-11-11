import { GoogleGenAI, Type } from "@google/genai";
import { TicketCategory, TicketPriority } from "../types";

// Fix: Per coding guidelines, initialize GoogleGenAI with process.env.API_KEY.
// This also resolves the TypeScript error related to 'import.meta.env'.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


interface SuggestionResult {
    category: TicketCategory;
    priority: TicketPriority;
}

export async function suggestCategoryAndPriority(description: string): Promise<Partial<SuggestionResult>> {
  const prompt = `Suggest a category and priority for this IT support ticket: "${description}"`;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    category: {
                        type: Type.STRING,
                        enum: ['Hardware', 'Software', 'Network', 'Account', 'Other'],
                        description: 'The category of the IT ticket.'
                    },
                    priority: {
                        type: Type.STRING,
                        enum: ['Low', 'Medium', 'High', 'Critical'],
                        description: 'The priority level of the ticket.'
                    },
                },
                required: ["category", "priority"],
            },
        },
    });

    const text = response.text.trim();
    if (!text) {
        console.error("Gemini API returned an empty response.");
        throw new Error("Failed to get suggestions from AI: empty response.");
    }

    const result = JSON.parse(text) as SuggestionResult;

    // Validate the response from the model
    const validCategories: TicketCategory[] = ['Hardware', 'Software', 'Network', 'Account', 'Other'];
    const validPriorities: TicketPriority[] = ['Low', 'Medium', 'High', 'Critical'];

    const finalResult: Partial<SuggestionResult> = {};
    if (result.category && validCategories.includes(result.category)) {
        finalResult.category = result.category;
    }
    if (result.priority && validPriorities.includes(result.priority)) {
        finalResult.priority = result.priority;
    }

    return finalResult;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof SyntaxError) { // JSON parsing error
        console.error("Failed to parse Gemini API response as JSON.");
    }
    throw new Error("Failed to get suggestions from AI.");
  }
}