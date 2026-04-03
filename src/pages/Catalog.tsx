import React from 'react';
import { useCatalog } from '../hooks/useCatalog';
import { ProductCard } from '../components/ProductCard';
import { CatalogSidebar } from '../components/catalog/CatalogSidebar';
import { Search, X } from 'lucide-react';
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
    setSearchParams
  } = useCatalog();

  return (
    <div className="max-w-7xl mx-auto px-6 pt-48 pb-32">
      <div className="flex flex-col lg:flex-row gap-12">
        <CatalogSidebar
          categories={categories}
          subcategories={subcategories}
          activeCategory={activeCategory}
          activeSubCategory={activeSubCategory}
          setSearchParams={setSearchParams}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

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
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-muted text-lg md:text-xl leading-relaxed"
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
                  className="w-full bg-secondary border border-white/5 rounded-2xl pl-12 pr-12 py-4 text-white focus:border-white/20 transition-all outline-none"
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
            </div>
          </div>

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
      </div>
    </div>
  );
};
