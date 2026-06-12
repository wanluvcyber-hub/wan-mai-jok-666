import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'undefined' || supabaseAnonKey === 'undefined') {
  console.error('Supabase configuration error: Missing environment variables.')
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

try {
  // Validate URL format before passing to createClient
  new URL(supabaseUrl)
} catch (e) {
  console.error('Supabase configuration error: Invalid URL format.', supabaseUrl)
  throw new Error(`Invalid VITE_SUPABASE_URL: "${supabaseUrl}". Must be a valid HTTP or HTTPS URL.`)
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
