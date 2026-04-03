import React from 'react';
import { motion } from 'motion/react';
import { Lock, Mail } from 'lucide-react';
import { useAdminLogin } from '../hooks/useAdminLogin';

export const AdminLogin = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleLogin
  } = useAdminLogin();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-40">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-secondary p-10 rounded-2xl border border-white/5 shadow-2xl"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl mb-2">Painel Admin</h1>
          <p className="text-muted">Acesse para gerenciar sua loja</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted ml-1">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-base" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-black border border-white/5 rounded-xl focus:outline-none focus:border-white/20 transition-all placeholder:text-zinc-800"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted ml-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-base" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-black border border-white/5 rounded-xl focus:outline-none focus:border-white/20 transition-all placeholder:text-zinc-800"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold uppercase tracking-widest text-center"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-white text-black font-bold rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl"
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
