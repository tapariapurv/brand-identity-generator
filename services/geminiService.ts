import { GoogleGenAI, Type, Chat } from "@google/genai";
import { BrandIdentity, Color, FontPairing } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const brandInfoSchema = {
  type: Type.OBJECT,
  properties: {
    colorPalette: {
      type: Type.ARRAY,
      description: "A 5-color palette. Provide descriptive names for each color.",
      items: {
        type: Type.OBJECT,
        properties: {
          hex: {
            type: Type.STRING,
            description: "Hex code, e.g., #FFFFFF",
          },
          name: {
            type: Type.STRING,
            description: "A creative or descriptive name for the color.",
          },
          usage: {
            type: Type.STRING,
            description: "How to use this color (e.g., Primary, Accent, Background).",
          },
        },
        required: ["hex", "name", "usage"],
      },
    },
    fontPairings: {
      type: Type.OBJECT,
      description: "A pair of Google Fonts that complement each other.",
      properties: {
        header: {
          type: Type.STRING,
          description: "Name of the Google Font for headers.",
        },
        body: {
          type: Type.STRING,
          description: "Name of the Google Font for body text.",
        },
      },
      required: ["header", "body"],
    },
    logoPrompt: {
        type: Type.STRING,
        description: 'A detailed, descriptive prompt for an image generation model to create a primary logo. Should be in a style like "a minimalist, geometric logo of a soaring eagle, clean lines, vector art, brand identity". Must be creative and evocative.'
    },
    secondaryMarksPrompt: {
        type: Type.STRING,
        description: 'A detailed, descriptive prompt for an image generation model to create two secondary brand marks or icons. Should be in a style like "two simple, minimalist icons related to a soaring eagle, one of a feather, one of a mountain peak, vector art, brand identity". Must be creative and evocative.'
    }
  },
  required: ["colorPalette", "fontPairings", "logoPrompt", "secondaryMarksPrompt"],
};

interface BrandInfo {
  colorPalette: Color[];
  fontPairings: FontPairing;
  logoPrompt: string;
  secondaryMarksPrompt: string;
}

async function generateImages(prompt: string, numberOfImages: number): Promise<string[]> {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: numberOfImages,
          outputMimeType: 'image/png',
          aspectRatio: '1:1',
        },
    });

    return response.generatedImages.map(img => `data:image/png;base64,${img.image.imageBytes}`);
}

async function createBrandIdentityFromInfo(brandInfo: BrandInfo): Promise<BrandIdentity> {
    const [primaryLogoResult, secondaryMarksResult] = await Promise.all([
        generateImages(brandInfo.logoPrompt, 1),
        generateImages(brandInfo.secondaryMarksPrompt, 2)
    ]);

    if (!primaryLogoResult[0] || secondaryMarksResult.length < 2) {
        throw new Error("Failed to generate required images.");
    }

    return {
        colorPalette: brandInfo.colorPalette,
        fontPairings: brandInfo.fontPairings,
        primaryLogoUrl: primaryLogoResult[0],
        secondaryMarksUrls: secondaryMarksResult,
    };
}


function parseJsonResponse(text: string): BrandInfo {
     try {
        return JSON.parse(text);
    } catch (e) {
        console.error("Failed to parse brand info JSON:", text);
        throw new Error("Could not generate brand information. The AI's response was not valid JSON.");
    }
}

export async function startBrandGeneration(mission: string): Promise<{ brandIdentity: BrandIdentity; chat: Chat }> {
    const chat = ai.chats.create({
        model: "gemini-2.5-flash",
        // FIX: Moved systemInstruction into the config object as per Gemini API guidelines.
        config: {
            responseMimeType: "application/json",
            responseSchema: brandInfoSchema,
            systemInstruction: "You are a world-class brand identity designer. Your task is to generate a complete brand identity based on a user's mission. You will always respond with a single, valid JSON object that conforms to the provided schema."
        },
    });

    const prompt = `Based on the following company mission, generate a complete brand identity kit. The mission is: "${mission}"`;
    // FIX: Updated chat.sendMessage to pass an object with a 'message' property.
    const response = await chat.sendMessage({ message: prompt });
    
    const brandInfo = parseJsonResponse(response.text.trim());
    const brandIdentity = await createBrandIdentityFromInfo(brandInfo);

    return { brandIdentity, chat };
}

export async function refineBrandGeneration(chat: Chat, currentIdentity: BrandIdentity, refinement: string): Promise<BrandIdentity> {
    const prompt = `Here is the current brand identity JSON: ${JSON.stringify(currentIdentity)}. My refinement request is: "${refinement}". Please generate a new, complete brand identity in the same JSON format that incorporates this change. Only output the new JSON object.`;
    
    // FIX: Updated chat.sendMessage to pass an object with a 'message' property.
    const response = await chat.sendMessage({ message: prompt });
    
    const newBrandInfo = parseJsonResponse(response.text.trim());
    const newBrandIdentity = await createBrandIdentityFromInfo(newBrandInfo);

    return newBrandIdentity;
}