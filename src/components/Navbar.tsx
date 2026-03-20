'use client';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Instagram, User, Menu, X } from 'lucide-react';
import { useCart } from '../CartContext';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar = ({ onOpenCart }: { onOpenCart: () => void }) => {
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Catálogo', path: '/catalogo' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'py-2' : 'py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className={`flex justify-between items-center h-16 px-4 sm:px-8 rounded-full transition-all duration-500 ${isScrolled ? 'glass-effect shadow-2xl border-white/10' : 'bg-transparent border-transparent'} border`}>
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-black tracking-tighter text-white">
              KB<span className="text-zinc-500">OUTLET</span>
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8 mr-4 border-r border-white/10 pr-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all hover:text-white ${
                    pathname === link.path ? 'text-white' : 'text-zinc-500'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-6">
              <a
                href="https://www.instagram.com/k.b_outlet/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <Instagram size={18} />
              </a>
              <button
                onClick={onOpenCart}
                className="relative text-zinc-500 hover:text-white transition-colors group"
              >
                <ShoppingBag size={18} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-black text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow-lg">
                    {totalItems}
                  </span>
                )}
              </button>
              <button
                className="md:hidden text-zinc-500 hover:text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-6 right-6 mt-4 glass-effect rounded-[2rem] overflow-hidden shadow-2xl"
          >
            <div className="p-8 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
