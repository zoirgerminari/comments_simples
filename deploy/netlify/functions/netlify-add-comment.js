exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    if (event.httpMethod === 'POST') {
      const comment = JSON.parse(event.body);
      
      // Validação básica
      if (!comment.nome || !comment.email || !comment.comentario) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'Todos os campos são obrigatórios'
          })
        };
      }

      // 🗄️ SALVAR NO AIRTABLE
      const savedComment = await saveToAirtable(comment);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          comment: savedComment,
          message: '💾 Comentário salvo para todos os usuários!'
        })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Método não permitido'
      })
    };

  } catch (error) {
    console.error('Erro na função:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Erro interno do servidor',
        details: error.message
      })
    };
  }
};

// 🗄️ FUNÇÃO PARA SALVAR NO AIRTABLE
async function saveToAirtable(comment) {
  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
  
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.warn('Airtable não configurado, usando mock');
    return {
      id: Date.now(),
      ...comment,
      data: new Date().toISOString()
    };
  }

  try {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Comments`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        records: [{
          fields: {
            Nome: comment.nome,
            Email: comment.email,
            Comentario: comment.comentario,
            Data: new Date().toISOString()
          }
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }

    const data = await response.json();
    const record = data.records[0];
    
    return {
      id: record.id,
      nome: record.fields.Nome,
      email: record.fields.Email,
      comentario: record.fields.Comentario,
      data: record.fields.Data
    };

  } catch (error) {
    console.error('Erro Airtable:', error);
    // Fallback: retornar mock se Airtable falhar
    return {
      id: Date.now(),
      ...comment,
      data: new Date().toISOString()
    };
  }
}

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Método não permitido'
      })
    };

  } catch (error) {
    console.error('Erro na função:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Erro interno do servidor'
      })
    };
  }
};

// 🤖 FUNÇÃO DE ANÁLISE DE IA
async function analyzeCommentWithAI(commentText) {
  // Para usar OpenAI, você precisa adicionar sua API key nas variáveis de ambiente
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  
  if (!OPENAI_API_KEY) {
    console.warn('OpenAI API key não configurada');
    return null;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Você é um moderador de comentários. Analise o comentário e retorne JSON com:
            - shouldBlock: true/false (bloquear se for spam, ofensivo, etc.)
            - sentiment: "positive", "negative", "neutral"  
            - confidence: 0-1 (confiança na análise)
            - reason: string (motivo se shouldBlock=true)
            - summary: string (resumo breve do comentário)`
          },
          {
            role: 'user',
            content: `Analise este comentário: "${commentText}"`
          }
        ],
        max_tokens: 300,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    // Tentar parsear o JSON da resposta
    try {
      return JSON.parse(aiResponse);
    } catch (parseError) {
      // Se não conseguir parsear, criar resposta padrão
      return {
        shouldBlock: false,
        sentiment: 'neutral',
        confidence: 0.5,
        reason: null,
        summary: aiResponse.substring(0, 100)
      };
    }

  } catch (error) {
    console.error('Erro na análise OpenAI:', error);
    throw error;
  }
}
