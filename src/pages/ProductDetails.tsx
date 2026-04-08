import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductDetails } from '../hooks/useProductDetails';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowLeft, Check, Star, Truck } from 'lucide-react';

export const ProductDetails = () => {
  const navigate = useNavigate();
  const {
    product,
    loading,
    selectedSize,
    setSelectedSize,
    selectedColor,
    setSelectedColor,
    personalizationText,
    setPersonalizationText,
    personalizationNumber,
    setPersonalizationNumber,
    added,
    activeImage,
    setActiveImage,
    handleAddToCart
  } = useProductDetails();

  if (loading) return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-36 md:pt-48 pb-32 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
        <div className="aspect-square md:aspect-[3/4] bg-secondary rounded-2xl border border-white/5" />
        <div className="space-y-6 md:space-y-8">
          <div className="h-12 md:h-16 bg-secondary rounded-2xl w-3/4" />
          <div className="h-6 md:h-8 bg-secondary rounded-xl w-1/4" />
          <div className="h-32 md:h-40 bg-secondary rounded-2xl" />
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-32 md:pt-48 pb-32 text-center">
      <h2 className="text-3xl md:text-4xl mb-8">Produto não encontrado</h2>
      <button 
        onClick={() => navigate('/catalogo')} 
        className="px-8 py-3 bg-white text-black rounded-full font-bold hover:scale-105 transition-all"
      >
        Voltar ao Catálogo
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-36 md:pt-48 pb-24">
      <button 
        onClick={() => navigate(-1)}
        className="group flex items-center gap-2 text-muted hover:text-white mb-6 md:mb-8 transition-all font-bold uppercase tracking-widest text-[9px] md:text-[10px]"
      >
        <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-1 md:size-3.5" /> Voltar
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 lg:gap-16 items-start">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4 md:space-y-6"
        >
          <div className="aspect-square md:aspect-auto md:h-[600px] rounded-2xl overflow-hidden bg-secondary border border-white/5 shadow-2xl">
            <img 
              src={activeImage} 
              alt={product.name} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000 ease-out"
            />
          </div>

          {product.images && product.images.length > 0 && (
            <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setActiveImage(product.image_url)}
                className={`w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                  activeImage === product.image_url ? 'border-white scale-105 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img src={product.image_url} alt="Principal" className="w-full h-full object-cover" />
              </button>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImage === img ? 'border-white scale-105 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Extra ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <div className="mb-6 md:mb-8">
            <div className="flex flex-wrap gap-2 md:gap-3 mb-3 md:mb-4">
              <span className="inline-block px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] md:text-[9px] font-bold tracking-[0.1em] md:tracking-[0.2em] uppercase text-emerald-500">
                Disponível em Estoque
              </span>
              {product.featured && (
                <span className="inline-block px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[8px] md:text-[9px] font-bold tracking-[0.1em] md:tracking-[0.2em] uppercase text-amber-500 flex items-center gap-1 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                  <Star size={12} fill="currentColor" className="md:size-3.5" />
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-5xl mb-2 md:mb-3 font-bold leading-tight text-white">{product.name}</h1>
            <div className="flex items-center gap-3 md:gap-4">
              <p className="text-xl md:text-2xl font-black text-white tracking-tighter">R$ {product.price.toFixed(2)}</p>
              <span className="text-[8px] md:text-[10px] font-bold text-gray-base uppercase tracking-widest bg-secondary px-2 py-0.5 rounded">Preço à vista</span>
            </div>
          </div>
          
          <div className="prose prose-invert max-w-none mb-8 md:mb-10">
            <p className="text-muted text-sm md:text-base leading-relaxed font-medium border-l-2 border-white/10 pl-4">{product.description}</p>
          </div>

          <div className="mb-8 md:mb-10">
            <h3 className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-muted mb-3 md:mb-4">Selecione o Tamanho</h3>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {product.sizes?.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[48px] md:min-w-[56px] h-12 md:h-14 flex items-center justify-center rounded-xl border-2 font-black transition-all duration-300 text-xs md:text-sm ${
                    selectedSize === size 
                      ? 'bg-white text-black border-white shadow-xl scale-105' 
                      : 'bg-secondary text-muted border-white/5 hover:border-white/20'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {product.allow_colors && product.colors && product.colors.length > 0 && (
            <div className="mb-8 md:mb-10">
              <h3 className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-muted mb-3 md:mb-4">Selecione a Cor</h3>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 md:px-6 h-12 md:h-14 flex items-center justify-center rounded-xl border-2 font-black transition-all duration-300 text-xs md:text-sm uppercase tracking-widest ${
                      selectedColor === color 
                        ? 'bg-white text-black border-white shadow-xl scale-105' 
                        : 'bg-secondary text-muted border-white/5 hover:border-white/20'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.allow_personalization && (
            <div className="mb-8 md:mb-10 space-y-4 md:space-y-6 bg-secondary/50 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-white/5">
              <div className="flex items-center justify-between mb-1 md:mb-2">
                <h3 className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-white font-bold">Personalização</h3>
                {product.personalization_price && product.personalization_price > 0 && (
                  <span className="text-[8px] md:text-[10px] bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-full font-bold">
                    + R$ {product.personalization_price.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[8px] md:text-[9px] uppercase tracking-widest text-muted font-bold ml-1">Nome na Peça</label>
                  <input
                    type="text"
                    maxLength={15}
                    placeholder="Ex: SILVA"
                    value={personalizationText}
                    onChange={(e) => setPersonalizationText(e.target.value.toUpperCase())}
                    className="w-full bg-secondary border border-white/5 rounded-xl px-4 py-3 md:py-4 text-xs md:text-sm text-white focus:border-white/20 transition-all outline-none font-bold placeholder:text-white/10"
                  />
                </div>
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[8px] md:text-[9px] uppercase tracking-widest text-muted font-bold ml-1">Número</label>
                  <input
                    type="text"
                    maxLength={2}
                    placeholder="00"
                    value={personalizationNumber}
                    onChange={(e) => setPersonalizationNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-secondary border border-white/5 rounded-xl px-4 py-3 md:py-4 text-xs md:text-sm text-white focus:border-white/20 transition-all outline-none font-bold placeholder:text-white/10"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize || (product.allow_colors && !selectedColor)}
              className={`flex-1 h-16 md:h-20 flex items-center justify-center gap-3 md:gap-4 rounded-xl md:rounded-2xl font-black text-base md:text-lg transition-all duration-500 shadow-2xl ${
                added 
                  ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                  : 'bg-white text-black hover:scale-[1.02] active:scale-[0.98] shadow-white/10'
              } disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed`}
            >
              {added ? (
                <>
                  <Check size={20} className="md:size-6" /> ADICIONADO
                </>
              ) : (
                <>
                  <ShoppingBag size={20} className="md:size-6" /> ADICIONAR AO CARRINHO
                </>
              )}
            </button>
          </div>

          <div className="mt-8 md:mt-12 grid grid-cols-2 gap-4 md:gap-6 border-t border-white/5 pt-8 md:pt-12">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-secondary rounded-lg md:rounded-xl flex items-center justify-center text-white/40">
                <Truck size={16} className="md:size-5" />
              </div>
              <div>
                <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-white mb-0.5">Entrega Segura</p>
                <p className="text-[8px] md:text-[10px] text-muted font-medium">Para todo o Brasil</p>
              </div>
            </div>
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-secondary rounded-lg md:rounded-xl flex items-center justify-center text-white/40">
                <Check size={16} className="md:size-5" />
              </div>
              <div>
                <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-white mb-0.5">Qualidade Premium</p>
                <p className="text-[8px] md:text-[10px] text-muted font-medium">Garantia KB Outlet</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
