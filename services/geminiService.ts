
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    overallScore: {
      type: Type.NUMBER,
      description: "A single overall score from 0 to 100 representing the track's radio-readiness.",
    },
    recommendation: {
      type: Type.STRING,
      description: "A final verdict, either 'Recommended for Radio', 'Needs Work', or 'Not Recommended'.",
      enum: ['Recommended for Radio', 'Needs Work', 'Not Recommended'],
    },
    summary: {
      type: Type.STRING,
      description: "A 2-3 sentence summary of the analysis, written in an encouraging tone for an artist or audio engineer.",
    },
    metrics: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "The name of the metric (e.g., 'Dynamic Range', 'Loudness (LUFS)', 'Stereo Width', 'Frequency Balance', 'Clarity & Presence', 'Technical Issues')."
          },
          value: {
            type: Type.STRING,
            description: "The measured value or qualitative assessment for the metric (e.g., '8 DR', '-10 LUFS', 'Wide', 'Well-balanced', 'Excellent', 'Minor clipping detected')."
          },
          rating: {
            type: Type.NUMBER,
            description: "A numerical rating from 0 (poor) to 10 (excellent) for this specific metric."
          },
          explanation: {
            type: Type.STRING,
            description: "A brief, constructive explanation of the metric's rating and what it means for the track's radio potential."
          }
        },
        required: ["name", "value", "rating", "explanation"]
      }
    }
  },
  required: ["overallScore", "recommendation", "summary", "metrics"],
};

export const analyzeTrack = async (fileName: string): Promise<AnalysisResult> => {
  const prompt = `
    Act as a world-class mastering engineer providing a final quality check for a music track titled "${fileName}".
    The artist wants to know if this track is "radio-ready" based on modern professional studio standards.
    Your analysis must be constructive, insightful, and encouraging.

    Provide a detailed analysis covering the following key metrics:
    1.  **Dynamic Range:** Evaluate if the track is appropriately compressed for radio play without being lifeless.
    2.  **Loudness (LUFS):** Assess the integrated loudness. Target for radio is typically between -9 and -14 LUFS.
    3.  **Stereo Width:** Is the stereo image wide and engaging, or is it too narrow or phasey?
    4.  **Frequency Balance:** Check for issues like excessive bass, harsh highs, or a muddy midrange.
    5.  **Clarity & Presence:** How clear are the lead vocals and key instruments? Do they cut through the mix?
    6.  **Technical Issues:** Listen for digital clipping, distortion, sibilance, or other artifacts.

    Based on these metrics, generate a final verdict and overall score.
    Your entire response MUST conform to the provided JSON schema. Do not output any text outside of the JSON structure.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.5
      },
    });

    const jsonText = response.text.trim();
    // In case the response is wrapped in markdown
    const cleanedJsonText = jsonText.startsWith('```json') ? jsonText.replace(/^```json\n|```$/g, '') : jsonText;
    const parsedResult: AnalysisResult = JSON.parse(cleanedJsonText);
    return parsedResult;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to get analysis from Gemini API.");
  }
};
