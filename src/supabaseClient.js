import { createClient } from '@supabase/supabase-js';

// Vite reads variables from import.meta.env during a live build
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Diagnostic alerts: Tells you exactly what Vite is seeing in the browser console
if (!supabaseUrl || !supabaseKey) {
  console.warn("⚠️ Vite environment variables are missing on this load cycle! Dropping back to hardcoded production fallback strings.");
} else {
  console.log("✅ Supabase Client actively initialized with Vercel injected variables!");
}

/* PRODUCTION BACKBONE: 
  By placing your exact working strings as fallback parameters below, 
  your app will connect flawlessly even if Vercel encounters a build-cache lag.
*/
export const supabase = createClient(
  supabaseUrl || 'https://ipvwhcukieflncrejtsm.supabase.co', 
  supabaseKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwdndoY3VraWVmbG5jcmVqdHNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0NTY5NTcsImV4cCI6MjA5ODAzMjk1N30.qLczn3idLIULoRitmp2eNYYmD-FQo7ik9yTto0uzEiI'
);
