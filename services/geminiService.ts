
import { GoogleGenAI } from "@google/genai";
import { Language, MediaType, AuthorStyle } from "../types";

export async function generateHumorousReview(
  title: string,
  type: MediaType,
  lang: Language,
  overview: string,
  style: AuthorStyle = 'humorous'
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const langPrompt = {
    'en': 'English',
    'zh-TW': 'Traditional Chinese (繁體中文)',
    'zh-CN': 'Simplified Chinese (简体中文)'
  }[lang];

  const stylePrompts: Record<AuthorStyle, string> = {
    humorous: "funny, witty, and lighthearted with a touch of playful irony.",
    toxic: "extremely sarcastic, cynical, 'roast-style' and blunt. Point out every flaw with biting humor.",
    sentimental: "emotional, poetic, and deep. Focus on the feelings and themes, slightly nostalgic and moving."
  };

  const prompt = `Write a review for the ${type === 'movie' ? 'movie' : 'TV show'} "${title}".
  Style: ${stylePrompts[style]}
  The review should be between 200 to 300 words. 
  Include a "The Good", "The Bad", and a final "The Verdict" section.
  Keep it engaging like a modern blog post.
  Language: ${langPrompt}.
  
  Context (Overview): ${overview}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.9,
        topP: 0.95,
      }
    });
    return response.text || "Failed to generate review.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Generation Error: Make sure your API key is valid.";
  }
}
