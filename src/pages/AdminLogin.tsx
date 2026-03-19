import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { Lock, Mail } from 'lucide-react';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    console.log('Tentando login com:', email);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Erro no Supabase Auth:', error.message);
        setError(`Erro: ${error.message}`);
        setLoading(false);
      } else {
        console.log('Login bem-sucedido:', data.user?.email);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
      setError('Ocorreu um erro inesperado ao tentar entrar.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter mb-2">Painel Admin</h1>
          <p className="text-zinc-500">Acesse para gerenciar sua loja</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 transition-colors"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed btn-glow flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Entrando...
              </>
            ) : 'Entrar'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
