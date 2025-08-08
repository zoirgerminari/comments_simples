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
    // Para demonstração, vamos simular uma resposta de sucesso
    // Em produção, você conectaria a um banco de dados real
    
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

      // Simular salvamento (aqui você salvaria em um banco de dados)
      const savedComment = {
        id: Date.now(),
        ...comment,
        data: new Date().toISOString()
      };

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          comment: savedComment,
          message: 'Comentário salvo com sucesso!'
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
