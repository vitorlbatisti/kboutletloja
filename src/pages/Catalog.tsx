import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Filter, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const activeCategory = searchParams.get('categoria') || 'all';

  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('categorias').select('*');
      if (data) setCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase.from('produtos').select('*');
      
      if (activeCategory !== 'all') {
        query = query.eq('categoria_id', activeCategory);
      }
      
      const { data } = await query;
      if (data) {
        let sorted = [...data];
        if (sortBy === 'newest') sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        if (sortBy === 'price-asc') sorted.sort((a, b) => a.preco - b.preco);
        if (sortBy === 'price-desc') sorted.sort((a, b) => b.preco - a.preco);
        setProducts(sorted);
      }
      setLoading(false);
    };
    fetchProducts();
  }, [activeCategory, sortBy]);

  const filteredProducts = products.filter(p => 
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 pt-40 pb-32">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20">
        <div className="max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tighter-extra mb-6"
          >
            CATÁLOGO <br /> <span className="text-zinc-600">COMPLETO.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-500 text-lg md:text-xl font-medium"
          >
            Explore nossa curadoria exclusiva de peças premium e streetwear.
          </motion.p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="text"
              placeholder="O que você procura?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-zinc-950 border border-white/5 rounded-full focus:outline-none focus:border-white/20 transition-all text-sm font-medium placeholder:text-zinc-700"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="flex-1 sm:w-48 px-6 py-4 bg-zinc-950 border border-white/5 rounded-full text-sm font-bold uppercase tracking-widest outline-none focus:border-white/20 transition-all appearance-none text-center"
            >
              <option value="newest">Novidades</option>
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
            </select>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`p-4 rounded-full border transition-all duration-500 ${showFilters ? 'bg-white text-black border-white shadow-xl' : 'bg-zinc-950 border-white/5 text-zinc-500 hover:text-white'}`}
            >
              <Filter size={20} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-20"
          >
            <div className="flex flex-wrap gap-3 p-8 bg-zinc-950 rounded-[2.5rem] border border-white/5">
              <button
                onClick={() => setSearchParams({})}
                className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  activeCategory === 'all' ? 'bg-white text-black shadow-lg' : 'bg-zinc-900 text-zinc-500 hover:text-white'
                }`}
              >
                Todos
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSearchParams({ categoria: cat.id })}
                  className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                    activeCategory === cat.id ? 'bg-white text-black shadow-lg' : 'bg-zinc-900 text-zinc-500 hover:text-white'
                  }`}
                >
                  {cat.nome}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="aspect-[4/5] bg-zinc-950 animate-pulse rounded-[2rem] border border-white/5" />
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-40 bg-zinc-950 rounded-[3rem] border border-white/5">
          <p className="text-zinc-500 text-xl font-medium">Nenhum produto encontrado.</p>
          <button 
            onClick={() => { setSearchTerm(''); setSearchParams({}); }}
            className="mt-8 px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-zinc-200 transition-all"
          >
            Limpar Filtros
          </button>
        </div>
      )}
    </div>
  );
};
