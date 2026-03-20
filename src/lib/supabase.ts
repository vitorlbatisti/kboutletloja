/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://stohpiithlpfpdffante.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_zxr-h_IDAbzJQn7xXnk58g_Z7pMskwg';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL ou Anon Key não configurados corretamente!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('Supabase Client inicializado para:', supabaseUrl);

// Helper to check if user is admin
export const isAdmin = async () => {
  try {
    console.log('Verificando status de admin...');
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Erro ao obter usuário no isAdmin:', error);
      return false;
    }
    if (!user) {
      console.warn('Nenhum usuário autenticado encontrado no isAdmin');
      return false;
    }
    
    console.log('Usuário autenticado:', user.email);
    // For now, we allow any authenticated user to access the admin area
    // To restrict access, you can uncomment the lines below and add authorized emails
    /*
    const adminEmails = ['vitorluizbatisti123@gmail.com'];
    return adminEmails.includes(user.email || '');
    */
    return true;
  } catch (err) {
    console.error('Erro inesperado no isAdmin:', err);
    return false;
  }
};
