# Configuração de Banco de Dados + IA para o Netlify

## 🗄️ BANCO DE DADOS GLOBAL - Airtable (GRATUITO)

### Para que TODOS vejam os mesmos comentários:

### 1. Criar base no Airtable:
1. Vá para [airtable.com](https://airtable.com)
2. Crie conta gratuita
3. Clique em "Create a base"
4. Escolha "Start from scratch"
5. Nomeie como "Comments System"

### 2. Criar tabela:
1. Renomeie a tabela para "Comments"
2. Crie estes campos:
   - **Nome** (Single line text)
   - **Email** (Email)  
   - **Comentario** (Long text)
   - **Data** (Date & time)

### 3. Obter credenciais:
1. Clique no seu perfil (canto superior direito)
2. "Developer hub" → "Personal access tokens"
3. "Create new token"
4. Dê permissões: `data.records:read` e `data.records:write`
5. Copie o token

### 4. Base ID:
1. Vá para [airtable.com/api](https://airtable.com/api)
2. Selecione sua base "Comments System" 
3. Copie o Base ID (formato: app...)

### 5. Configurar no Netlify:
**Site Settings** → **Environment Variables** → **Add variable**
```
AIRTABLE_API_KEY = seu-token-aqui
AIRTABLE_BASE_ID = app...seu-base-id
```

## 🤖 IA - APIs GRATUITAS

### Google Gemini (RECOMENDADO - GRATUITO):
```
GEMINI_API_KEY = sua-chave-aqui
```
Obter em: https://makersuite.google.com/app/apikey

### OpenAI (Pago):
```
OPENAI_API_KEY = sk-sua-chave-aqui  
```
Obter em: https://platform.openai.com/api-keys

## ✅ Resultado Final:
- 🌐 **Comentários globais** - todos os usuários veem
- 💾 **Backup local** - funciona offline
- 🤖 **IA opcional** - moderação automática
- 📊 **Painel Airtable** - gerenciar comentários visualmente

## 🧪 Teste:
1. Configure as variáveis no Netlify
2. Refaça o deploy  
3. Adicione comentário em um dispositivo
4. Veja em outro dispositivo → deve aparecer!
