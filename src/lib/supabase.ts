/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://stohpiithlpfpdffante.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_zxr-h_IDAbzJQn7xXnk58g_Z7pMskwg';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL ou Anon Key não configurados corretamente!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('Supabase Client inicializado para:', supabaseUrl);

// Helper to check if user is admin (simplified for this demo, usually handled via RLS)
export const isAdmin = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return !!user;
};
