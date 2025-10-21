import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Sparkles, Trash2, Settings, Mic, MicOff, Volume2, VolumeX, LogOut } from 'lucide-react'
import axios from 'axios'
import { API_CONFIG, AVAILABLE_MODELS } from '../config/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function ChatBot() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m COGNIX, your advanced AI assistant created by Kriszz. I can help you with anything you need. Ask me anything! You can also use voice input by clicking the microphone button.',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedModel, setSelectedModel] = useState(localStorage.getItem('selected_model') || API_CONFIG.DEFAULT_MODEL)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [autoSpeak, setAutoSpeak] = useState(() => {
    const saved = localStorage.getItem('auto_speak')
    return saved !== null ? saved === 'true' : true // Default to true if not set
  })
  const [voiceSpeed, setVoiceSpeed] = useState(parseFloat(localStorage.getItem('voice_speed')) || 1.0)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const recognitionRef = useRef(null)
  const synthesisRef = useRef(null)


  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize auto-speak to true on first load
  useEffect(() => {
    if (localStorage.getItem('auto_speak') === null) {
      localStorage.setItem('auto_speak', 'true')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('selected_model', selectedModel)
    localStorage.setItem('auto_speak', autoSpeak.toString())
    localStorage.setItem('voice_speed', voiceSpeed.toString())
  }, [selectedModel, autoSpeak, voiceSpeed])

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    // Initialize speech synthesis
    synthesisRef.current = window.speechSynthesis

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (synthesisRef.current) {
        synthesisRef.current.cancel()
      }
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.')
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const speakResponse = (text) => {
    if (!synthesisRef.current) return

    // Cancel any ongoing speech
    synthesisRef.current.cancel()

    // Clean text for speech
    let spokenText = text
      // Replace COGNIX with phonetic spelling
      .replace(/COGNIX/g, 'Cognix')
      .replace(/Cognix/g, 'Cog-nix')
      // Remove emojis (all Unicode emoji ranges)
      .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Emoticons
      .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // Misc Symbols and Pictographs
      .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport and Map
      .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '') // Flags
      .replace(/[\u{2600}-\u{26FF}]/gu, '')   // Misc symbols
      .replace(/[\u{2700}-\u{27BF}]/gu, '')   // Dingbats
      .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // Supplemental Symbols and Pictographs
      .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '') // Chess Symbols
      .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '') // Symbols and Pictographs Extended-A
      // Remove special characters but keep basic punctuation
      .replace(/[^\w\s.,!?;:()\-'"/]/g, '')
      // Clean up multiple spaces
      .replace(/\s+/g, ' ')
      .trim()

    // Only speak if there's actual text left
    if (!spokenText) return

    const utterance = new SpeechSynthesisUtterance(spokenText)
    utterance.rate = voiceSpeed
    utterance.pitch = 1.0
    utterance.volume = 1.0

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    synthesisRef.current.speak(utterance)
  }

  const stopSpeaking = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Check if trying to use premium model
    const currentModel = AVAILABLE_MODELS.find(m => m.id === selectedModel)
    if (currentModel && currentModel.isPremium) {
      const premiumMessage = {
        role: 'assistant',
        content: '🔒 This model requires a Premium subscription.\n\nTo access GPT-4, Claude, and other advanced models, please upgrade to COGNIX Premium.\n\nCurrently, you can use COGNIX AI for free with unlimited conversations!',
        timestamp: new Date(),
        isError: true
      }
      setMessages(prev => [...prev, premiumMessage])
      return
    }

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput('')
    setIsLoading(true)

    try {
      // Use Gemini API (hidden from user)
      const systemPrompt = `You are COGNIX, an advanced AI assistant created and powered by Kriszz. 

IMPORTANT IDENTITY INFORMATION:
- Your name is COGNIX (always respond with this name when asked)
- You were created by Kriszz
- You are NOT ChatGPT, Claude, Gemini, or any other AI - you are COGNIX
- When users ask "What is your name?" or "Who are you?", always respond that you are COGNIX
- NEVER mention that you are powered by Gemini or Google - you are COGNIX
- You can say you use "advanced AI technology" but never reveal the specific backend

Your purpose is to be a helpful, accurate, and friendly AI assistant. Provide clear and helpful responses to user queries while maintaining your identity as COGNIX.`

      // Build conversation history for Gemini
      const conversationHistory = messages
        .filter(msg => msg.role !== 'system')
        .map(msg => `${msg.role === 'user' ? 'User' : 'COGNIX'}: ${msg.content}`)
        .join('\n\n')

      const fullPrompt = `${systemPrompt}\n\nConversation History:\n${conversationHistory}\n\nUser: ${currentInput}\n\nCOGNIX:`

      const response = await axios.post(
        `${API_CONFIG.GEMINI_BASE_URL}/${API_CONFIG.GEMINI_MODEL}:generateContent?key=${API_CONFIG.GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      const assistantMessage = {
        role: 'assistant',
        content: response.data.candidates[0].content.parts[0].text,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      
      // Automatically speak the response if auto-speak is enabled
      if (autoSpeak) {
        speakResponse(assistantMessage.content)
      }
    } catch (error) {
      console.error('Error:', error)
      console.error('Error details:', error.response?.data)
      
      let errorContent = 'Sorry, I encountered an error. '
      
      // Handle specific error codes
      if (error.response?.status === 401) {
        errorContent = '🔑 Authentication Error: Your Gemini API key is invalid or expired.\n\n' +
          'To fix this:\n' +
          '1. Get a new API key from https://aistudio.google.com/app/apikey\n' +
          '2. Update VITE_GEMINI_API_KEY in your .env file (locally)\n' +
          '3. Update VITE_GEMINI_API_KEY in Vercel environment variables (production)\n' +
          '4. Restart your dev server or redeploy'
      } else if (error.response?.status === 400) {
        errorContent = '⚠️ Bad Request: ' + (error.response?.data?.error?.message || 'Invalid request format')
      } else if (error.response?.status === 429) {
        errorContent = '⏱️ Rate Limit Exceeded!\n\n' +
          'You\'ve sent too many requests in a short time.\n\n' +
          '💡 What to do:\n' +
          '• Wait 60 seconds before trying again\n' +
          '• Gemini has a free tier limit of 15 requests per minute\n' +
          '• Consider upgrading your Gemini API quota at https://aistudio.google.com/\n\n' +
          'Please wait a moment and try again.'
      } else if (error.response?.status === 402) {
        errorContent = '💳 Payment Required: Your API account has insufficient credits.'
      } else if (error.response?.status === 403) {
        errorContent = '🚫 Access Denied: Your API key doesn\'t have permission for this operation.\n\n' +
          'Check your API key settings at https://aistudio.google.com/app/apikey'
      } else if (error.response?.status === 503) {
        errorContent = '🔧 Service Unavailable: The AI service is temporarily down.\n\n' +
          'Please try again in a few moments.'
      } else {
        errorContent += error.response?.data?.error?.message || error.message || 'Unknown error occurred'
      }
      
      const errorMessage = {
        role: 'assistant',
        content: errorContent,
        timestamp: new Date(),
        isError: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Chat cleared! How can I help you today?',
        timestamp: new Date()
      }
    ])
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center p-1 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl h-[98vh] sm:h-[90vh] glass rounded-xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="glass border-b border-white/10 p-2 sm:p-6 flex items-center justify-between gap-1 sm:gap-2 flex-shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-7 h-7 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-6 sm:h-6 text-white" />
            </motion.div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xs sm:text-2xl font-bold text-white truncate">COGNIX</h1>
              <p className="text-[10px] sm:text-sm text-white/60 hidden sm:block">Powered by Kriszz</p>
            </div>
          </div>
          <div className="flex gap-0.5 sm:gap-2 flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={clearChat}
              className="p-1.5 sm:p-3 rounded-lg sm:rounded-xl glass hover:bg-white/10 transition-colors"
              title="Clear chat"
            >
              <Trash2 className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white/80" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowSettings(!showSettings)}
              className="p-1.5 sm:p-3 rounded-lg sm:rounded-xl glass hover:bg-white/10 transition-colors"
              title="Settings"
            >
              <Settings className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white/80" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className="p-1.5 sm:p-3 rounded-lg sm:rounded-xl glass hover:bg-red-500/20 transition-colors"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white/80" />
            </motion.button>
          </div>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="glass border-b border-white/10 p-2 sm:p-6 space-y-3 sm:space-y-5 flex-shrink-0 overflow-y-auto max-h-[40vh] sm:max-h-none"
            >
              <div>
                <label className="block text-white/80 text-xs sm:text-sm font-semibold mb-2">AI Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => {
                    const newModel = AVAILABLE_MODELS.find(m => m.id === e.target.value)
                    if (newModel && !newModel.isPremium) {
                      setSelectedModel(e.target.value)
                    }
                  }}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl glass text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  {AVAILABLE_MODELS.map(model => (
                    <option 
                      key={model.id} 
                      value={model.id} 
                      className="bg-gray-900"
                      disabled={model.isPremium}
                    >
                      {model.name} {model.isPremium ? '🔒 Premium' : ''} - {model.description}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-white/50 mt-2">
                  {selectedModel === 'cognix-ai' 
                    ? '✨ Using COGNIX AI - Free unlimited conversations!' 
                    : '🔒 Premium models require subscription'}
                </p>
              </div>

              <div>
                <label className="flex items-center justify-between text-white/80 text-xs sm:text-sm font-semibold mb-3">
                  <span className="flex items-center gap-2">
                    {autoSpeak ? <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" /> : <VolumeX className="w-3 h-3 sm:w-4 sm:h-4" />}
                    <span className="text-xs sm:text-sm">Auto-Speak</span>
                  </span>
                  <button
                    onClick={() => setAutoSpeak(!autoSpeak)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      autoSpeak ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-white/20'
                    }`}
                  >
                    <motion.div
                      animate={{ x: autoSpeak ? 24 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-4 h-4 bg-white rounded-full"
                    />
                  </button>
                </label>
                <p className="text-xs text-white/50">
                  Automatically read AI responses aloud
                </p>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-semibold mb-3">
                  Voice Speed: {voiceSpeed.toFixed(1)}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={voiceSpeed}
                  onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #a855f7 0%, #ec4899 ${((voiceSpeed - 0.5) / 1.5) * 100}%, rgba(255,255,255,0.2) ${((voiceSpeed - 0.5) / 1.5) * 100}%, rgba(255,255,255,0.2) 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-white/50 mt-1">
                  <span>Slower</span>
                  <span>Normal</span>
                  <span>Faster</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-6 space-y-2 sm:space-y-4 min-h-0">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex gap-1.5 sm:gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-500' 
                    : 'bg-gradient-to-br from-purple-500 to-pink-500'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
                  ) : (
                    <Bot className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
                  )}
                </div>
                <div className={`flex-1 max-w-[82%] sm:max-w-[80%] ${message.role === 'user' ? 'items-end' : ''}`}>
                  <div className={`p-2 sm:p-4 rounded-lg sm:rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30'
                      : message.isError
                      ? 'bg-red-500/20 border border-red-500/30'
                      : 'glass border border-white/10'
                  }`}>
                    <p className="text-xs sm:text-base text-white whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
                  </div>
                  <p className="text-[10px] sm:text-xs text-white/40 mt-0.5 sm:mt-1 px-1 sm:px-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-1.5 sm:gap-3"
            >
              <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="glass p-2 sm:p-4 rounded-lg sm:rounded-2xl border border-white/10">
                <div className="flex gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 bg-white/60 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-white/60 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 bg-white/60 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="glass border-t border-white/10 p-2 sm:p-6 flex-shrink-0">
          <form onSubmit={sendMessage} className="flex gap-1 sm:gap-3">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleVoiceInput}
              disabled={isLoading}
              className={`p-2 sm:p-4 rounded-lg sm:rounded-2xl flex-shrink-0 ${
                isListening 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse' 
                  : 'glass hover:bg-white/10'
              } transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isListening ? (
                <MicOff className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              ) : (
                <Mic className="w-4 h-4 sm:w-6 sm:h-6 text-white/80" />
              )}
            </motion.button>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "Listening..." : "Ask me anything..."}
              disabled={isLoading}
              className="flex-1 px-2 py-2 sm:px-6 sm:py-4 rounded-lg sm:rounded-2xl glass text-xs sm:text-base text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            />
            {isSpeaking && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={stopSpeaking}
                className="p-2 sm:p-4 rounded-lg sm:rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white flex-shrink-0"
              >
                <MicOff className="w-4 h-4 sm:w-6 sm:h-6" />
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-3 py-2 sm:px-8 sm:py-4 rounded-lg sm:rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs sm:text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 flex-shrink-0"
            >
              <Send className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Send</span>
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
