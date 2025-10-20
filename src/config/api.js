// API Configuration
// COGNIX - AI Assistant powered by Kriszz
// This file contains the OpenRouter API configuration

export const API_CONFIG = {
  OPENROUTER_API_KEY: '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',
  OPENROUTER_BASE_URL: 'https://openrouter.ai/api/v1/chat/completions',
  DEFAULT_MODEL: 'openai/gpt-3.5-turbo'
}

export const AVAILABLE_MODELS = [
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
