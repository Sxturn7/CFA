import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Loud diagnostics: This will pop up a window message on your screen if variables are missing
if (!supabaseUrl || !supabaseKey) {
  const missingKeys = [];
  if (!supabaseUrl) missingKeys.push("VITE_SUPABASE_URL");
  if (!supabaseKey) missingKeys.push("VITE_SUPABASE_ANON_KEY");
  
  alert(`🚨 DEPLOYMENT ERROR: Missing variables: ${missingKeys.join(', ')}. Check Vercel settings!`);
} else {
  console.log("✅ Supabase Client initialized successfully with URL:", supabaseUrl);
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseKey || 'placeholder'
);
