import { GoogleGenAI } from "@google/genai";
import { AspectRatio } from '../types';

// Safely access process.env.API_KEY, assuming it will be injected or available via the shim
const apiKey = process.env.API_KEY;

// Initialize the client strictly according to guidelines
// We initialize lazily or just handle the potential missing key gracefully in the function if needed,
// but for the global instance, we assume the environment is set up correctly as per instructions.
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export const generateImageFromText = async (
  prompt: string, 
  aspectRatio: AspectRatio,
  referenceImage?: { data: string; mimeType: string }
): Promise<string | null> => {
  
  if (!apiKey) {
    console.error("API Key is missing");
    throw new Error("API Key not found. Please check your environment configuration.");
  }

  try {
    const parts: any[] = [];

    // If a reference image is provided, add it to the parts first
    if (referenceImage) {
      parts.push({
        inlineData: {
          data: referenceImage.data,
          mimeType: referenceImage.mimeType,
        },
      });
    }

    // Add the text prompt
    parts.push({ text: prompt });

    // Using gemini-2.5-flash-image for generation and editing tasks
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        }
      }
    });

    // Iterate through parts to find the image data as per guidelines
    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const base64EncodeString = part.inlineData.data;
          // Construct the data URL
          return `data:image/png;base64,${base64EncodeString}`;
        }
      }
    }
    
    return null;

  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};