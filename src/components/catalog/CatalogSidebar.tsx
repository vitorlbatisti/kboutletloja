import React from 'react';
import { Category, SubCategory } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

interface CatalogSidebarProps {
  categories: Category[];
  subcategories: SubCategory[];
  activeCategory: string;
  activeSubCategory: string;
  setSearchParams: (params: any) => void;
  sortBy: string;
  setSortBy: (sort: any) => void;
}

export const CatalogSidebar: React.FC<CatalogSidebarProps> = ({
  categories,
  subcategories,
  activeCategory,
  activeSubCategory,
  setSearchParams,
  sortBy,
  setSortBy
}) => {
  return (
    <aside className="lg:w-64 flex-shrink-0">
      <div className="lg:sticky lg:top-48 space-y-8">
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
              const catSubcategories = subcategories.filter(s => s.category_id === cat.id);
              
              return (
                <div key={cat.id} className="flex flex-col lg:space-y-1">
                  <button
                    onClick={() => setSearchParams({ category: cat.id })}
                    className={`px-6 lg:px-4 py-3 rounded-full lg:rounded-xl text-[10px] lg:text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                      isActive ? 'bg-white text-black shadow-lg' : 'bg-secondary text-muted hover:text-white hover:bg-white/5 border border-white/5'
                    }`}
                  >
                    {cat.name}
                  </button>
                  
                  <AnimatePresence>
                    {isActive && catSubcategories.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="hidden lg:flex overflow-hidden flex-col gap-1 pl-4 pt-1 pb-2"
                      >
                        <button
                          onClick={() => setSearchParams({ category: cat.id })}
                          className={`text-left px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                            activeSubCategory === 'all' ? 'text-white' : 'text-muted hover:text-white'
                          }`}
                        >
                          • Todas
                        </button>
                        {catSubcategories.map(sub => (
                          <button
                            key={sub.id}
                            onClick={() => setSearchParams({ category: cat.id, subcategory: sub.id })}
                            className={`text-left px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                              activeSubCategory === sub.id ? 'text-white' : 'text-muted hover:text-white'
                            }`}
                          >
                            • {sub.name}
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

        <div className="lg:hidden">
          {activeCategory !== 'all' && subcategories.filter(s => s.category_id === activeCategory).length > 0 && (
            <div className="flex flex-col gap-4 pt-4 border-t border-white/5">
              <h3 className="text-[10px] font-bold text-muted uppercase tracking-[0.3em] ml-1">Subcategorias</h3>
              <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
                <button
                  onClick={() => setSearchParams({ category: activeCategory })}
                  className={`px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border border-white/5 ${
                    activeSubCategory === 'all' ? 'bg-white text-black shadow-lg' : 'bg-secondary text-muted hover:text-white'
                  }`}
                >
                  Todas
                </button>
                {subcategories
                  .filter(s => s.category_id === activeCategory)
                  .map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => setSearchParams({ category: activeCategory, subcategory: sub.id })}
                      className={`px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border border-white/5 ${
                        activeSubCategory === sub.id ? 'bg-white text-black shadow-lg' : 'bg-secondary text-muted hover:text-white'
                      }`}
                    >
                      {sub.name}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

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
  );
};
