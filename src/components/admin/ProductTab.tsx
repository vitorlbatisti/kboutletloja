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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <motion.div
            key={p.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-all duration-500 backdrop-blur-sm"
          >
            <div className="relative aspect-square overflow-hidden">
              <img
                src={p.image_url}
                alt={p.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {p.featured && (
                  <div className="bg-yellow-500 text-black p-2 rounded-full shadow-lg" title="Destaque">
                    <Star size={16} fill="currentColor" />
                  </div>
                )}
                {p.fast_delivery && (
                  <div className="bg-green-500 text-white p-2 rounded-full shadow-lg" title="Entrega Rápida">
                    <Truck size={16} />
                  </div>
                )}
              </div>

              <div className="absolute bottom-4 left-4 right-4 translate-y-10 group-hover:translate-y-0 transition-transform duration-500 flex justify-center gap-3">
                <button
                  onClick={() => onEdit(p)}
                  className="bg-white text-black p-3 rounded-xl hover:scale-110 transition-all duration-300 shadow-xl"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => onDelete(p.id)}
                  className="bg-red-500 text-white p-3 rounded-xl hover:scale-110 transition-all duration-300 shadow-xl"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">{p.name}</h3>
                <span className="text-xl font-bebas text-white/90">R$ {p.price.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-xs px-3 py-1 bg-white/10 rounded-full text-white/60 font-medium border border-white/5">
                  {getCategoryName(p.category_id || '')}
                </span>
                {p.subcategory_id && (
                  <span className="text-xs px-3 py-1 bg-purple-500/20 rounded-full text-purple-300 font-medium border border-purple-500/20">
                    {getSubCategoryName(p.subcategory_id)}
                  </span>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-1">
                {p.sizes.map(size => (
                  <span key={size} className="text-[10px] px-2 py-0.5 bg-white/5 rounded border border-white/10 text-white/40">
                    {size}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
