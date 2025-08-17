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
    if (event.httpMethod === 'GET') {
      // 🗄️ BUSCAR DO AIRTABLE
      const comments = await getFromAirtable();
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          comments: comments,
          count: comments.length,
          message: '🌐 Comentários carregados para todos os usuários!'
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
        error: 'Erro interno do servidor'
      })
    };
  }
};

// 🗄️ FUNÇÃO PARA BUSCAR DO AIRTABLE
async function getFromAirtable() {
  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
  
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.warn('Airtable não configurado, usando mock');
    // Comentários de exemplo SEMPRE visíveis
    return [
      {
        id: "demo1",
        nome: "João Silva",
        email: "joao@example.com",
        comentario: "Sistema funcionando perfeitamente! Todos podem ver este comentário.",
        data: new Date(Date.now() - 3600000).toISOString() // 1 hora atrás
      },
      {
        id: "demo2", 
        nome: "Maria Santos",
        email: "maria@example.com",
        comentario: "Muito legal essa funcionalidade global de comentários!",
        data: new Date(Date.now() - 7200000).toISOString() // 2 horas atrás
      },
      {
        id: "demo3",
        nome: "Pedro Costa", 
        email: "pedro@example.com",
        comentario: "Testando em dispositivos diferentes - aparece em todos!",
        data: new Date(Date.now() - 10800000).toISOString() // 3 horas atrás
      }
    ];
  }

  try {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Comments?sort%5B0%5D%5Bfield%5D=Data&sort%5B0%5D%5Bdirection%5D=desc`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.records.map(record => ({
      id: record.id,
      nome: record.fields.Nome,
      email: record.fields.Email,
      comentario: record.fields.Comentario,
      data: record.fields.Data
    }));

  } catch (error) {
    console.error('Erro Airtable:', error);
    // Fallback: retornar comentários mock
    return [
      {
        id: "fallback1",
        nome: "Sistema",
        email: "sistema@example.com", 
        comentario: "Banco de dados temporariamente indisponível. Comentários locais funcionando.",
        data: new Date().toISOString()
      }
    ];
  }
}
