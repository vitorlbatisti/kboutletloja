/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// Use environment variables from Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fallback values (only for development/preview if not set in Settings)
const DEFAULT_URL = 'https://stohpiithlpfpdffante.supabase.co';
const DEFAULT_KEY = 'sb_publishable_zxr-h_IDAbzJQn7xXnk58g_Z7pMskwg';

const finalUrl = supabaseUrl || DEFAULT_URL;
const finalKey = supabaseAnonKey || DEFAULT_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are not set in the Settings menu. ' +
    'Using default fallback project. If this is not your project, please configure them in Settings.'
  );
}

export const supabase = createClient(finalUrl, finalKey);

// Log initialization status (safely)
console.log('Supabase Client inicializado.');
if (process.env.NODE_ENV !== 'production') {
  console.log('URL:', finalUrl.substring(0, 20) + '...');
}
