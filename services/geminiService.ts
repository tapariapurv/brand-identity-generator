
import { GoogleGenAI, Type } from "@google/genai";
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


async function generateBrandInfo(mission: string): Promise<{ colorPalette: Color[]; fontPairings: FontPairing; logoPrompt: string; secondaryMarksPrompt: string; }> {
    const prompt = `Based on the following company mission, generate a complete brand identity kit. The mission is: "${mission}"`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: brandInfoSchema,
        },
    });

    const text = response.text.trim();
    try {
        return JSON.parse(text);
    } catch (e) {
        console.error("Failed to parse brand info JSON:", text);
        throw new Error("Could not generate brand information. The AI's response was not valid JSON.");
    }
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

export async function generateBrandBible(mission: string): Promise<BrandIdentity> {
    const brandInfo = await generateBrandInfo(mission);
    
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
