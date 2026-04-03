import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { motion } from 'motion/react';
import { Plus, Star, Truck } from 'lucide-react';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-secondary rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
    >
      <Link to={`/produto/${product.id}`} className="block aspect-square overflow-hidden relative">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
        
        {product.fast_delivery && (
          <div className="absolute top-0 right-0 z-30 pointer-events-none overflow-hidden w-24 h-24 sm:w-32 sm:h-32">
            <div className="absolute top-[16px] right-[-42px] sm:top-[22px] sm:right-[-36px] w-[140px] sm:w-[160px] bg-white py-1.5 sm:py-2.5 rotate-45 flex items-center justify-center gap-1 sm:gap-2 shadow-xl whitespace-nowrap">
              <Truck size={10} className="text-black sm:size-3" />
              <span className="text-[7px] sm:text-[9px] font-black text-black uppercase tracking-tighter whitespace-nowrap">
                Entrega Rápida
              </span>
            </div>
          </div>
        )}

        {product.featured && (
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-20 px-2 py-1 sm:px-2.5 sm:py-1.5 glass-effect rounded-full shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <span className="text-amber-500 flex items-center justify-center">
              <Star size={12} fill="currentColor" className="sm:size-4" />
            </span>
          </div>
        )}

        {/* Hover Action (Desktop Only) */}
        <div className="absolute inset-0 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
          <span className="px-5 py-1.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl">
            Ver Detalhes
          </span>
        </div>
      </Link>
      
      <div className="p-2 sm:p-4">
        <Link to={`/produto/${product.id}`}>
          <h3 className="text-[10px] sm:text-[12px] font-bold text-accent group-hover:text-white transition-colors leading-tight tracking-tight mb-1 sm:mb-2 line-clamp-2 h-7 sm:h-9">
            {product.name}
          </h3>
        </Link>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
          <p className="text-[7px] sm:text-[9px] text-muted uppercase tracking-[0.1em] sm:tracking-[0.2em] font-bold">
            Outlet Premium
          </p>
          <p className="text-[11px] sm:text-sm font-black text-white tracking-tighter">
            R$ {product.price.toFixed(2)}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
