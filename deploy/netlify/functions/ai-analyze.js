exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    if (event.httpMethod === 'POST') {
      const { text } = JSON.parse(event.body);
      
      if (!text) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Texto é obrigatório' })
        };
      }

      // 🤖 Análise com Google Gemini (GRATUITO)
      const analysis = await analyzeWithGemini(text);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          analysis
        })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Método não permitido' })
    };

  } catch (error) {
    console.error('Erro:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Erro interno',
        message: error.message 
      })
    };
  }
};

// 🤖 ANÁLISE COM GOOGLE GEMINI (GRATUITO)
async function analyzeWithGemini(text) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  if (!GEMINI_API_KEY) {
    console.warn('Gemini API key não configurada');
    return {
      shouldBlock: false,
      sentiment: 'neutral',
      confidence: 0,
      reason: 'IA não disponível',
      summary: text.substring(0, 100)
    };
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
    
    const prompt = `Analise este comentário e responda APENAS em JSON válido:
{
  "shouldBlock": boolean (true se spam/ofensivo),
  "sentiment": "positive" | "negative" | "neutral",
  "confidence": number (0-1),
  "reason": string | null,
  "summary": string (máximo 50 caracteres)
}

Comentário: "${text}"`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const aiText = data.candidates[0].content.parts[0].text;
    
    // Extrair JSON da resposta
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback se não conseguir parsear
    return {
      shouldBlock: false,
      sentiment: 'neutral',
      confidence: 0.7,
      reason: null,
      summary: text.substring(0, 50)
    };

  } catch (error) {
    console.error('Erro Gemini:', error);
    return {
      shouldBlock: false,
      sentiment: 'neutral', 
      confidence: 0,
      reason: 'Erro na análise',
      summary: text.substring(0, 50)
    };
  }
}
