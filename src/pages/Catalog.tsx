import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product, Category, SubCategory } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const activeCategory = searchParams.get('categoria') || 'all';
  const activeSubCategory = searchParams.get('subcategoria') || 'all';

  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');

  useEffect(() => {
    const fetchData = async () => {
      const [catRes, subRes] = await Promise.all([
        supabase.from('categorias').select('*'),
        supabase.from('subcategorias').select('*')
      ]);
      if (catRes.data) setCategories(catRes.data);
      if (subRes.data) setSubcategories(subRes.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase.from('produtos').select('*');
      
      if (activeCategory !== 'all') {
        query = query.eq('categoria_id', activeCategory);
      }

      if (activeSubCategory !== 'all') {
        query = query.eq('subcategoria_id', activeSubCategory);
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
  }, [activeCategory, activeSubCategory, sortBy]);

  const filteredProducts = products.filter(p => 
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 pt-48 pb-32">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar - Categorias e Subcategorias */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="lg:sticky lg:top-48 space-y-8">
            {/* Mobile: Horizontal Scroll | Desktop: Vertical List */}
            <div className="overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide">
              <h3 className="hidden lg:block text-[10px] font-bold text-muted uppercase tracking-[0.3em] mb-6 ml-1">Categorias</h3>
              <div className="flex lg:flex-col gap-2 min-w-max lg:min-w-0">
                <button
                  onClick={() => setSearchParams({})}
                  className={`px-6 lg:px-4 py-3 rounded-full lg:rounded-xl text-[10px] lg:text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                    activeCategory === 'all' ? 'bg-white text-black shadow-lg' : 'bg-secondary text-muted hover:text-white hover:bg-white/5 border border-white/5'
                  }`}
                >
                  Todos
                </button>
                {categories.map(cat => {
                  const isActive = activeCategory === cat.id;
                  const catSubcategories = subcategories.filter(s => s.categoria_id === cat.id);
                  
                  return (
                    <div key={cat.id} className="flex flex-col lg:space-y-1">
                      <button
                        onClick={() => setSearchParams({ categoria: cat.id })}
                        className={`px-6 lg:px-4 py-3 rounded-full lg:rounded-xl text-[10px] lg:text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                          isActive ? 'bg-white text-black shadow-lg' : 'bg-secondary text-muted hover:text-white hover:bg-white/5 border border-white/5'
                        }`}
                      >
                        {cat.nome}
                      </button>
                      
                      {/* Subcategorias aninhadas - Desktop: Vertical | Mobile: Hidden (or show below) */}
                      <AnimatePresence>
                        {isActive && catSubcategories.length > 0 && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="hidden lg:flex overflow-hidden flex-col gap-1 pl-4 pt-1 pb-2"
                          >
                            <button
                              onClick={() => setSearchParams({ categoria: cat.id })}
                              className={`text-left px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                                activeSubCategory === 'all' ? 'text-white' : 'text-muted hover:text-white'
                              }`}
                            >
                              • Todas
                            </button>
                            {catSubcategories.map(sub => (
                              <button
                                key={sub.id}
                                onClick={() => setSearchParams({ categoria: cat.id, subcategoria: sub.id })}
                                className={`text-left px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                                  activeSubCategory === sub.id ? 'text-white' : 'text-muted hover:text-white'
                                }`}
                              >
                                • {sub.nome}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Subcategorias Mobile (Aparecem abaixo das categorias quando uma está ativa) */}
            <div className="lg:hidden">
              {activeCategory !== 'all' && subcategories.filter(s => s.categoria_id === activeCategory).length > 0 && (
                <div className="flex flex-col gap-4 pt-4 border-t border-white/5">
                  <h3 className="text-[10px] font-bold text-muted uppercase tracking-[0.3em] ml-1">Subcategorias</h3>
                  <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
                    <button
                      onClick={() => setSearchParams({ categoria: activeCategory })}
                      className={`px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border border-white/5 ${
                        activeSubCategory === 'all' ? 'bg-white text-black shadow-lg' : 'bg-secondary text-muted hover:text-white'
                      }`}
                    >
                      Todas
                    </button>
                    {subcategories
                      .filter(s => s.categoria_id === activeCategory)
                      .map(sub => (
                        <button
                          key={sub.id}
                          onClick={() => setSearchParams({ categoria: activeCategory, subcategoria: sub.id })}
                          className={`px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border border-white/5 ${
                            activeSubCategory === sub.id ? 'bg-white text-black shadow-lg' : 'bg-secondary text-muted hover:text-white'
                          }`}
                        >
                          {sub.nome}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Ordenação no Sidebar para Desktop */}
            <div className="hidden lg:block pt-8 border-t border-white/5">
              <h3 className="text-[10px] font-bold text-muted uppercase tracking-[0.3em] mb-6 ml-1">Ordenar por</h3>
              <div className="flex flex-col gap-2">
                {[
                  { id: 'newest', label: 'Novidades' },
                  { id: 'price-asc', label: 'Menor Preço' },
                  { id: 'price-desc', label: 'Maior Preço' }
                ].map(option => (
                  <button
                    key={option.id}
                    onClick={() => setSortBy(option.id as any)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                      sortBy === option.id ? 'bg-white/10 text-white' : 'text-muted hover:text-white'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Conteúdo Principal */}
        <div className="flex-1">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-16">
            <div className="max-w-2xl">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl mb-6"
              >
                CATÁLOGO <br /> <span className="text-gray-base">COMPLETO.</span>
              </motion.h1>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                <input
                  type="text"
                  placeholder="O que você procura?"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-secondary border border-white/5 rounded-full focus:outline-none focus:border-white/20 transition-all text-sm font-medium placeholder:text-zinc-800"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              
              {/* Seletor de Ordenação Mobile */}
              <div className="lg:hidden w-full">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-6 py-4 bg-secondary border border-white/5 rounded-full text-sm font-bold uppercase tracking-widest outline-none focus:border-white/20 transition-all appearance-none text-center"
                >
                  <option value="newest">Novidades</option>
                  <option value="price-asc">Menor Preço</option>
                  <option value="price-desc">Maior Preço</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="aspect-[3/4] bg-secondary animate-pulse rounded-2xl border border-white/5" />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-40 bg-secondary rounded-2xl border border-white/5">
              <p className="text-muted text-xl font-medium">Nenhum produto encontrado.</p>
              <button 
                onClick={() => { setSearchTerm(''); setSearchParams({}); }}
                className="mt-8 px-8 py-3 bg-white text-black rounded-full font-bold hover:scale-105 transition-all"
              >
                Limpar Filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
