'use client';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Instagram, Menu, X, ChevronRight } from 'lucide-react';
import { useCart } from '../CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { categoryService } from '../services/categoryService';
import { Category } from '../types';

export const Navbar = ({ onOpenCart }: { onOpenCart: () => void }) => {
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeCategory = searchParams.get('category') || 'all';
  const isFeatured = searchParams.get('featured') === 'true';
  const isOutlet = searchParams.get('outlet') === 'true';

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    
    categoryService.getCategories().then(setCategories).catch(console.error);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'py-2' : 'py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <nav className={`relative overflow-hidden rounded-3xl transition-all duration-500 border border-white/5 shadow-2xl ${isScrolled ? 'bg-black/80 backdrop-blur-xl' : 'bg-black/40 backdrop-blur-md'}`}>
          {/* Main Header Row */}
          <div className="h-[70px] md:h-[80px] flex items-center justify-between px-6 md:px-8">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <span className="text-2xl md:text-3xl font-black tracking-tighter text-white font-bebas group-hover:scale-105 transition-transform">
                KB<span className="text-zinc-500 group-hover:text-white transition-colors">OUTLET</span>
              </span>
            </Link>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              <a
                href="https://www.instagram.com/k.b_outlet/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              
              <button
                onClick={onOpenCart}
                className="relative p-2.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-all group"
                aria-label="Carrinho"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-white text-black text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow-lg">
                    {totalItems}
                  </span>
                )}
              </button>

              <button
                className="md:hidden p-2.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Categories Navigation Row */}
          <div className="border-t border-white/5 bg-white/[0.02]">
            <div className="flex items-center overflow-x-auto scrollbar-hide px-6 md:px-8 py-3.5 gap-8 md:justify-center">
              <Link 
                to="/catalogo?featured=true"
                className={`whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative py-1 ${
                  isFeatured ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Novidades
                {isFeatured && <motion.div layoutId="nav-active" className="absolute -bottom-0.5 left-0 right-0 h-[1px] bg-white" />}
              </Link>
              
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id && !isFeatured && !isOutlet;
                return (
                  <Link
                    key={cat.id}
                    to={`/catalogo?category=${cat.id}`}
                    className={`whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative py-1 ${
                      isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {cat.name}
                    {isActive && <motion.div layoutId="nav-active" className="absolute -bottom-0.5 left-0 right-0 h-[1px] bg-white" />}
                  </Link>
                );
              })}

              <Link 
                to="/catalogo?outlet=true"
                className={`whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative py-1 ${
                  isOutlet ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Outlet
                {isOutlet && <motion.div layoutId="nav-active" className="absolute -bottom-0.5 left-0 right-0 h-[1px] bg-white" />}
              </Link>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Sidebar Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[-1]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 h-screen w-[80%] max-w-sm bg-zinc-950 border-l border-white/10 shadow-2xl z-50 flex flex-col"
            >
              <div className="p-8 flex justify-between items-center border-b border-white/5">
                <span className="text-xl font-bebas tracking-widest">Menu</span>
                <button onClick={() => setIsMenuOpen(false)} className="text-zinc-400">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Navegação</p>
                  <Link to="/" className="block text-2xl font-bebas tracking-wider hover:text-zinc-400 transition-colors">Início</Link>
                  <Link to="/catalogo" className="block text-2xl font-bebas tracking-wider hover:text-zinc-400 transition-colors">Catálogo Completo</Link>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Categorias</p>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/catalogo?category=${cat.id}`}
                      className="flex items-center justify-between text-lg font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition-colors"
                    >
                      {cat.name}
                      <ChevronRight size={16} className="text-zinc-600" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="p-8 border-t border-white/5 space-y-6">
                <a
                  href="https://www.instagram.com/k.b_outlet/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors"
                >
                  <Instagram size={20} />
                  <span className="text-sm font-bold uppercase tracking-widest">Instagram</span>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
