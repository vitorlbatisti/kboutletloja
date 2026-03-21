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
    addToCart(product, selectedSize);
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
    <div className="max-w-7xl mx-auto px-6 pt-40 pb-32">
      <button 
        onClick={() => navigate(-1)}
        className="group flex items-center gap-3 text-zinc-500 hover:text-white mb-12 transition-all font-bold uppercase tracking-widest text-xs"
      >
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> Voltar
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="aspect-[3/4] rounded-[3rem] overflow-hidden bg-zinc-950 border border-white/5 shadow-2xl"
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
          <div className="mb-10">
            <span className="inline-block px-4 py-1.5 bg-white/5 border border-white/5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase mb-6 text-zinc-500">
              Disponível em Estoque
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter-extra mb-4 leading-tight">{product.nome}</h1>
            <p className="text-3xl font-bold text-white tracking-tighter">R$ {product.preco.toFixed(2)}</p>
          </div>
          
          <div className="prose prose-invert max-w-none mb-12">
            <p className="text-zinc-400 text-lg leading-relaxed font-medium">{product.descricao}</p>
          </div>

          <div className="mb-12">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-600 mb-6">Selecione o Tamanho</h3>
            <div className="flex flex-wrap gap-4">
              {product.tamanhos?.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[64px] h-16 flex items-center justify-center rounded-2xl border-2 font-black transition-all duration-300 ${
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

          <button
            onClick={handleAddToCart}
            disabled={added}
            className={`w-full py-6 rounded-[2rem] font-black text-lg uppercase tracking-widest flex items-center justify-center gap-4 transition-all duration-500 shadow-2xl ${
              added ? 'bg-emerald-500 text-white scale-95' : 'bg-white text-black hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {added ? (
              <>
                <Check size={24} /> Adicionado
              </>
            ) : (
              <>
                <ShoppingBag size={24} /> Adicionar à Sacola
              </>
            )}
          </button>

          <div className="mt-16 p-10 bg-zinc-950 rounded-[2.5rem] border border-white/5">
            <h4 className="font-bold text-lg mb-4 tracking-tight">Envio & Entrega</h4>
            <p className="text-zinc-500 leading-relaxed font-medium">
              Enviamos para todo o Brasil via Correios ou Transportadora. 
              Retirada em mãos disponível em Chapecó-SC. <br />
              <span className="text-zinc-400 mt-2 block italic">Frete grátis em compras acima de R$ 500.</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
