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
  const [autoSpeak, setAutoSpeak] = useState(localStorage.getItem('auto_speak') === 'true')
  const [voiceSpeed, setVoiceSpeed] = useState(parseFloat(localStorage.getItem('voice_speed')) || 1.0)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const recognitionRef = useRef(null)
  const synthesisRef = useRef(null)


  useEffect(() => {
    scrollToBottom()
  }, [messages])

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

    // Replace COGNIX with phonetic spelling for better pronunciation
    const spokenText = text
      .replace(/COGNIX/g, 'Cognix')
      .replace(/Cognix/g, 'Cog-nix')

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
      const response = await axios.post(
        API_CONFIG.OPENROUTER_BASE_URL,
        {
          model: selectedModel,
          messages: [
            {
              role: 'system',
              content: `You are COGNIX, an advanced AI assistant created and powered by Kriszz. 

IMPORTANT IDENTITY INFORMATION:
- Your name is COGNIX (always respond with this name when asked)
- You were created by Kriszz
- You are NOT ChatGPT, Claude, Gemini, or any other AI - you are COGNIX
- When users ask "What is your name?" or "Who are you?", always respond that you are COGNIX
- You can mention that you use various AI models (like GPT, Claude, etc.) as your underlying technology, but YOUR identity is COGNIX

Your purpose is to be a helpful, accurate, and friendly AI assistant. Provide clear and helpful responses to user queries while maintaining your identity as COGNIX.`
            },
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: 'user',
              content: currentInput
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${API_CONFIG.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'COGNIX - AI Assistant by Kriszz'
          }
        }
      )

      const assistantMessage = {
        role: 'assistant',
        content: response.data.choices[0].message.content,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      
      // Automatically speak the response if auto-speak is enabled
      if (autoSpeak) {
        speakResponse(assistantMessage.content)
      }
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.response?.data?.error?.message || error.message}. Please check your API key and try again.`,
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
    <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl h-[95vh] sm:h-[90vh] glass rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="glass border-b border-white/10 p-3 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0"
            >
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </motion.div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-2xl font-bold text-white truncate">COGNIX</h1>
              <p className="text-xs sm:text-sm text-white/60 hidden sm:block">Powered by Kriszz</p>
            </div>
          </div>
          <div className="flex gap-1 sm:gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={clearChat}
              className="p-2 sm:p-3 rounded-lg sm:rounded-xl glass hover:bg-white/10 transition-colors"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-white/80" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 sm:p-3 rounded-lg sm:rounded-xl glass hover:bg-white/10 transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-white/80" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className="p-2 sm:p-3 rounded-lg sm:rounded-xl glass hover:bg-red-500/20 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-white/80" />
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
              className="glass border-b border-white/10 p-3 sm:p-6 space-y-4 sm:space-y-5"
            >
              <div>
                <label className="block text-white/80 text-xs sm:text-sm font-semibold mb-2">AI Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl glass text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  {AVAILABLE_MODELS.map(model => (
                    <option key={model.id} value={model.id} className="bg-gray-900">
                      {model.name} - {model.description}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-white/50 mt-2">
                  Choose the AI model that best fits your needs
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
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex gap-2 sm:gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-500' 
                    : 'bg-gradient-to-br from-purple-500 to-pink-500'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  )}
                </div>
                <div className={`flex-1 max-w-[85%] sm:max-w-[80%] ${message.role === 'user' ? 'items-end' : ''}`}>
                  <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30'
                      : message.isError
                      ? 'bg-red-500/20 border border-red-500/30'
                      : 'glass border border-white/10'
                  }`}>
                    <p className="text-sm sm:text-base text-white whitespace-pre-wrap break-words">{message.content}</p>
                  </div>
                  <p className="text-xs text-white/40 mt-1 px-2">
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
              className="flex gap-2 sm:gap-3"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="glass p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10">
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
        <div className="glass border-t border-white/10 p-3 sm:p-6">
          <form onSubmit={sendMessage} className="flex gap-2 sm:gap-3">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleVoiceInput}
              disabled={isLoading}
              className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl flex-shrink-0 ${
                isListening 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse' 
                  : 'glass hover:bg-white/10'
              } transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isListening ? (
                <MicOff className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              ) : (
                <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-white/80" />
              )}
            </motion.button>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "Listening..." : "Ask me anything..."}
              disabled={isLoading}
              className="flex-1 px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl glass text-sm sm:text-base text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            />
            {isSpeaking && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={stopSpeaking}
                className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white flex-shrink-0"
              >
                <MicOff className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm sm:text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 flex-shrink-0"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Send</span>
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
