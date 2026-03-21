import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, ShoppingBag, Instagram, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      const [prodRes, catRes] = await Promise.all([
        supabase.from('produtos').select('*').eq('destaque', true).limit(8).order('created_at', { ascending: false }),
        supabase.from('categorias').select('*')
      ]);

      if (prodRes.data && prodRes.data.length > 0) {
        setFeaturedProducts(prodRes.data);
      } else {
        // Fallback to recent products if no featured ones
        const { data } = await supabase.from('produtos').select('*').limit(4).order('created_at', { ascending: false });
        if (data) setFeaturedProducts(data);
      }
      if (catRes.data) setCategories(catRes.data);
      setLoading(false);
    };
    loadHomeData();
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [catItemsPerView, setCatItemsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1.2);
        setCatItemsPerView(1.2);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3);
        setCatItemsPerView(2);
      } else {
        setItemsPerView(5);
        setCatItemsPerView(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  const nextCategory = () => {
    setCategoryIndex((prev) => (prev + 1) % categories.length);
  };

  const prevCategory = () => {
    setCategoryIndex((prev) => (prev - 1 + categories.length) % categories.length);
  };

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black py-16">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-black" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto pt-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <span className="inline-block px-4 py-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-[10px] font-black tracking-[0.3em] uppercase mb-6 text-muted">
              Nova Coleção 2026
            </span>
            <h1 className="text-5xl md:text-7xl mb-6 leading-[0.85] text-balance">
              KB OUTLET <br /> 
              <span className="text-gray-base">PREMIUM.</span>
            </h1>
            <p className="text-muted text-base md:text-lg mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
              A curadoria definitiva do streetwear global. <br className="hidden md:block" />
              Qualidade sem concessões, estilo sem limites.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link 
                to="/catalogo" 
                className="px-10 py-5 bg-white text-black font-bold rounded-full flex items-center gap-3 hover:scale-105 transition-all text-base"
              >
                Explorar Catálogo <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-500 font-bold">Scroll</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-zinc-500 to-transparent" />
        </motion.div>
      </section>

      {/* Featured Products Carousel */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-12 overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl mb-2">Destaques</h2>
            <p className="text-muted text-base">Peças selecionadas que definem a temporada.</p>
          </div>
          {featuredProducts.length > 1 && (
            <div className="flex items-center gap-4">
              <button 
                onClick={prevSlide}
                className="p-3 bg-zinc-900 border border-white/5 rounded-full hover:bg-white hover:text-black transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={nextSlide}
                className="p-3 bg-zinc-900 border border-white/5 rounded-full hover:bg-white hover:text-black transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="min-w-[260px] w-[70%] md:w-[calc(33.333%-1rem)] lg:w-[calc(20%-1rem)] max-w-[280px] aspect-[3/4] bg-zinc-950 animate-pulse rounded-[2rem] border border-white/5 shrink-0" />
            ))}
          </div>
        ) : (
          <div className="relative overflow-hidden">
            <motion.div 
              className="flex gap-6"
              animate={{ x: `calc(-${currentIndex * 100}% / ${itemsPerView} - ${currentIndex * (24 / itemsPerView)}px)` }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
            >
              {featuredProducts.map(product => (
                <div key={product.id} className="min-w-[260px] w-[70%] md:w-[calc(33.333%-1rem)] lg:w-[calc(20%-1rem)] max-w-[280px] shrink-0">
                  <ProductCard product={product} />
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </section>

      {/* Categories Carousel */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-12 overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl mb-2">Categorias</h2>
            <p className="text-muted text-base">Encontre seu estilo único.</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={prevCategory}
              className="p-3 bg-zinc-900 border border-white/5 rounded-full hover:bg-white hover:text-black transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextCategory}
              className="p-3 bg-zinc-900 border border-white/5 rounded-full hover:bg-white hover:text-black transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        <div className="relative">
          <motion.div 
            className="flex gap-6"
            animate={{ x: `calc(-${categoryIndex * 100}% / ${catItemsPerView} - ${categoryIndex * (24 / catItemsPerView)}px)` }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
          >
            {categories.map((category, idx) => (
              <motion.div
                key={category.id}
                className="min-w-full md:min-w-[calc(50%-0.75rem)] lg:min-w-[calc(33.333%-1rem)] group relative overflow-hidden rounded-[2rem] bg-zinc-950 border border-white/5 h-[300px]"
              >
                <Link 
                  to={`/catalogo?categoria=${category.id}`}
                  className="block w-full h-full"
                >
                  {category.imagem_url ? (
                    <img 
                      src={category.imagem_url} 
                      alt={category.nome}
                      className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-zinc-900 z-0" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  <div className="absolute bottom-8 left-8 z-20">
                    <h3 className="text-2xl font-bold tracking-tight mb-2">{category.nome}</h3>
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors flex items-center gap-2">
                      Explorar <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Premium Horizontal Community CTA */}
      <section className="w-full py-24 px-6 relative overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] glow-purple pointer-events-none"></div>
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] glow-red pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="w-full min-h-[140px] md:h-[150px] glass-effect rounded-2xl p-8 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
            {/* Subtle Detail: KB Monogram background */}
            <div className="absolute -left-4 -bottom-8 text-white/[0.02] font-black text-[120px] pointer-events-none select-none">
              KB
            </div>
            
            <div className="flex flex-col items-center md:items-start text-center md:text-left relative z-10">
              <span className="text-[12px] font-black uppercase tracking-[0.5em] text-muted mb-2">
                Comunidade KB
              </span>
              <h2 className="text-xl md:text-2xl text-accent mb-2 md:whitespace-nowrap">
                Entre pro jogo — <span className="text-white">drops exclusivos e bastidores da KB.</span>
              </h2>
              
              {/* Instagram Indicator */}
              <div className="flex items-center gap-2 text-muted hover:text-white transition-colors cursor-default">
                <Instagram size={14} />
                <span className="text-[12px] font-bold tracking-[0.3em] uppercase">@K.B_OUTLET</span>
              </div>
            </div>

            <div className="relative z-10">
              <a 
                href="https://www.instagram.com/k.b_outlet/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-full transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_10px_30px_rgba(255,255,255,0.15)] active:scale-95 whitespace-nowrap flex items-center gap-2.5"
              >
                <Instagram size={14} />
                Acesse nosso instagram
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
