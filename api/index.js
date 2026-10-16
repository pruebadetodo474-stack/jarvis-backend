import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Usa POST.' });
  }

  try {
    const { prompt, imageBase64 } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'El campo prompt es obligatorio.' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const contents = [prompt];
    if (imageBase64) {
      contents.push({
        inlineData: {
          data: imageBase64,
          mimeType: "image/jpeg"
        }
      });
    }

    // Modelos en fila
    const modelosIntentar = [
      'gemini-3.8-flash',
      'gemini-3.7-flash',
      'gemini-3.6-flash'
    ];

    let response = null;
    let errorUltimo = null;

    for (const modeloActual of modelosIntentar) {
      try {
        console.log(`Intentando conectar con: ${modeloActual}`);
        response = await ai.models.generateContent({
          model: modeloActual,
          contents: contents,
        });
        break; // Éxito
      } catch (err) {
        console.warn(`⚠️ Falló ${modeloActual}:`, err.message);
        errorUltimo = err;
        // Cambio ultrarrápido (solo 200ms de espera)
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    if (!response) {
      throw errorUltimo || new Error("Todos los modelos de Gemini fallaron.");
    }

    let textoLimpio = response.text;
    if (textoLimpio) {
      textoLimpio = textoLimpio
        .replace(/\*\*/g, '')  
        .replace(/\*/g, '')    
        .replace(/#/g, '')     
        .trim();               
    }

    return res.status(200).json({ text: textoLimpio });
    
  } catch (error) {
    console.error("Error crítico en Jarvis Backend:", error);
    return res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud en el servidor.' });
  }
}
