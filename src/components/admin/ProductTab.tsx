import React from 'react';
import { Product, Category, SubCategory } from '../../types';
import { Plus, Edit2, Trash2, Star, Clock, Truck } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductTabProps {
  products: Product[];
  categories: Category[];
  subcategories: SubCategory[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export const ProductTab: React.FC<ProductTabProps> = ({
  products,
  categories,
  subcategories,
  onEdit,
  onDelete,
  onAdd
}) => {
  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'Sem categoria';
  const getSubCategoryName = (id: string) => subcategories.find(s => s.id === id)?.name || 'Sem subcategoria';

  return (
    <div className="space-y-6 relative z-10">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bebas tracking-wide text-white/90">Produtos ({products.length})</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 font-bold shadow-xl shadow-white/10"
        >
          <Plus size={20} />
          Novo Produto
        </button>
      </div>

      <div className="space-y-4">
        {products.map((p) => (
          <motion.div
            key={p.id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-all duration-500 backdrop-blur-sm flex items-center p-4 gap-6"
          >
            {/* Image Container - Smaller */}
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
              <img
                src={p.image_url}
                alt={p.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-1 right-1 flex flex-col gap-1">
                {p.featured && (
                  <div className="bg-yellow-500 text-black p-1 rounded-full shadow-lg" title="Destaque">
                    <Star size={10} fill="currentColor" />
                  </div>
                )}
                {p.fast_delivery && (
                  <div className="bg-green-500 text-white p-1 rounded-full shadow-lg" title="Entrega Rápida">
                    <Truck size={10} />
                  </div>
                )}
              </div>
            </div>

            {/* Content Container */}
            <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-white transition-colors truncate">
                    {p.name}
                  </h3>
                  <span className="hidden md:inline-block text-xl font-bebas text-white/40">
                    R$ {p.price.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] px-2 py-0.5 bg-white/10 rounded-full text-white/60 font-medium border border-white/5">
                    {getCategoryName(p.category_id || '')}
                  </span>
                  {p.subcategory_id && (
                    <span className="text-[10px] px-2 py-0.5 bg-white/10 rounded-full text-white/60 font-medium border border-white/5">
                      {getSubCategoryName(p.subcategory_id)}
                    </span>
                  )}
                </div>

                <div className="mt-2 flex flex-wrap gap-1">
                  {p.sizes.map(size => (
                    <span key={size} className="text-[9px] px-1.5 py-0.5 bg-white/5 rounded border border-white/10 text-white/30">
                      {size}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4">
                <span className="md:hidden text-xl font-bebas text-white/90">
                  R$ {p.price.toFixed(2).replace('.', ',')}
                </span>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(p)}
                    className="bg-white/10 text-white p-2.5 rounded-xl hover:bg-white hover:text-black transition-all duration-300 border border-white/10"
                    title="Editar"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(p.id)}
                    className="bg-red-500/10 text-red-500 p-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 border border-red-500/20"
                    title="Excluir"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
