# Sistema de Comentários Simples

Um sistema de comentários responsivo e moderno que funciona tanto localmente quanto na nuvem.

## 🚀 Características

- ✨ Design moderno com gradiente e efeitos visuais
- 💾 Armazenamento local (localStorage) para backup
- 🌐 Integração com Netlify Functions para persistência na nuvem
- 📱 Totalmente responsivo
- 🔧 Painel de debug integrado
- ⚡ Funciona offline e online

## 🛠️ Tecnologias

- HTML5
- CSS3 (com backdrop-filter e gradientes)
- JavaScript (ES6+)
- Netlify Functions (para deploy em produção)

## 📦 Como usar

### Localmente
1. Abra o arquivo `comment_simples.html` em qualquer navegador
2. O sistema detectará automaticamente que está rodando localmente
3. Os comentários serão salvos no localStorage do navegador

### Deploy no Netlify
1. Faça o deploy deste repositório no Netlify
2. O sistema detectará automaticamente o ambiente de produção
3. Os comentários serão salvos tanto no localStorage quanto nas Netlify Functions

## 🎯 Demo

O projeto inclui:
- Formulário de comentários com validação
- Lista de comentários em tempo real
- Informações de debug
- Status de conexão e armazenamento

## 📧 Campos do Formulário

- **Nome**: Mínimo 2 caracteres
- **Email**: Formato válido de email
- **Comentário**: Mínimo 10 caracteres

## 🔧 Debug

O painel de debug mostra:
- URL atual
- Modo de operação (Local/Netlify)
- Base da API
- Informações do localStorage

---

Criado com ❤️ para demonstrar um sistema de comentários simples e eficiente.
