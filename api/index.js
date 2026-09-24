import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  // 1. Validar método HTTP
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Usa POST.' });
  }

  try {
    const { prompt, imageBase64 } = req.body;

    // Verificar que vengan los datos requeridos
    if (!prompt) {
      return res.status(400).json({ error: 'El campo prompt es obligatorio.' });
    }

    // 2. Inicializar el SDK oficial con tu API Key de las variables de entorno
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Definir los contenidos a enviar al modelo
    const contents = [prompt];

    // 3. Si mandas una imagen, estructurarla correctamente para el SDK
    if (imageBase64) {
      contents.push({
        inlineData: {
          data: imageBase64,
          mimeType: "image/jpeg"
        }
      });
    }

    // 4. Llamar al modelo correcto usando la sintaxis del SDK GenAI
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: contents,
    });

    // 5. Retornar el texto generado por la IA
    return res.status(200).json({ text: response.text });
    
  } catch (error) {
    console.error("Error en Jarvis Backend:", error);
    return res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud en el servidor.' });
  }
}
    });

    return res.status(200).json({ text: response.text });
    
  } catch (error) {
    console.error("Error en Jarvis Backend:", error);
    return res.status(500).json({ error: 'Ocurrió un error al procesar la imagen en el servidor.' });
  }
}
