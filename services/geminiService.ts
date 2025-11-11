import { GoogleGenAI, Type } from "@google/genai";
import { TicketCategory, TicketPriority } from "../types";

const apiKey = import.meta.env.VITE_API_KEY;

if (!apiKey) {
  // This will stop the app from loading and show a clear error in the developer console
  // if the API key is missing.
  throw new Error("VITE_API_KEY is not defined. Please check your .env file and rebuild the application.");
}

const ai = new GoogleGenAI({ apiKey });

interface SuggestionResult {
    category: TicketCategory;
    priority: TicketPriority;
}

export async function suggestCategoryAndPriority(description: string): Promise<Partial<SuggestionResult>> {
  // A more robust prompt to guide the AI
  const prompt = `Analyze the following IT support ticket description and determine the most appropriate Category and Priority.
Category must be one of: 'Hardware', 'Software', 'Network', 'Account', 'Other'.
Priority must be one of: 'Low', 'Medium', 'High', 'Critical'.

Ticket Description:
---
${description}
---
`;

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
