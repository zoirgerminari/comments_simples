import { neon } from '@neondatabase/serverless';

export default async (request, context) => {
  // CORS headers para permitir requisições do frontend
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers
    });
  }

  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    const body = await request.json();
    
    const { name, comment } = body;
    
    // Validação básica
    if (!name || !comment) {
      return new Response(JSON.stringify({ error: 'Nome e comentário são obrigatórios' }), {
        status: 400,
        headers
      });
    }
    
    if (name.length < 2 || name.length > 100) {
      return new Response(JSON.stringify({ error: 'Nome deve ter entre 2 e 100 caracteres' }), {
        status: 400,
        headers
      });
    }
    
    if (comment.length < 5 || comment.length > 1000) {
      return new Response(JSON.stringify({ error: 'Comentário deve ter entre 5 e 1000 caracteres' }), {
        status: 400,
        headers
      });
    }
    
    // Obter IP e User-Agent para anti-spam básico
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Inserir comentário no banco
    const [newComment] = await sql`
      INSERT INTO comments (name, comment, ip_address, user_agent)
      VALUES (${name}, ${comment}, ${ip}, ${userAgent})
      RETURNING id, name, comment, created_at
    `;
    
    return new Response(JSON.stringify({
      success: true,
      comment: {
        id: newComment.id,
        name: newComment.name,
        comment: newComment.comment,
        created_at: newComment.created_at
      }
    }), {
      status: 201,
      headers
    });
    
  } catch (error) {
    console.error('Erro ao adicionar comentário:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor',
      details: error.message 
    }), {
      status: 500,
      headers
    });
  }
};
