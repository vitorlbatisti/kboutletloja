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
  const pathname = location.pathname;

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Fetch categories for the sub-menu
    categoryService.getCategories().then(setCategories).catch(console.error);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-black/80 backdrop-blur-lg border-b border-white/5' : 'bg-transparent'}`}>
      {/* Top Header */}
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-3xl font-black tracking-tighter text-white font-bebas">
            KB<span className="text-muted">OUTLET</span>
          </Link>
        </div>

        <div className="flex items-center space-x-6">
          <a
            href="https://www.instagram.com/k.b_outlet/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest"
          >
            <Instagram size={16} />
            <span className="hidden lg:inline">Instagram</span>
          </a>
          
          <button
            onClick={onOpenCart}
            className="relative text-zinc-400 hover:text-white transition-colors group p-2"
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-white text-black text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow-lg transform translate-x-1 -translate-y-1">
                {totalItems}
              </span>
            )}
          </button>

          <button
            className="md:hidden text-zinc-400 hover:text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Category Menu (Desktop) */}
      <div className="hidden md:block border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-center space-x-10">
          <Link 
            to="/catalogo?featured=true"
            className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 hover:text-white transition-all relative group"
          >
            Nova Coleção
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all group-hover:w-full" />
          </Link>
          
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/catalogo?category=${cat.id}`}
              className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 hover:text-white transition-all relative group"
            >
              {cat.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all group-hover:w-full" />
            </Link>
          ))}

          <Link 
            to="/catalogo?outlet=true"
            className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-500 hover:text-red-400 transition-all relative group"
          >
            Promoções
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-red-500 transition-all group-hover:w-full" />
          </Link>
        </div>
      </div>

      {/* Category Scroll (Mobile) */}
      <div className="md:hidden border-t border-white/5 bg-black/20 backdrop-blur-md">
        <div className="flex overflow-x-auto scrollbar-hide px-6 py-3 space-x-6 items-center">
          <Link 
            to="/catalogo?featured=true"
            className="whitespace-nowrap text-[9px] font-bold uppercase tracking-widest text-zinc-400"
          >
            Novidades
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/catalogo?category=${cat.id}`}
              className="whitespace-nowrap text-[9px] font-bold uppercase tracking-widest text-zinc-400"
            >
              {cat.name}
            </Link>
          ))}
          <Link 
            to="/catalogo?outlet=true"
            className="whitespace-nowrap text-[9px] font-bold uppercase tracking-widest text-red-500"
          >
            Outlet
          </Link>
        </div>
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
