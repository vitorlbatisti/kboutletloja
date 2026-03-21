import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

const PremiumPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show popup after 2 seconds
    const timer = setTimeout(() => {
      const hasSeenPopup = sessionStorage.getItem('hasSeenPopup');
      if (!hasSeenPopup) {
        setIsOpen(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    sessionStorage.setItem('hasSeenPopup', 'true');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-black shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 bg-grain"
          >
            {/* Subtle Radial Gradient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(88,28,135,0.15)_0%,rgba(153,27,27,0.1)_50%,transparent_100%)] pointer-events-none" />
            
            {/* Border Glow Effect */}
            <div className="absolute inset-0 rounded-[2.5rem] shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-6 right-6 z-50 p-2 text-white/50 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="relative z-10 p-10 md:p-14 flex flex-col items-center text-center">
              {/* Logo/Brand Indicator */}
              <div className="mb-8">
                <span className="text-[10px] font-spartan font-black tracking-[0.5em] text-white/40 uppercase">
                  KB Outlet Exclusive
                </span>
              </div>

              {/* Main Title */}
              <h2 className="text-5xl md:text-7xl font-spartan font-black leading-[0.9] tracking-tighter text-white mb-6 uppercase">
                ENTRE <br /> PRO JOGO.
              </h2>

              {/* Subtitle */}
              <p className="text-zinc-400 font-spartan font-medium text-sm md:text-base mb-10 max-w-[280px] leading-relaxed">
                Acesso antecipado aos drops, bastidores e lifestyle da KB.
              </p>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-5 bg-white text-black rounded-full font-spartan font-black text-sm uppercase tracking-widest transition-all mb-8 shadow-2xl"
              >
                QUERO ACESSO
              </motion.button>

              {/* Secondary Text */}
              <span className="text-[10px] font-spartan font-bold tracking-[0.3em] text-white/30 uppercase">
                @K.B_OUTLET
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PremiumPopup;
