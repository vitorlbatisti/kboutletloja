import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { motion, AnimatePresence } from 'motion/react';

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export const AdminLayout = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const location = useLocation();
  const isLoginPage = location.pathname === '/admin';

  useEffect(() => {
    const checkAuth = async () => {
      if (isLoginPage) {
        setIsAuthorized(true);
        return;
      }
      const authorized = await authService.isAdmin();
      setIsAuthorized(authorized);
    };
    checkAuth();
  }, [isLoginPage]);

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!isAuthorized && !isLoginPage) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main>
        <PageWrapper>
          <Outlet />
        </PageWrapper>
      </main>
    </div>
  );
};
