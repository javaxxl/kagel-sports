import { GoogleGenAI, Modality } from '@google/genai';

// Fix: Initialize the GoogleGenAI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSpeech = async (text: string): Promise<string | null> => {
  try {
    // Fix: Implement the API call to generate speech content using the text-to-speech model.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // A calm, clear voice
          },
        },
      },
    });

    const base64Audio =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (base64Audio) {
      return base64Audio;
    }
    console.warn('No audio data received from Gemini API.');
    return null;
  } catch (error) {
    console.error('Error generating speech with Gemini API:', error);
    return null;
  }
};
