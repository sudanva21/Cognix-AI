import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, User, UserPlus, Sparkles, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    const { data, error } = await signUp(email, password, fullName)
    
    if (error) {
      setError(error)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    }
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Join COGNIX</h1>
          <p className="text-white/60">Create your account</p>
        </div>

        {/* Register Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-200">{error}</p>
              </motion.div>
            )}

            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <p className="text-sm text-green-200">Account created! Redirecting to login...</p>
              </motion.div>
            )}

            {/* Full Name Input */}
            <div>
              <label className="block text-white/80 text-sm font-semibold mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-xl glass text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition-all"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-white/80 text-sm font-semibold mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-xl glass text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-white/80 text-sm font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-xl glass text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition-all"
                />
              </div>
              <p className="text-xs text-white/40 mt-1 ml-1">At least 6 characters</p>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-white/80 text-sm font-semibold mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-xl glass text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || success}
              className="w-full py-3 sm:py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-500/50 transition-all"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-white/40 text-sm mt-6">
          Powered by <span className="text-purple-400 font-semibold">Kriszz</span>
        </p>
      </motion.div>
    </div>
  )
}
