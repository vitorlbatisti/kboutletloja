import React from 'react';
import { X, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Category } from '../../types';

interface SubCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingId: string | null;
  formData: any;
  setFormData: (data: any) => void;
  categories: Category[];
  uploading: boolean;
  onSave: (e: React.FormEvent) => void;
}

export const SubCategoryModal: React.FC<SubCategoryModalProps> = ({
  isOpen,
  onClose,
  editingId,
  formData,
  setFormData,
  categories,
  uploading,
  onSave
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-zinc-900 border border-white/10 p-8 rounded-[2rem] max-w-lg w-full relative z-10 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-4xl font-bebas tracking-wide text-white">
                {editingId ? 'Editar Subcategoria' : 'Nova Subcategoria'}
              </h2>
              <button
                onClick={onClose}
                className="p-3 hover:bg-white/10 rounded-full transition-all text-white/40 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={onSave} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Nome da Subcategoria</label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/30 transition-all outline-none"
                  placeholder="Ex: Manga Curta"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Categoria Pai</label>
                <select
                  required
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/30 transition-all outline-none appearance-none"
                >
                  <option value="" className="bg-zinc-900">Selecione...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id} className="bg-zinc-900">{c.name}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-white text-black py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 shadow-2xl shadow-white/10 mt-8 flex items-center justify-center gap-3"
              >
                {uploading ? (
                  <>
                    <RefreshCw className="animate-spin" size={20} />
                    Salvando...
                  </>
                ) : (
                  'Salvar Subcategoria'
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
