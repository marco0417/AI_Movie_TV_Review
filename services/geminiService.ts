
import { GoogleGenAI } from "@google/genai";
import { Language, MediaType, AuthorStyle } from "../types";

export async function generateHumorousReview(
  title: string,
  type: MediaType,
  lang: Language,
  overview: string,
  style: AuthorStyle = 'humorous'
): Promise<string> {
  // Always create a new instance to pick up the injected process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
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

    const text = response.text;
    if (!text) throw new Error("Gemini returned an empty response.");
    return text;
  } catch (error: any) {
    console.error("Gemini Error Detail:", error);
    // Throw a cleaner error for the UI
    if (error.message?.includes("API Key")) {
      throw new Error("API Key must be set. Please go to Admin -> Site Settings to connect your Gemini AI Key.");
    }
    throw new Error(error.message || 'AI Generation failed');
  }
}
