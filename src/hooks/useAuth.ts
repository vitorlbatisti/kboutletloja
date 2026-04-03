import { useState, useCallback, useEffect } from 'react';
import { authService } from '../services/authService';
import { User } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const currentUser = await authService.getUser();
      setUser(currentUser);
      if (currentUser) {
        const adminStatus = await authService.isAdmin();
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao verificar autenticação');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const signOut = async () => {
    setLoading(true);
    try {
      await authService.signOut();
      setUser(null);
      setIsAdmin(false);
    } catch (err: any) {
      setError(err.message || 'Erro ao sair');
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    isAdmin,
    loading,
    error,
    checkAuth,
    signOut
  };
};
