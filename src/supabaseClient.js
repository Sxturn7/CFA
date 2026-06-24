import { createClient } from '@supabase/supabase-js';

// Vite reads variables from import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Detailed diagnostics to tell you exactly what Vite is seeing
if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
  console.error("🚨 VITE_SUPABASE_URL is missing or invalid! Check your Vercel Environment Variables setup.");
}
if (!supabaseKey || supabaseKey.includes('placeholder')) {
  console.error("🚨 VITE_SUPABASE_ANON_KEY is missing or invalid! Check your Vercel Environment Variables setup.");
}

// Fallbacks prevent the initialization from throwing a fatal app-crashing error
export const supabase = createClient(
  supabaseUrl || 'https://sdsgvhqktpuciyfdjyta.supabase.co', 
  supabaseKey || 'dummy-key-fallback'
);
