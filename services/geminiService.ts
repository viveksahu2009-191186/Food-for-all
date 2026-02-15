
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeFoodDonation = async (description: string, imageUrl?: string) => {
  const model = 'gemini-3-flash-preview';
  
  const contents = imageUrl ? {
    parts: [
      { inlineData: { mimeType: "image/jpeg", data: imageUrl.split(',')[1] } },
      { text: `Analyze this food for donation. Extract details and perform a safety risk assessment. Input: ${description}` }
    ]
  } : {
    parts: [{ text: `Analyze this food for donation. Extract details and perform a safety risk assessment. Input: ${description}` }]
  };

  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          foodType: { type: Type.STRING, description: "One of: Vegetarian, Non-Vegetarian, Vegan" },
          allergens: { type: Type.ARRAY, items: { type: Type.STRING } },
          expiryWindow: { type: Type.STRING },
          prepTime: { type: Type.STRING },
          riskLevel: { type: Type.STRING },
          safetyNotes: { type: Type.STRING },
          suggestedTitle: { type: Type.STRING },
          shortSummary: { type: Type.STRING }
        },
        required: ["category", "foodType", "allergens", "expiryWindow", "prepTime", "riskLevel", "safetyNotes", "suggestedTitle", "shortSummary"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const generateCSRReport = async (userData: any) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a professional corporate social responsibility (CSR) summary for: ${JSON.stringify(userData)}. 
    Include environmental impact (CO2 saved), community reach (meals served), and a vision statement for their sustainability contribution.
    Return JSON with keys: executiveSummary, keyStats (string), visionStatement, taxBenefitNote.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          executiveSummary: { type: Type.STRING },
          keyStats: { type: Type.STRING },
          visionStatement: { type: Type.STRING },
          taxBenefitNote: { type: Type.STRING }
        },
        required: ["executiveSummary", "keyStats", "visionStatement", "taxBenefitNote"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const getPredictiveAnalytics = async (history: any) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze recovery history: ${JSON.stringify(history)}. Identify peaks and waste patterns. Return JSON with nextPeak, highNeedAreas, wastePattern, preventionTip.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          nextPeak: { type: Type.STRING },
          highNeedAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
          wastePattern: { type: Type.STRING },
          preventionTip: { type: Type.STRING }
        },
        required: ["nextPeak", "highNeedAreas", "wastePattern", "preventionTip"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const getRouteOptimizationInsight = async (pickup: string, dropoff: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Provide a 1-sentence AI Route Insight for Pickup: ${pickup}, Dropoff: ${dropoff}.`
  });
  return response.text;
};

export const getImpactInsights = async (totalKg: number, peopleServed: number) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Motivational community impact summary: ${totalKg}kg saved, ${peopleServed} served.`
  });
  return response.text;
};
