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
      className="group relative bg-zinc-950 rounded-[2rem] overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
    >
      <Link to={`/produto/${product.id}`} className="block aspect-[4/5] overflow-hidden relative">
        <img
          src={product.imagem_url}
          alt={product.nome}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
        
        {/* Hover Action */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
          <span className="px-6 py-2 bg-white text-black text-sm font-bold rounded-full shadow-xl">
            Ver Detalhes
          </span>
        </div>
      </Link>
      
      <div className="p-6">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-grow">
            <Link to={`/produto/${product.id}`}>
              <h3 className="text-base font-semibold text-zinc-100 group-hover:text-white transition-colors line-clamp-1 tracking-tight">
                {product.nome}
              </h3>
            </Link>
            <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest font-medium">
              Outlet Premium
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-white tracking-tighter">
              R$ {product.preco.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
