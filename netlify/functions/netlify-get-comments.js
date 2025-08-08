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
      // Para demonstração, retornar comentários mockados
      // Em produção, você buscaria de um banco de dados real
      
      const mockComments = [
        {
          id: 1,
          nome: "João Silva",
          email: "joao@example.com",
          comentario: "Ótimo sistema de comentários! Muito bem feito.",
          data: new Date(Date.now() - 86400000).toISOString() // 1 dia atrás
        },
        {
          id: 2,
          nome: "Maria Santos",
          email: "maria@example.com", 
          comentario: "Interface muito clean e responsiva. Parabéns!",
          data: new Date(Date.now() - 172800000).toISOString() // 2 dias atrás
        }
      ];

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          comments: mockComments,
          count: mockComments.length
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
