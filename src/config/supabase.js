import { createClient } from '@supabase/supabase-js'

// Supabase Configuration
// IMPORTANT: Set these environment variables in Vercel:
// - VITE_SUPABASE_URL
// - VITE_SUPABASE_ANON_KEY
// You can find these in your Supabase project settings at https://app.supabase.com

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL' || !supabaseUrl.includes('supabase.co')) {
  console.error('❌ VITE_SUPABASE_URL is not configured properly!')
  console.error('Please add VITE_SUPABASE_URL to your environment variables in Vercel')
  console.error('See VERCEL_DEPLOYMENT.md for instructions')
}

if (!supabaseAnonKey || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY' || supabaseAnonKey.length < 20) {
  console.error('❌ VITE_SUPABASE_ANON_KEY is not configured properly!')
  console.error('Please add VITE_SUPABASE_ANON_KEY to your environment variables in Vercel')
  console.error('See VERCEL_DEPLOYMENT.md for instructions')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)
