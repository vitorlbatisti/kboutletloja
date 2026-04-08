import React from 'react';
import { useCatalog } from '../hooks/useCatalog';
import { ProductCard } from '../components/ProductCard';
import { Search, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Catalog = () => {
  const {
    products,
    categories,
    subcategories,
    loading,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    activeCategory,
    activeSubCategory,
    setSearchParams,
    error
  } = useCatalog();

  const activeCategoryData = categories.find(c => c.id === activeCategory);
  const activeSubcategories = subcategories.filter(s => s.category_id === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-6 pt-40 md:pt-48 pb-32">
      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium flex items-center justify-between">
          <span>{error}</span>
          <button 
            onClick={() => window.location.reload()}
            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
          >
            Tentar Novamente
          </button>
        </div>
      )}
      {/* Header & Search */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
        <div className="max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl mb-6 font-bebas tracking-tight"
          >
            CATÁLOGO <br /> <span className="text-gray-base">COMPLETO.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted text-lg md:text-xl leading-relaxed font-medium"
          >
            Explore nossa curadoria exclusiva de peças premium, selecionadas para quem busca o melhor do streetwear e lifestyle.
          </motion.p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
            <input
              type="text"
              placeholder="Buscar no catálogo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-secondary border border-white/5 rounded-2xl pl-12 pr-12 py-4 text-white focus:border-white/20 transition-all outline-none font-medium"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none w-full sm:w-48 bg-secondary border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-white/20 transition-all outline-none font-bold uppercase tracking-widest text-[10px] cursor-pointer"
            >
              <option value="newest">Novidades</option>
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      {/* Categories Navigation */}
      <div className="space-y-6 mb-12">
        {/* Main Categories */}
        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6 lg:mx-0 lg:px-0">
          <button
            onClick={() => setSearchParams({})}
            className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border ${
              activeCategory === 'all' 
                ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                : 'bg-secondary text-muted border-white/5 hover:text-white hover:border-white/20'
            }`}
          >
            Todos
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSearchParams({ category: cat.id })}
              className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border ${
                activeCategory === cat.id 
                  ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                  : 'bg-secondary text-muted border-white/5 hover:text-white hover:border-white/20'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Subcategories (Conditional) */}
        <AnimatePresence mode="wait">
          {activeCategory !== 'all' && activeSubcategories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6 lg:mx-0 lg:px-0"
            >
              <button
                onClick={() => setSearchParams({ category: activeCategory })}
                className={`px-6 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${
                  activeSubCategory === 'all' 
                    ? 'bg-white/10 text-white border-white/20' 
                    : 'bg-transparent text-muted border-white/5 hover:text-white hover:border-white/10'
                }`}
              >
                Todas as {activeCategoryData?.name}
              </button>
              {activeSubcategories.map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setSearchParams({ category: activeCategory, subcategory: sub.id })}
                  className={`px-6 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${
                    activeSubCategory === sub.id 
                      ? 'bg-white/10 text-white border-white/20' 
                      : 'bg-transparent text-muted border-white/5 hover:text-white hover:border-white/10'
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
            <div key={n} className="aspect-square bg-secondary animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          <AnimatePresence mode="popLayout">
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-32 bg-secondary rounded-[3rem] border border-white/5">
          <Search size={48} className="mx-auto text-muted mb-6 opacity-20" />
          <h3 className="text-2xl font-bold mb-2">Nenhum produto encontrado</h3>
          <p className="text-muted">Tente ajustar seus filtros ou busca.</p>
          <button 
            onClick={() => { setSearchParams({}); setSearchTerm(''); }}
            className="mt-8 text-sm font-bold uppercase tracking-widest text-white hover:underline"
          >
            Limpar todos os filtros
          </button>
        </div>
      )}
    </div>
  );
};
