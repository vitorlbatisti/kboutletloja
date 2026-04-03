import React from 'react';
import { Category, SubCategory } from '../../types';
import { Plus, Edit2, Trash2, Layers } from 'lucide-react';
import { motion } from 'motion/react';

interface CategoryTabProps {
  categories: Category[];
  subcategories: SubCategory[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onAddSub: () => void;
  onDeleteSub: (id: string) => void;
}

export const CategoryTab: React.FC<CategoryTabProps> = ({
  categories,
  subcategories,
  onEdit,
  onDelete,
  onAdd,
  onAddSub,
  onDeleteSub
}) => {
  return (
    <div className="space-y-12 relative z-10">
      {/* Categorias Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bebas tracking-wide text-white/90">Categorias ({categories.length})</h2>
          <button
            onClick={onAdd}
            className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 font-bold shadow-xl shadow-white/10"
          >
            <Plus size={20} />
            Nova Categoria
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((c) => (
            <motion.div
              key={c.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-all duration-500 backdrop-blur-sm"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={c.image_url}
                  alt={c.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="absolute bottom-4 left-4 right-4 translate-y-10 group-hover:translate-y-0 transition-transform duration-500 flex justify-center gap-3">
                  <button
                    onClick={() => onEdit(c)}
                    className="bg-white text-black p-3 rounded-xl hover:scale-110 transition-all duration-300 shadow-xl"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => onDelete(c.id)}
                    className="bg-red-500 text-white p-3 rounded-xl hover:scale-110 transition-all duration-300 shadow-xl"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">{c.name}</h3>
                <p className="text-sm text-white/40 mt-1">
                  {subcategories.filter(s => s.category_id === c.id).length} Subcategorias
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Subcategorias Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bebas tracking-wide text-white/90">Subcategorias ({subcategories.length})</h2>
          <button
            onClick={onAddSub}
            className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 font-bold shadow-xl shadow-purple-600/20"
          >
            <Plus size={20} />
            Nova Subcategoria
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-4 gap-4">
          {subcategories.map((s) => (
            <motion.div
              key={s.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center hover:border-purple-500/30 transition-all duration-300 backdrop-blur-sm"
            >
              <div>
                <h4 className="font-bold text-white">{s.name}</h4>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">
                  {categories.find(c => c.id === s.category_id)?.name || 'Sem categoria'}
                </p>
              </div>
              <button
                onClick={() => onDeleteSub(s.id)}
                className="text-white/20 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-500/10"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
