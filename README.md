# 🤖 COGNIX - AI Assistant

A stunning AI-powered chatbot with an interactive 3D background and secure authentication, built with React, Three.js, Supabase, and OpenRouter API. COGNIX provides responses similar to ChatGPT, Gemini, and Claude.

**Powered by Kriszz**

## 🔐 Authentication

COGNIX features a complete authentication system powered by Supabase:
- **User Registration** with email verification
- **Secure Login** with password authentication
- **Protected Routes** - Chat interface only accessible to authenticated users
- **Session Management** with automatic token refresh
- **Logout Functionality** with secure session cleanup

## ✨ Features

- 🎨 **Interactive 3D Background with Mouse Effects** 
  - Animated spheres that follow your mouse cursor
  - Particles that react and move away from mouse position
  - Dynamic lighting that tracks cursor movement
  - Floating torus with mouse-responsive rotation
  - Smooth easing and scaling effects
  
- 🎤 **Voice Chat Capabilities**
  - Speech-to-text input with microphone button
  - Text-to-speech for AI responses
  - Visual feedback when listening or speaking
  - Stop speaking button for control
  
- 💬 **Advanced Chat Interface** - Glassmorphism design with smooth animations
- 🤖 **Multiple AI Models** - Support for GPT-4, Claude 3, Gemini Pro, Llama 3, and more
- 🔐 **Secure API Key Storage** - Your API key is stored locally in your browser
- 📱 **Responsive Design** - Works perfectly on all screen sizes
- ⚡ **Real-time Responses** - Fast and accurate AI responses
- 🎭 **Smooth Animations** - Framer Motion powered animations
- 🌈 **Modern UI** - Gradient effects and glassmorphism

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenRouter API key (get it from [openrouter.ai/keys](https://openrouter.ai/keys))

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd chatbot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   # Copy the example file
   copy .env.example .env
   
   # Edit .env and add your Supabase credentials
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   
   **📖 See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for detailed setup instructions**

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   - The app will automatically open at `http://localhost:3000`
   - If not, manually navigate to `http://localhost:3000`
   - You'll be redirected to the login page

### First Time Setup

1. **Register an account:**
   - Click "Create one" on the login page
   - Fill in your details
   - Check your email for verification (if enabled)

2. **Login:**
   - Use your credentials to sign in
   - You'll be redirected to the chat interface

3. **Customize settings:**
   - Click the **Settings** icon (⚙️) to:
     - Select your preferred AI model
     - Enable/disable auto-speak for responses
     - Adjust voice speed (0.5x to 2.0x)

4. **Start chatting!**

## 🎯 Available AI Models

- **GPT-3.5 Turbo** - Fast and efficient
- **GPT-4** - Most capable OpenAI model
- **Claude 3 Opus** - Anthropic's most powerful model
- **Claude 3 Sonnet** - Balanced performance
- **Gemini Pro** - Google's advanced AI
- **Llama 3 70B** - Meta's open-source model

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Three.js** - 3D graphics
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for Three.js
- **Framer Motion** - Animation library
- **Tailwind CSS** - Styling
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client
- **OpenRouter API** - AI model access

## 📁 Project Structure

```
chatbot/
├── src/
│   ├── components/
│   │   ├── Background3D.jsx    # 3D animated background
│   │   └── ChatBot.jsx          # Main chat interface
│   ├── App.jsx                  # Root component
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎨 Features Breakdown

### 3D Background with Mouse Interaction
- **Mouse-Responsive Spheres**: 3D spheres follow your cursor with smooth easing
- **Interactive Particles**: 2000+ particles that move away from mouse (repulsion effect)
- **Dynamic Lighting**: Point light follows cursor creating dramatic lighting effects
- **Responsive Torus**: Floating torus rotates based on mouse position
- **Scale Effects**: Objects scale up when mouse is near them
- **Auto-Rotation**: Gentle camera rotation for continuous movement
- **Metallic Materials**: Distorted spheres with metallic and emissive properties

### Voice Chat Features
- **Speech Recognition**: Click microphone to speak your question
- **Text-to-Speech**: AI responses are automatically spoken aloud
- **Visual Feedback**: Animated microphone button when listening
- **Stop Speaking**: Button to cancel ongoing speech
- **Browser Support**: Works in Chrome, Edge, and Safari

### Chat Interface
- Message history with timestamps
- User and AI message differentiation
- Loading indicators with animated dots
- Error handling with visual feedback
- Clear chat functionality
- Glassmorphism design

### Settings
- **AI Model Selection**: Choose from 9+ different models
- **Auto-Speak Toggle**: Enable/disable automatic voice responses
- **Voice Speed Control**: Adjust speech rate from 0.5x to 2.0x
- **Collapsible Panel**: Clean interface with expandable settings
- **Persistent Preferences**: Settings saved automatically

## 🔒 Security

- API key is securely stored in the application code
- User preferences stored in `localStorage` (client-side only)
- No server-side storage of sensitive data
- HTTPS required for OpenRouter API
- Secure API communication

## 🌐 Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` folder, ready for deployment.

### Deploy to Netlify/Vercel

1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy!

## 💡 Usage Tips

1. **Choose Your Model**: Different models have different capabilities and costs - select in settings
2. **Use Voice Input**: Click the microphone button and speak your question
3. **Auto-Speak**: Enable in settings to have all AI responses read aloud automatically
4. **Adjust Voice Speed**: Use the slider in settings to make the AI speak faster or slower
5. **Mouse Interaction**: Move your mouse around to see the 3D elements react and follow your cursor
6. **Clear Chat**: Use the trash icon to start a fresh conversation
7. **Stop AI Speech**: Click the stop button if you want to cancel the AI's voice response

## 🐛 Troubleshooting

**3D Background Not Loading:**
- Ensure your browser supports WebGL
- Try updating your graphics drivers

**Voice Input Not Working:**
- Speech recognition requires Chrome, Edge, or Safari
- Make sure you've granted microphone permissions
- Check if your microphone is working in other apps

**Slow Responses:**
- Some models (like GPT-4) take longer to respond
- Try using GPT-3.5 Turbo for faster responses

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 🌟 Show Your Support

Give a ⭐️ if you like this project!

---

**COGNIX - Made with ❤️ by Kriszz using React, Three.js, and OpenRouter API**
