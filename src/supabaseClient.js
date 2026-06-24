import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// If keys are missing, provide a dummy fallback string instead of passing 'undefined'.
// This prevents a total white-screen crash and lets you read console logs instead!
if (!supabaseUrl || !supabaseKey) {
  console.error("🚨 Missing Supabase Environment Variables in Vite!");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseKey || 'placeholder'
);
