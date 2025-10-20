// API Configuration
// COGNIX - AI Assistant powered by Kriszz
// This file contains the API configuration

// Gemini API (Primary - Free for users)
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDWlF3YYm3bdbpluXJf9nqzkyt83UAy80s'

// OpenRouter API (Premium models - Subscription required)
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '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'

// Validate Gemini API key
if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_api_key_here') {
  console.error('❌ Gemini API key is not configured!')
  console.error('Please set VITE_GEMINI_API_KEY in your .env file or Vercel environment variables')
}

export const API_CONFIG = {
  GEMINI_API_KEY,
  GEMINI_MODEL: 'gemini-2.5-flash-lite',
  GEMINI_BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models',
  OPENROUTER_API_KEY,
  OPENROUTER_BASE_URL: 'https://openrouter.ai/api/v1/chat/completions',
  DEFAULT_MODEL: 'cognix-ai' // COGNIX AI (powered by Gemini)
}

export const AVAILABLE_MODELS = [
  { 
    id: 'cognix-ai', 
    name: 'COGNIX AI', 
    description: 'Your intelligent AI assistant',
    isPremium: false,
    isDefault: true
  },
  { 
    id: 'openai/gpt-3.5-turbo', 
    name: 'GPT-3.5 Turbo', 
    description: 'Fast and efficient',
    isPremium: true
  },
  { 
    id: 'openai/gpt-4', 
    name: 'GPT-4', 
    description: 'Most capable OpenAI model',
    isPremium: true
  },
  { 
    id: 'openai/gpt-4-turbo', 
    name: 'GPT-4 Turbo', 
    description: 'Faster GPT-4',
    isPremium: true
  },
  { 
    id: 'anthropic/claude-3-opus', 
    name: 'Claude 3 Opus', 
    description: 'Most powerful Claude',
    isPremium: true
  },
  { 
    id: 'anthropic/claude-3-sonnet', 
    name: 'Claude 3 Sonnet', 
    description: 'Balanced performance',
    isPremium: true
  },
  { 
    id: 'anthropic/claude-3-haiku', 
    name: 'Claude 3 Haiku', 
    description: 'Fast and affordable',
    isPremium: true
  },
  { 
    id: 'google/gemini-pro', 
    name: 'Gemini Pro', 
    description: 'Google\'s advanced AI',
    isPremium: true
  },
  { 
    id: 'meta-llama/llama-3-70b-instruct', 
    name: 'Llama 3 70B', 
    description: 'Open source powerhouse',
    isPremium: true
  },
  { 
    id: 'mistralai/mixtral-8x7b-instruct', 
    name: 'Mixtral 8x7B', 
    description: 'Efficient mixture of experts',
    isPremium: true
  },
]
