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
      <Link to={`/produto/${product.id}`} className="block aspect-[3/4] overflow-hidden relative">
        <img
          src={product.imagem_url}
          alt={product.nome}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
        
        {product.entrega_rapida && (
          <div className="absolute top-0 right-0 z-30 pointer-events-none overflow-hidden w-32 h-32">
            <div className="absolute top-[22px] right-[-36px] w-[160px] bg-white py-2.5 rotate-45 flex items-center justify-center gap-2 shadow-xl whitespace-nowrap">
              <Truck size={12} className="text-black" />
              <span className="text-[9px] font-black text-black uppercase tracking-tighter whitespace-nowrap">
                Entrega Rápida
              </span>
            </div>
          </div>
        )}

        {product.destaque && (
          <div className="absolute top-4 left-4 z-20 px-2.5 py-1.5 glass-effect rounded-full shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <span className="text-amber-500 flex items-center justify-center">
              <Star size={16} fill="currentColor" />
            </span>
          </div>
        )}

        {/* Hover Action */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
          <span className="px-5 py-1.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl">
            Ver Detalhes
          </span>
        </div>
      </Link>
      
      <div className="p-3 sm:p-4">
        <Link to={`/produto/${product.id}`}>
          <h3 className="text-[11px] sm:text-[12px] font-bold text-accent group-hover:text-white transition-colors leading-tight tracking-tight mb-2">
            {product.nome}
          </h3>
        </Link>
        <div className="flex justify-between items-center">
          <p className="text-[8px] sm:text-[9px] text-muted uppercase tracking-[0.2em] font-bold">
            Outlet Premium
          </p>
          <p className="text-[12px] sm:text-sm font-black text-white tracking-tighter">
            R$ {product.preco.toFixed(2)}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
