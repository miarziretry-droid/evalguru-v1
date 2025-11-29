import { GoogleGenAI, Type } from "@google/genai";
import { AssessmentScores } from "../types";

// Safely retrieve API Key to prevent "process is not defined" crash in browser
const getApiKey = () => {
  try {
    // Check if process exists before accessing it
    if (typeof process !== 'undefined' && process.env) {
      return process.env.API_KEY || '';
    }
    return '';
  } catch (e) {
    return '';
  }
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey });

// 1. Quick Summary using Flash (Low Latency)
// Note: Switched from Lite to Standard Flash to ensure model availability (Fixes 404)
export const generateQuickSummary = async (teacherName: string, scores: AssessmentScores): Promise<string> => {
  try {
    const prompt = `
      Buatkan ringkasan kinerja guru singkat (1 paragraf) untuk ${teacherName} berdasarkan skor berikut (Skala 1-100):
      - Pedagogik: ${scores.pedagogik}
      - Kepribadian: ${scores.kepribadian}
      - Sosial: ${scores.sosial}
      - Profesional: ${scores.profesional}
      
      Gunakan bahasa Indonesia yang formal dan konstruktif. Soroti kekuatan utama dan area yang perlu perbaikan segera.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', 
      contents: prompt,
    });

    return response.text || "Gagal menghasilkan ringkasan.";
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Terjadi kesalahan saat menghubungi layanan AI. Pastikan API Key sudah dipasang.";
  }
};

// 2. Deep Analysis using Thinking Mode (Gemini 3 Pro)
export const generateDeepAnalysis = async (teacherName: string, subject: string, scores: AssessmentScores): Promise<string> => {
  try {
    const prompt = `
      Lakukan analisis mendalam untuk guru bernama ${teacherName} yang mengajar mata pelajaran ${subject}.
      Data Skor Asesmen (Skala 0-100):
      - Kompetensi Pedagogik: ${scores.pedagogik}
      - Kompetensi Kepribadian: ${scores.kepribadian}
      - Kompetensi Sosial: ${scores.sosial}
      - Kompetensi Profesional: ${scores.profesional}

      Sebagai ahli konsultan pendidikan, berikan:
      1. Analisis pola kekuatan dan kelemahan yang mungkin tidak terlihat sekilas.
      2. Dampak potensial terhadap siswa.
      3. Rencana Pengembangan Keprofesian Berkelanjutan (PKB) yang spesifik (misal: workshop spesifik, mentoring, dll).
      4. Strategi jangka panjang untuk kepala sekolah dalam membina guru ini.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }, // Max thinking budget
      },
    });

    return response.text || "Gagal menghasilkan analisis mendalam.";
  } catch (error) {
    console.error("Error generating deep analysis:", error);
    return "Terjadi kesalahan saat melakukan analisis mendalam. Pastikan koneksi stabil dan API Key valid.";
  }
};

// 3. Search Grounding for Regulations
export const searchRegulations = async (query: string): Promise<{text: string, sources: any[]}> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Carikan informasi terbaru dan relevan mengenai: ${query}. Fokus pada regulasi pendidikan di Indonesia (Kemendikbud Ristek).`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "Tidak ada informasi ditemukan.";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { text, sources };
  } catch (error) {
    console.error("Error searching regulations:", error);
    return { text: "Gagal mencari informasi.", sources: [] };
  }
};

// 4. Chat Assistant
export const getChatResponse = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
    try {
        const chat = ai.chats.create({
            model: 'gemini-3-pro-preview',
            history: history,
            config: {
                systemInstruction: "Anda adalah asisten virtual ahli manajemen sekolah dan pedagogi. Bantu kepala sekolah dalam mengevaluasi guru, memahami standar pendidikan, dan memberikan saran manajerial."
            }
        });

        const result = await chat.sendMessage({ message });
        return result.text;
    } catch (error) {
        console.error("Chat error:", error);
        return "Maaf, saya sedang mengalami gangguan. Pastikan API Key Anda sudah benar.";
    }
}