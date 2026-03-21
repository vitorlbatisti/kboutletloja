import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';

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
        
        {product.destaque && (
          <div className="absolute top-4 left-4 z-20 px-3 py-1 glass-effect rounded-full">
            <span className="text-[9px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-1 h-1 bg-glow-red rounded-full animate-pulse" />
              Destaque
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
      
      <div className="p-4">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-grow">
            <Link to={`/produto/${product.id}`}>
              <h3 className="text-sm font-bold text-accent group-hover:text-white transition-colors line-clamp-1 tracking-tight">
                {product.nome}
              </h3>
            </Link>
            <p className="text-[10px] text-muted mt-1 uppercase tracking-[0.2em] font-bold">
              Outlet Premium
            </p>
          </div>
          <div className="text-right">
            <p className="text-base font-black text-white tracking-tighter">
              R$ {product.preco.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
