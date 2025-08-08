# Configuração de APIs de IA para o Netlify

## Como configurar as variáveis de ambiente no Netlify:

### 1. Vá para o seu site no Netlify Dashboard
### 2. Site Settings → Environment Variables
### 3. Adicione uma das opções abaixo:

## OPÇÃO 1: OpenAI (Pago, mas muito bom)
# OPENAI_API_KEY=sk-your-api-key-here
# Crie em: https://platform.openai.com/api-keys
# Custo: ~$0.002 por 1k tokens

## OPÇÃO 2: Google Gemini (GRATUITO até 60 req/min)
# GEMINI_API_KEY=your-gemini-api-key
# Crie em: https://makersuite.google.com/app/apikey
# Totalmente gratuito para uso moderado

## OPÇÃO 3: Hugging Face (GRATUITO)
# HUGGINGFACE_API_KEY=hf_your-token
# Crie em: https://huggingface.co/settings/tokens

## Como obter as chaves:

### Google Gemini (RECOMENDADO - GRATUITO):
1. Vá para https://makersuite.google.com/
2. Clique em "Get API Key"
3. Crie um novo projeto ou use existente
4. Copie a API key
5. No Netlify: GEMINI_API_KEY = sua-chave-aqui

### OpenAI:
1. Vá para https://platform.openai.com/
2. Crie uma conta e adicione método de pagamento
3. Vá para API Keys
4. Crie uma nova chave
5. No Netlify: OPENAI_API_KEY = sk-sua-chave-aqui

## Teste local:
# Crie um arquivo .env na raiz do projeto:
# GEMINI_API_KEY=sua-chave-aqui
# (Este arquivo não deve ser commitado no Git!)
