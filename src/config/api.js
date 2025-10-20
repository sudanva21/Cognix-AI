// API Configuration
// COGNIX - AI Assistant powered by Kriszz
// This file contains the OpenRouter API configuration

// Use environment variable if available, otherwise fall back to hardcoded key
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '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'

// Validate API key
if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'your_api_key_here') {
  console.error('❌ OpenRouter API key is not configured!')
  console.error('Please set VITE_OPENROUTER_API_KEY in your .env file or Vercel environment variables')
  console.error('Get your API key from: https://openrouter.ai/keys')
}

export const API_CONFIG = {
  OPENROUTER_API_KEY,
  OPENROUTER_BASE_URL: 'https://openrouter.ai/api/v1/chat/completions',
  DEFAULT_MODEL: 'deepseek/deepseek-r1-0528-qwen3-8b:free'
}

export const AVAILABLE_MODELS = [
  { id: 'deepseek/deepseek-r1-0528-qwen3-8b:free', name: 'DeepSeek R1 (Free)', description: 'Advanced reasoning model - Free' },
  { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and efficient' },
  { id: 'openai/gpt-4', name: 'GPT-4', description: 'Most capable OpenAI model' },
  { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Faster GPT-4' },
  { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus', description: 'Most powerful Claude' },
  { id: 'anthropic/claude-3-sonnet', name: 'Claude 3 Sonnet', description: 'Balanced performance' },
  { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', description: 'Fast and affordable' },
  { id: 'google/gemini-pro', name: 'Gemini Pro', description: 'Google\'s advanced AI' },
  { id: 'meta-llama/llama-3-70b-instruct', name: 'Llama 3 70B', description: 'Open source powerhouse' },
  { id: 'mistralai/mixtral-8x7b-instruct', name: 'Mixtral 8x7B', description: 'Efficient mixture of experts' },
]
