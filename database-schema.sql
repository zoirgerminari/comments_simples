-- Schema SQL para criar a tabela de comentários no Neon
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT
);

-- Índices para performance
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX idx_comments_name ON comments(name);

-- Comentários de exemplo
INSERT INTO comments (name, comment) VALUES 
('Sistema', 'Banco de dados Neon funcionando! 🎉'),
('João Silva', 'Primeira pessoa a comentar no novo sistema!'),
('Maria Santos', 'Muito legal, agora os comentários ficam salvos de verdade.');
