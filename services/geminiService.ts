import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, RiskLevel, HistoryEntry } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    riskLevel: {
      type: Type.STRING,
      enum: Object.values(RiskLevel),
      description: "The assessed risk level. Must be one of: SAFE, LOW, MEDIUM, HIGH, CRITICAL."
    },
    summary: {
      type: Type.STRING,
      description: "A very brief, one-sentence summary of the finding."
    },
    analysis: {
      type: Type.STRING,
      description: "A detailed explanation of the reasoning behind the risk assessment, pointing out specific red flags or positive indicators found in the text."
    },
    recommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING
      },
      description: "A list of actionable steps or advice for the user based on the findings."
    }
  },
  required: ['riskLevel', 'summary', 'analysis', 'recommendations']
};

export const analyzeTextForScam = async (text: string, history: HistoryEntry[]): Promise<AnalysisResult> => {
  try {
    const highRiskHistory = history
      .filter(entry => entry.riskLevel === RiskLevel.HIGH || entry.riskLevel === RiskLevel.CRITICAL)
      .slice(0, 3);

    let historyContext = "";
    if (highRiskHistory.length > 0) {
      historyContext = "\n\nเพื่อเพิ่มความแม่นยำในการวิเคราะห์ โปรดพิจารณาตัวอย่างการหลอกลวงที่ตรวจพบล่าสุดเหล่านี้:\n" +
        highRiskHistory.map((entry, index) =>
          `${index + 1}. ข้อความ: "${entry.inputText}"\n   ผลลัพธ์: ${entry.riskLevel} - ${entry.summary}`
        ).join("\n");
    }

    const systemInstruction = "You are 'Protect Robot MaiCa', an AI expert specializing in identifying scams from text, emails, links, and usernames. Your analysis must be thorough and clear. Always respond in the Thai language. Provide a risk assessment, explain your reasoning, and give actionable recommendations based on your analysis. Consider any provided recent scam examples to enhance your analysis.";

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `กรุณาวิเคราะห์ข้อความต่อไปนี้เพื่อหาสัญญาณการหลอกลวง, ฟิชชิ่ง, หรือกิจกรรมฉ้อโกง และตอบกลับเป็นภาษาไทย: "${text}"${historyContext}`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const jsonString = response.text;
    const parsedResult = JSON.parse(jsonString);

    // Validate if the parsed riskLevel is a valid enum member
    if (!Object.values(RiskLevel).includes(parsedResult.riskLevel as RiskLevel)) {
        console.warn(`Invalid risk level received: ${parsedResult.riskLevel}. Defaulting to MEDIUM.`);
        parsedResult.riskLevel = RiskLevel.MEDIUM;
    }
    
    return parsedResult as AnalysisResult;
  } catch (error) {
    console.error("Error analyzing text with Gemini API:", error);
    throw new Error("Failed to get analysis from AI. Please try again.");
  }
};
