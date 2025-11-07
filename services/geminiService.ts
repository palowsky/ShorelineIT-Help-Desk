import { GoogleGenAI, Type } from "@google/genai";
import { TicketCategory, TicketPriority } from "../types";

// FIX: Conditionally initialize GoogleGenAI to prevent errors when API_KEY is missing.
let ai: GoogleGenAI | null = null;
if (process.env.API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
} else {
  console.warn("Gemini API key not found. AI features will be disabled.");
}

interface SuggestionResult {
    category: TicketCategory;
    priority: TicketPriority;
}

export async function suggestCategoryAndPriority(description: string): Promise<Partial<SuggestionResult>> {
  // FIX: Check for the `ai` instance instead of the raw API key.
  if (!ai) {
    throw new Error("API key is not configured.");
  }

  // FIX: Simplify prompt as JSON output is enforced by `responseSchema`.
  // Gemini Coding Guidelines: Simplify prompt when using responseSchema.
  const prompt = `Analyze the following IT support ticket description and determine the most appropriate category and priority: "${description}"`;

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
    throw new Error("Failed to get suggestions from AI.");
  }
}
