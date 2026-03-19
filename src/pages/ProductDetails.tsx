import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { useCart } from '../CartContext';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowLeft, Check } from 'lucide-react';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
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
    <div className="max-w-7xl mx-auto px-4 pt-32 pb-20 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-[3/4] bg-zinc-900 rounded-3xl" />
        <div className="space-y-6">
          <div className="h-10 bg-zinc-900 rounded w-3/4" />
          <div className="h-6 bg-zinc-900 rounded w-1/4" />
          <div className="h-32 bg-zinc-900 rounded" />
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 pt-32 pb-20 text-center">
      <h2 className="text-2xl font-bold">Produto não encontrado</h2>
      <button onClick={() => navigate('/catalogo')} className="mt-4 text-zinc-400 hover:text-white">Voltar ao catálogo</button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 pt-32 pb-20">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={20} /> Voltar
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="aspect-[3/4] rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800"
        >
          <img 
            src={product.imagem_url} 
            alt={product.nome} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <h1 className="text-4xl font-bold tracking-tight mb-2">{product.nome}</h1>
          <p className="text-2xl font-bold text-white mb-6">R$ {product.preco.toFixed(2)}</p>
          
          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-zinc-400 leading-relaxed">{product.descricao}</p>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">Tamanho</h3>
            <div className="flex flex-wrap gap-3">
              {product.tamanhos?.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[48px] h-12 flex items-center justify-center rounded-xl border font-bold transition-all ${
                    selectedSize === size 
                      ? 'bg-white text-black border-white' 
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-500'
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
            className={`w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all btn-glow ${
              added ? 'bg-emerald-500 text-white' : 'bg-white text-black hover:bg-zinc-200'
            }`}
          >
            {added ? (
              <>
                <Check size={20} /> Adicionado à Sacola
              </>
            ) : (
              <>
                <ShoppingBag size={20} /> Adicionar à Sacola
              </>
            )}
          </button>

          <div className="mt-12 p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800">
            <h4 className="font-semibold mb-2">Informações de Entrega</h4>
            <p className="text-sm text-zinc-500">
              Enviamos para todo o Brasil via Correios ou Transportadora. 
              Retirada em mãos disponível em Chapecó-SC.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
