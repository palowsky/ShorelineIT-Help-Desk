import { GoogleGenAI, Type } from "@google/genai";
import { TicketCategory, TicketPriority } from "../types";

// The API key is loaded from Vite's environment variables.
// In a production build, Vite replaces this with the actual key from the .env file.
const apiKey = import.meta.env.VITE_API_KEY;
if (!apiKey) {
    // This provides a clear error in the browser console if the .env file is missing or misconfigured.
    throw new Error("VITE_API_KEY is not set. Please create a .env file and add the key.");
}

const ai = new GoogleGenAI({ apiKey });


interface SuggestionResult {
    category: TicketCategory;
    priority: TicketPriority;
}

export async function suggestCategoryAndPriority(description: string): Promise<Partial<SuggestionResult>> {
  // Gemini Coding Guidelines: Simplify prompt when using responseSchema.
  const prompt = `Based on the following IT support ticket description, suggest a category and priority.\nDescription: "${description}"`;

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

    // Gemini Coding Guidelines: Correctly extract text from response.
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