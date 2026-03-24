import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { useCart } from '../CartContext';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowLeft, Check, Star } from 'lucide-react';

export const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [personalizacaoTexto, setPersonalizacaoTexto] = useState('');
  const [personalizacaoNumero, setPersonalizacaoNumero] = useState('');
  const [added, setAdded] = useState(false);

  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      const { data } = await supabase.from('produtos').select('*').eq('id', id).single();
      if (data) {
        setProduct(data);
        setActiveImage(data.imagem_url);
        if (data.tamanhos?.length > 0) setSelectedSize(data.tamanhos[0]);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || !selectedSize) return;
    addToCart(product, selectedSize, personalizacaoTexto, personalizacaoNumero);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div className="max-w-6xl mx-auto px-6 pt-48 pb-32 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
        <div className="aspect-[3/4] bg-secondary rounded-2xl border border-white/5" />
        <div className="space-y-8">
          <div className="h-16 bg-secondary rounded-2xl w-3/4" />
          <div className="h-8 bg-secondary rounded-xl w-1/4" />
          <div className="h-40 bg-secondary rounded-2xl" />
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="max-w-6xl mx-auto px-6 pt-48 pb-32 text-center">
      <h2 className="text-4xl mb-8">Produto não encontrado</h2>
      <button 
        onClick={() => navigate('/catalogo')} 
        className="px-8 py-3 bg-white text-black rounded-full font-bold hover:scale-105 transition-all"
      >
        Voltar ao Catálogo
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-6 pt-48 pb-24">
      <button 
        onClick={() => navigate(-1)}
        className="group flex items-center gap-2 text-muted hover:text-white mb-8 transition-all font-bold uppercase tracking-widest text-[10px]"
      >
        <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" /> Voltar
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="aspect-[4/5] md:aspect-auto md:h-[600px] rounded-2xl overflow-hidden bg-secondary border border-white/5 shadow-2xl">
            <img 
              src={activeImage} 
              alt={product.nome} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000 ease-out"
            />
          </div>

          {/* Thumbnails */}
          {product.imagens_adicionais && product.imagens_adicionais.length > 0 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setActiveImage(product.imagem_url)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                  activeImage === product.imagem_url ? 'border-white scale-105 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img src={product.imagem_url} alt="Principal" className="w-full h-full object-cover" />
              </button>
              {product.imagens_adicionais.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
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
          <div className="mb-8">
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold tracking-[0.2em] uppercase text-emerald-500">
                Disponível em Estoque
              </span>
              {product.destaque && (
                <span className="inline-block px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-[9px] font-bold tracking-[0.2em] uppercase text-amber-500 flex items-center gap-1 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                  <Star size={14} fill="currentColor" />
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl mb-3 leading-tight text-white">{product.nome}</h1>
            <div className="flex items-center gap-4">
              <p className="text-2xl font-black text-white tracking-tighter">R$ {product.preco.toFixed(2)}</p>
              <span className="text-[10px] font-bold text-gray-base uppercase tracking-widest bg-secondary px-2 py-0.5 rounded">Preço à vista</span>
            </div>
          </div>
          
          <div className="prose prose-invert max-w-none mb-10">
            <p className="text-muted text-base leading-relaxed font-medium border-l-2 border-white/10 pl-4">{product.descricao}</p>
          </div>

          <div className="mb-10">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-muted mb-4">Selecione o Tamanho</h3>
            <div className="flex flex-wrap gap-3">
              {product.tamanhos?.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[56px] h-14 flex items-center justify-center rounded-xl border-2 font-black transition-all duration-300 text-sm ${
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

          {product.permite_personalizacao && (
            <div className="mb-10 space-y-5 p-6 bg-secondary/50 rounded-2xl border border-white/5">
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-white">Personalização (+ R$ {product.preco_personalizacao?.toFixed(2)})</h3>
              
              <div className="space-y-2">
                <label className="text-[9px] text-muted uppercase tracking-widest ml-1 font-black">Nome / Texto</label>
                <input
                  type="text"
                  placeholder="EX: SEU NOME"
                  value={personalizacaoTexto}
                  onChange={(e) => setPersonalizacaoTexto(e.target.value)}
                  className="w-full px-6 py-4 bg-secondary border border-white/10 rounded-2xl focus:border-white/30 outline-none text-base font-black transition-all placeholder:text-zinc-800 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] text-muted uppercase tracking-widest ml-1 font-black">Número da Camisa</label>
                <input
                  type="text"
                  placeholder="EX: 10"
                  maxLength={3}
                  value={personalizacaoNumero}
                  onChange={(e) => setPersonalizacaoNumero(e.target.value)}
                  className="w-full px-6 py-4 bg-secondary border border-white/10 rounded-2xl focus:border-white/30 outline-none text-base font-black transition-all placeholder:text-zinc-800 text-white"
                />
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={added}
            className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-500 shadow-xl ${
              added ? 'bg-emerald-500 text-white scale-95' : 'bg-white text-black hover:scale-105 active:scale-[0.99]'
            }`}
          >
            {added ? (
              <>
                <Check size={20} /> Adicionado
              </>
            ) : (
              <>
                <ShoppingBag size={20} /> Adicionar à Sacola
              </>
            )}
          </button>

          <div className="mt-12 p-8 bg-secondary rounded-2xl border border-white/5">
            <h4 className="font-bold text-base mb-3 tracking-tight text-white">Envio & Entrega</h4>
            <p className="text-muted text-sm leading-relaxed font-medium">
              Enviamos para todo o Brasil via Correios ou Transportadora. 
              Retirada em mãos disponível em Novo Horizonte-SC. <br />
              <span className="text-emerald-500/80 mt-2 block italic font-bold">Frete grátis em compras acima de R$ 500.</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
