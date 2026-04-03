import React from 'react';
import { X, ImageIcon, Plus, Trash2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingId: string | null;
  formData: any;
  setFormData: (data: any) => void;
  uploading: boolean;
  onSave: (e: React.FormEvent) => void;
  imagePreview: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  newSubCatName: string;
  setNewSubCatName: (name: string) => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  editingId,
  formData,
  setFormData,
  uploading,
  onSave,
  imagePreview,
  onFileChange,
  newSubCatName,
  setNewSubCatName
}) => {
  const addSubCategory = () => {
    if (newSubCatName.trim()) {
      setFormData({
        ...formData,
        subcategories: [...formData.subcategories, newSubCatName.trim()]
      });
      setNewSubCatName('');
    }
  };

  const removeSubCategory = (index: number) => {
    setFormData({
      ...formData,
      subcategories: formData.subcategories.filter((_: any, i: number) => i !== index)
    });
  };

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
                {editingId ? 'Editar Categoria' : 'Nova Categoria'}
              </h2>
              <button
                onClick={onClose}
                className="p-3 hover:bg-white/10 rounded-full transition-all text-white/40 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={onSave} className="space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Imagem da Categoria</label>
                <div className="relative group aspect-video rounded-3xl overflow-hidden bg-white/5 border-2 border-dashed border-white/10 hover:border-white/30 transition-all cursor-pointer">
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-sm font-bold text-white">Trocar Imagem</span>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/20">
                      <ImageIcon size={48} />
                      <span className="text-xs font-bold uppercase tracking-widest">Upload Imagem</span>
                    </div>
                  )}
                  <input
                    type="file"
                    onChange={onFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Nome da Categoria</label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/30 transition-all outline-none"
                    placeholder="Ex: Camisetas"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Subcategorias</label>
                  <div className="flex gap-2">
                    <input
                      value={newSubCatName}
                      onChange={(e) => setNewSubCatName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubCategory())}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/30 transition-all outline-none"
                      placeholder="Nova subcategoria..."
                    />
                    <button
                      type="button"
                      onClick={addSubCategory}
                      className="bg-white text-black px-4 rounded-xl hover:scale-105 transition-all"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.subcategories.map((sub: string, idx: number) => (
                      <span
                        key={idx}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-white/80"
                      >
                        {sub}
                        <button
                          type="button"
                          onClick={() => removeSubCategory(idx)}
                          className="text-white/20 hover:text-red-500 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
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
                  'Salvar Categoria'
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
