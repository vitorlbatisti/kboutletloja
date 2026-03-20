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
  const [itemsPerView, setItemsPerView] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(4);
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

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black py-16">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-black" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <span className="inline-block px-5 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-xs font-black tracking-[0.3em] uppercase mb-8 text-zinc-400">
              Nova Coleção 2026
            </span>
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter-extra mb-8 leading-[0.85] text-balance">
              KB OUTLET <br /> 
              <span className="text-zinc-600">PREMIUM.</span>
            </h1>
            <p className="text-zinc-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
              A curadoria definitiva do streetwear global. <br className="hidden md:block" />
              Qualidade sem concessões, estilo sem limites.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link 
                to="/catalogo" 
                className="px-12 py-6 bg-white text-black font-bold rounded-full flex items-center gap-3 hover:bg-zinc-200 transition-all btn-glow text-lg"
              >
                Explorar Catálogo <ArrowRight size={22} />
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
      <section className="max-w-7xl mx-auto px-6 pt-8 pb-0 overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-end mb-4 gap-8">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-2">Destaques</h2>
            <p className="text-zinc-500 text-lg">Peças selecionadas que definem a temporada.</p>
          </div>
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
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-[4/5] bg-zinc-950 animate-pulse rounded-[2rem] border border-white/5" />
            ))}
          </div>
        ) : (
          <div className="relative">
            <motion.div 
              className="flex gap-8"
              animate={{ x: `calc(-${currentIndex * 100}% / ${itemsPerView} - ${currentIndex * (32 / itemsPerView)}px)` }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
            >
              {featuredProducts.map(product => (
                <div key={product.id} className="min-w-full md:min-w-[calc(50%-1rem)] lg:min-w-[calc(25%-1.5rem)]">
                  <ProductCard product={product} />
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </section>

      {/* Categories Grid - Bento Style */}
      <section className="max-w-7xl mx-auto px-6 pt-0 pb-8">
        <div className="mb-0">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-0">Categorias</h2>
          <p className="text-zinc-500 text-lg">Encontre seu estilo único.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.slice(0, 3).map((category, idx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative overflow-hidden rounded-[2.5rem] bg-zinc-950 border border-white/5 h-[400px]"
            >
              <Link 
                to={`/catalogo?categoria=${category.id}`}
                className="block w-full h-full"
              >
                <div className="absolute inset-0 bg-zinc-900 z-10" />
                <div className="absolute bottom-10 left-10 z-20">
                  <h3 className="text-3xl font-bold tracking-tight mb-2">{category.nome}</h3>
                  <span className="text-sm font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors flex items-center gap-2">
                    Explorar <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Instagram Section */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="relative overflow-hidden bg-zinc-950 rounded-[3rem] p-12 md:p-24 border border-white/5">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-16">
            <div className="max-w-xl text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-orange-500 flex items-center justify-center">
                  <Instagram size={24} className="text-white" />
                </div>
                <span className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">Comunidade</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 leading-tight">
                JUNTE-SE À <br /> <span className="text-zinc-500">EXPERIÊNCIA.</span>
              </h2>
              <p className="text-zinc-400 text-lg mb-12 leading-relaxed">
                Acompanhe os bastidores, drops exclusivos e o lifestyle KB Outlet em tempo real.
              </p>
              <a 
                href="https://www.instagram.com/k.b_outlet/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-full transition-all font-bold hover:bg-zinc-200"
              >
                @k.b_outlet
              </a>
            </div>
            
            <div className="relative w-full md:w-auto flex justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <motion.div 
                  animate={{ rotate: [0, 5, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-[2.5rem] overflow-hidden border-4 border-white/10 shadow-2xl z-20 bg-zinc-900 flex items-center justify-center"
                >
                  <Instagram size={48} className="text-zinc-800" />
                </motion.div>
                <motion.div 
                  animate={{ rotate: [0, -5, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute inset-0 rounded-[2.5rem] overflow-hidden border-4 border-white/10 shadow-2xl translate-x-8 translate-y-8 z-10 opacity-50 bg-zinc-900"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
