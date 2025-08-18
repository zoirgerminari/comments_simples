import { neon } from '@neondatabase/serverless';

export default async (request, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers
    });
  }

  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    
    // Buscar últimos 50 comentários ordenados por data
    const comments = await sql`
      SELECT id, name, comment, created_at 
      FROM comments 
      ORDER BY created_at DESC 
      LIMIT 50
    `;
    
    // Formatar as datas para o frontend
    const formattedComments = comments.map(comment => ({
      id: comment.id,
      name: comment.name,
      comment: comment.comment,
      created_at: comment.created_at,
      date: new Date(comment.created_at).toLocaleString('pt-BR')
    }));
    
    return new Response(JSON.stringify({
      success: true,
      comments: formattedComments,
      total: comments.length
    }), {
      status: 200,
      headers
    });
    
  } catch (error) {
    console.error('Erro ao buscar comentários:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor',
      details: error.message 
    }), {
      status: 500,
      headers
    });
  }
};
