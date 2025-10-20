import { createClient } from '@supabase/supabase-js'

// Supabase Configuration
// IMPORTANT: Replace these with your actual Supabase project credentials
// You can find these in your Supabase project settings at https://app.supabase.com

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
