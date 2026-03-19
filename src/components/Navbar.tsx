import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Instagram, User, Menu, X } from 'lucide-react';
import { useCart } from '../CartContext';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar = ({ onOpenCart }: { onOpenCart: () => void }) => {
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Catálogo', path: '/catalogo' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold tracking-tighter text-white">
              KB<span className="text-zinc-500">OUTLET</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-white ${
                  location.pathname === link.path ? 'text-white' : 'text-zinc-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="https://www.instagram.com/k.b_outlet/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <Instagram size={20} />
            </a>
            <button
              onClick={onOpenCart}
              className="relative text-zinc-400 hover:text-white transition-colors"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              className="md:hidden text-zinc-400 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-zinc-900 border-t border-zinc-800"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md"
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
