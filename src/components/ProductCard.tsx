import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';

export const ProductCard = ({ product }: { product: Product }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800/50 hover:border-zinc-700 transition-all duration-300"
    >
      <Link to={`/produto/${product.id}`} className="block aspect-[3/4] overflow-hidden">
        <img
          src={product.imagem_url}
          alt={product.nome}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-110"
        />
      </Link>
      
      <div className="p-4">
        <Link to={`/produto/${product.id}`}>
          <h3 className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors line-clamp-1">
            {product.nome}
          </h3>
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-lg font-bold text-white">R$ {product.preco.toFixed(2)}</p>
          <Link 
            to={`/produto/${product.id}`}
            className="p-2 bg-zinc-800 hover:bg-white hover:text-black rounded-full transition-all duration-300"
          >
            <Plus size={18} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
