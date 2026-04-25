import React from 'react';
import { Product, Category, SubCategory } from '../../types';
import { X, ImageIcon, Star, Truck, Clock, RefreshCw, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const STANDARD_SIZES = ['P', 'M', 'G', 'GG', 'G1', 'G2', 'G3'];
const KIDS_SIZES = ['2 anos', '4 anos', '6 anos', '8 anos', '10 anos', '12 anos'];
const BOOTS_SIZES = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingId: string | null;
  formData: any;
  setFormData: (data: any) => void;
  categories: Category[];
  subcategories: SubCategory[];
  uploading: boolean;
  onSave: (e: React.FormEvent) => void;
  imagePreview: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  additionalImagePreviews: (string | null)[];
  onAdditionalFileChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAdditionalImage: (index: number) => void;
  onPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleSize: (size: string) => void;
  loadingSubcategories?: boolean;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  editingId,
  formData,
  setFormData,
  categories,
  subcategories,
  uploading,
  onSave,
  imagePreview,
  onFileChange,
  onRemoveImage,
  additionalImagePreviews,
  onAdditionalFileChange,
  onRemoveAdditionalImage,
  onPriceChange,
  onToggleSize,
  loadingSubcategories = false
}) => {
  const [activeSizeGrid, setActiveSizeGrid] = React.useState<'standard' | 'kids' | 'boots'>('standard');

  React.useEffect(() => {
    if (formData.is_kids_kit) {
      setActiveSizeGrid('kids');
    } else if (formData.sizes.split(',').some((s: string) => BOOTS_SIZES.includes(s.trim()))) {
      setActiveSizeGrid('boots');
    } else {
      setActiveSizeGrid('standard');
    }
  }, [formData.is_kids_kit, isOpen]);

  const handleGridSwitch = (gridId: 'standard' | 'kids' | 'boots') => {
    setActiveSizeGrid(gridId);
    setFormData({ 
      ...formData, 
      is_kids_kit: gridId === 'kids',
      sizes: '' 
    });
  };

  const currentSizes = activeSizeGrid === 'kids' ? KIDS_SIZES : (activeSizeGrid === 'boots' ? BOOTS_SIZES : STANDARD_SIZES);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-zinc-900 border border-white/10 p-8 rounded-[2rem] max-w-4xl w-full relative z-10 shadow-2xl my-8"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-4xl font-bebas tracking-wide text-white">
                {editingId ? 'Editar Produto' : 'Novo Produto'}
              </h2>
              <button
                onClick={onClose}
                className="p-3 hover:bg-white/10 rounded-full transition-all text-white/40 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={onSave} className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                {/* Imagem Principal */}
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Imagem Principal</label>
                  <div className="relative group aspect-square rounded-3xl overflow-hidden bg-white/5 border-2 border-dashed border-white/10 hover:border-white/30 transition-all cursor-pointer">
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-sm font-bold text-white">Trocar Imagem</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { 
                            e.preventDefault();
                            e.stopPropagation(); 
                            onRemoveImage(); 
                          }}
                          className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-red-600 shadow-lg"
                        >
                          <X size={18} />
                        </button>
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
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      accept="image/*"
                    />
                  </div>
                </div>

                {/* Imagens Adicionais */}
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Imagens Adicionais</label>
                  <div className="grid grid-cols-2 gap-4">
                    {additionalImagePreviews.map((preview, idx) => (
                      <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden bg-white/5 border-2 border-dashed border-white/10 hover:border-white/30 transition-all cursor-pointer">
                        {preview ? (
                          <>
                            <img src={preview} alt={`Miniatura ${idx}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={(e) => { 
                                e.preventDefault();
                                e.stopPropagation(); 
                                onRemoveAdditionalImage(idx); 
                              }}
                              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-red-600"
                            >
                              <X size={14} />
                            </button>
                          </>
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/10">
                            <Plus size={24} />
                          </div>
                        )}
                        <input
                          type="file"
                          onChange={(e) => onAdditionalFileChange(idx, e)}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                          accept="image/*"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Nome do Produto</label>
                    <input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/30 transition-all outline-none"
                      placeholder="Ex: Camiseta Oversized"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Preço (R$)</label>
                      <input
                        required
                        value={formData.price}
                        onChange={onPriceChange}
                        data-field="price"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/30 transition-all outline-none"
                        placeholder="0,00"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Categoria</label>
                      <select
                        required
                        value={formData.category_id}
                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value, subcategory_id: '' })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/30 transition-all outline-none appearance-none"
                      >
                        <option value="" className="bg-zinc-900">Selecione...</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id} className="bg-zinc-900">{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Subcategoria</label>
                    <select
                      value={formData.subcategory_id}
                      onChange={(e) => setFormData({ ...formData, subcategory_id: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/30 transition-all outline-none appearance-none"
                      disabled={!formData.category_id || loadingSubcategories}
                    >
                      <option value="" className="bg-zinc-900">
                        {loadingSubcategories ? 'Carregando...' : 'Selecione...'}
                      </option>
                      {subcategories.map((s) => (
                        <option key={s.id} value={s.id} className="bg-zinc-900">{s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Descrição</label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/30 transition-all outline-none h-24 resize-none"
                      placeholder="Descreva o produto..."
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-col gap-3 ml-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-white/40">Tamanhos Disponíveis</label>
                      <div className="flex gap-2">
                        {[
                          { id: 'standard', label: 'Padrão' },
                          { id: 'kids', label: 'Infantil' },
                          { id: 'boots', label: 'Numeração' }
                        ].map((grid) => (
                          <button
                            key={grid.id}
                            type="button"
                            onClick={() => handleGridSwitch(grid.id as any)}
                            className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-all ${
                              activeSizeGrid === grid.id
                                ? 'bg-white text-black border-white' 
                                : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30'
                            }`}
                          >
                            {grid.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentSizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => onToggleSize(size)}
                          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
                            formData.sizes.split(',').map((s: string) => s.trim()).includes(size)
                              ? 'bg-white text-black border-white shadow-lg shadow-white/10'
                              : 'bg-white/5 text-white/40 border-white/10 hover:border-white/30'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                        formData.featured 
                          ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500' 
                          : 'bg-white/5 border-white/10 text-white/40'
                      }`}
                    >
                      <Star size={18} fill={formData.featured ? 'currentColor' : 'none'} />
                      <span className="text-xs font-bold uppercase tracking-widest">Destaque</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, fast_delivery: !formData.fast_delivery })}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                        formData.fast_delivery 
                          ? 'bg-green-500/10 border-green-500/50 text-green-500' 
                          : 'bg-white/5 border-white/10 text-white/40'
                      }`}
                    >
                      <Truck size={18} />
                      <span className="text-xs font-bold uppercase tracking-widest">Rápida</span>
                    </button>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-white/40">Personalização</label>
                        <p className="text-[10px] text-white/20">Permitir nome e número no produto</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, allow_personalization: !formData.allow_personalization })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          formData.allow_personalization ? 'bg-white' : 'bg-white/10'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                            formData.allow_personalization ? 'translate-x-6 bg-black' : 'translate-x-1 bg-white'
                          }`}
                        />
                      </button>
                    </div>

                    {formData.allow_personalization && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-2"
                      >
                        <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Valor da Personalização (R$)</label>
                        <input
                          value={formData.personalization_price}
                          onChange={(e) => onPriceChange(e as any)}
                          onFocus={() => {
                            // This is a hack to tell the handler which field to update
                            // In a real app we'd pass the field name to onPriceChange
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/30 transition-all outline-none"
                          placeholder="0,00"
                          data-field="personalization_price"
                        />
                      </motion.div>
                    )}
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
                    'Salvar Produto'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
