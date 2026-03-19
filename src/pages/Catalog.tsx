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
      
      const { data } = await query.order('created_at', { ascending: false });
      if (data) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, [activeCategory]);

  const filteredProducts = products.filter(p => 
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Catálogo</h1>
          <p className="text-zinc-500 mt-2">Explore nossa coleção completa</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full focus:outline-none focus:border-zinc-500 transition-colors"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-full border transition-all ${showFilters ? 'bg-white text-black border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}
          >
            <Filter size={20} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-12"
          >
            <div className="flex flex-wrap gap-2 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
              <button
                onClick={() => setSearchParams({})}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === 'all' ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                Todos
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSearchParams({ categoria: cat.id })}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat.id ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="aspect-[3/4] bg-zinc-900 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-zinc-500 text-lg">Nenhum produto encontrado.</p>
          <button 
            onClick={() => { setSearchTerm(''); setSearchParams({}); }}
            className="mt-4 text-white hover:underline"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
};
