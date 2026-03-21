import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { useCart } from '../CartContext';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowLeft, Check } from 'lucide-react';

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

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      const { data } = await supabase.from('produtos').select('*').eq('id', id).single();
      if (data) {
        setProduct(data);
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
    <div className="max-w-7xl mx-auto px-6 pt-40 pb-32 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
        <div className="aspect-[3/4] bg-zinc-950 rounded-[3rem] border border-white/5" />
        <div className="space-y-8">
          <div className="h-16 bg-zinc-950 rounded-2xl w-3/4" />
          <div className="h-8 bg-zinc-950 rounded-xl w-1/4" />
          <div className="h-40 bg-zinc-950 rounded-3xl" />
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="max-w-7xl mx-auto px-6 pt-40 pb-32 text-center">
      <h2 className="text-4xl font-bold tracking-tighter mb-8">Produto não encontrado</h2>
      <button 
        onClick={() => navigate('/catalogo')} 
        className="px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-zinc-200 transition-all"
      >
        Voltar ao Catálogo
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-6 pt-32 pb-24">
      <button 
        onClick={() => navigate(-1)}
        className="group flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-all font-bold uppercase tracking-widest text-[10px]"
      >
        <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" /> Voltar
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="aspect-[4/5] md:aspect-auto md:h-[600px] rounded-[2rem] overflow-hidden bg-zinc-950 border border-white/5 shadow-2xl"
        >
          <img 
            src={product.imagem_url} 
            alt={product.nome} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000 ease-out"
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold tracking-[0.2em] uppercase mb-4 text-emerald-500">
              Disponível em Estoque
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter-extra mb-3 leading-tight text-white">{product.nome}</h1>
            <div className="flex items-center gap-4">
              <p className="text-2xl font-black text-white tracking-tighter">R$ {product.preco.toFixed(2)}</p>
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest bg-zinc-900 px-2 py-0.5 rounded">Preço à vista</span>
            </div>
          </div>
          
          <div className="prose prose-invert max-w-none mb-10">
            <p className="text-zinc-400 text-base leading-relaxed font-medium border-l-2 border-white/10 pl-4">{product.descricao}</p>
          </div>

          <div className="mb-10">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 mb-4">Selecione o Tamanho</h3>
            <div className="flex flex-wrap gap-3">
              {product.tamanhos?.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[56px] h-14 flex items-center justify-center rounded-xl border-2 font-black transition-all duration-300 text-sm ${
                    selectedSize === size 
                      ? 'bg-white text-black border-white shadow-xl scale-105' 
                      : 'bg-zinc-950 text-zinc-500 border-white/5 hover:border-white/20'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {product.permite_personalizacao && (
            <div className="mb-10 space-y-5 p-6 bg-zinc-950/50 rounded-3xl border border-white/5">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Personalização (+ R$ {product.preco_personalizacao?.toFixed(2)})</h3>
              
              <div className="space-y-2">
                <label className="text-[9px] text-zinc-400 uppercase tracking-widest ml-1 font-black">Nome / Texto</label>
                <input
                  type="text"
                  placeholder="EX: SEU NOME"
                  value={personalizacaoTexto}
                  onChange={(e) => setPersonalizacaoTexto(e.target.value)}
                  className="w-full px-6 py-4 bg-zinc-950 border border-white/10 rounded-2xl focus:border-white/30 outline-none text-base font-black transition-all placeholder:text-zinc-800 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] text-zinc-400 uppercase tracking-widest ml-1 font-black">Número da Camisa</label>
                <input
                  type="text"
                  placeholder="EX: 10"
                  maxLength={3}
                  value={personalizacaoNumero}
                  onChange={(e) => setPersonalizacaoNumero(e.target.value)}
                  className="w-full px-6 py-4 bg-zinc-950 border border-white/10 rounded-2xl focus:border-white/30 outline-none text-base font-black transition-all placeholder:text-zinc-800 text-white"
                />
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={added}
            className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-500 shadow-xl ${
              added ? 'bg-emerald-500 text-white scale-95' : 'bg-white text-black hover:bg-zinc-200 hover:scale-[1.01] active:scale-[0.99]'
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

          <div className="mt-12 p-8 bg-zinc-950 rounded-[2rem] border border-white/5">
            <h4 className="font-bold text-base mb-3 tracking-tight text-white">Envio & Entrega</h4>
            <p className="text-zinc-500 text-sm leading-relaxed font-medium">
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
