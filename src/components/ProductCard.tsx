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
      className="group relative bg-zinc-900/50 rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
    >
      <Link to={`/produto/${product.id}`} className="block aspect-square overflow-hidden relative">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
        
        {product.fast_delivery && (
          <div className="absolute top-3 right-3 z-20 px-2 py-1 bg-white text-black text-[8px] font-black uppercase tracking-widest rounded-md flex items-center gap-1 shadow-xl">
            <Truck size={10} />
            <span>Entrega Rápida</span>
          </div>
        )}

        {product.featured && (
          <div className="absolute top-3 left-3 z-20 px-2 py-1 bg-amber-500 text-black text-[8px] font-black uppercase tracking-widest rounded-md flex items-center gap-1 shadow-xl">
            <Star size={10} fill="currentColor" />
            <span>Destaque</span>
          </div>
        )}
      </Link>
      
      <div className="p-4 md:p-6">
        <Link to={`/produto/${product.id}`}>
          <h3 className="text-sm md:text-base font-bold text-white group-hover:text-white/80 transition-colors leading-tight tracking-tight mb-2 line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <div className="flex justify-between items-center">
          <p className="text-[10px] text-muted uppercase tracking-widest font-bold">
            Premium Outlet
          </p>
          <p className="text-sm md:text-lg font-black text-white tracking-tighter">
            R$ {product.price.toFixed(2)}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
