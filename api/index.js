import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Usa POST.' });
  }

  try {
    const { prompt, imageBase64 } = req.body;
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-pro',
      contents: [
        prompt,
        {
          inlineData: {
            data: imageBase64,
            mimeType: "image/jpeg"
          }
        }
      ]
    });

    return res.status(200).json({ text: response.text });
    
  } catch (error) {
    console.error("Error en Jarvis Backend:", error);
    return res.status(500).json({ error: 'Ocurrió un error al procesar la imagen en el servidor.' });
  }
}
