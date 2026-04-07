import React from 'react';
import { Product, Category, SubCategory } from '../../types';
import { X, ImageIcon, Star, Truck, Clock, RefreshCw, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const STANDARD_SIZES = ['P', 'M', 'G', 'GG', 'G1', 'G2', 'G3'];
const KIDS_SIZES = ['2 anos', '4 anos', '6 anos', '8 anos', '10 anos', '12 anos'];

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
  onRemoveMainImage: () => void;
  additionalImagePreviews: (string | null)[];
  onAdditionalFileChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAdditionalImage: (index: number) => void;
  onPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleSize: (size: string) => void;
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
  onRemoveMainImage,
  additionalImagePreviews,
  onAdditionalFileChange,
  onRemoveAdditionalImage,
  onPriceChange,
  onToggleSize
}) => {
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
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                          <span className="text-sm font-bold text-white">Trocar Imagem</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); onRemoveMainImage(); }}
                          className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-xl opacity-100 transition-opacity z-20 hover:bg-red-600"
                        >
                          <X size={20} />
                        </button>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/20 pointer-events-none">
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
                            <img src={preview} alt={`Extra ${idx}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); onRemoveAdditionalImage(idx); }}
                              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-100 transition-opacity z-20 hover:bg-red-600"
                            >
                              <X size={14} />
                            </button>
                          </>
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/10 pointer-events-none">
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
                      disabled={!formData.category_id}
                    >
                      <option value="" className="bg-zinc-900">Selecione...</option>
                      {subcategories
                        .filter(s => s.category_id === formData.category_id)
                        .map((s) => (
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
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-white/40">Tamanhos Disponíveis</label>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, is_kids_kit: !formData.is_kids_kit, sizes: '' })}
                        className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border transition-all ${
                          formData.is_kids_kit 
                            ? 'bg-white text-black border-white' 
                            : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30'
                        }`}
                      >
                        Kit Infantil
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(formData.is_kids_kit ? KIDS_SIZES : STANDARD_SIZES).map((size) => (
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
                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Cores</label>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, allow_colors: !formData.allow_colors })}
                        className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                          formData.allow_colors 
                            ? 'bg-blue-500/10 border-blue-500/50 text-blue-500' 
                            : 'bg-white/5 border-white/10 text-white/40'
                        }`}
                      >
                        <span className="text-xs font-bold uppercase tracking-widest">Habilitar Cores</span>
                      </button>
                      {formData.allow_colors && (
                        <input
                          value={formData.colors}
                          onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-white/30 transition-all outline-none"
                          placeholder="Azul, Vermelho, Preto..."
                        />
                      )}
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Personalização</label>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, allow_personalization: !formData.allow_personalization })}
                        className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                          formData.allow_personalization 
                            ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500' 
                            : 'bg-white/5 border-white/10 text-white/40'
                        }`}
                      >
                        <span className="text-xs font-bold uppercase tracking-widest">Habilitar</span>
                      </button>
                      {formData.allow_personalization && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-white/20 ml-1">Preço Extra (R$)</label>
                          <input
                            value={formData.personalization_price}
                            onChange={(e) => {
                              const digits = e.target.value.replace(/\D/g, '');
                              const amount = (parseInt(digits || '0') / 100).toFixed(2);
                              const [integer, decimal] = amount.split('.');
                              const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                              setFormData({ ...formData, personalization_price: `${formattedInteger},${decimal}` });
                            }}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-white/30 transition-all outline-none"
                            placeholder="0,00"
                          />
                        </div>
                      )}
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
