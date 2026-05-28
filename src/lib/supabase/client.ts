import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a single supabase client instance that can be imported anywhere.
// If credentials are not present, it will log a warning, but won't crash, allowing fallback to mock data.
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!supabase) {
  console.warn(
    'GrowthVerse Alert: Supabase environment variables are missing. Using high-fidelity local Mock Data Fallback.'
  );
}
