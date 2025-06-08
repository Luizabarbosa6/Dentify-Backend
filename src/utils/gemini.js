const axios = require('axios');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Gera texto usando a API do Gemini com base em um prompt
 * @param {string} prompt - Texto do prompt a ser enviado
 * @returns {Promise<string>} - Texto gerado pelo Gemini
 */
async function gerarTextoRelatorio(prompt) {
  try {
    const response = await axios.post(GEMINI_URL, {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const generatedText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('Texto não gerado pela API');
    }

    return generatedText;
  } catch (error) {
    console.error('Erro ao chamar Gemini:', error.response?.data || error.message);
    throw new Error('Erro ao gerar texto com Gemini');
  }
}

module.exports = { gerarTextoRelatorio };
