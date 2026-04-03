import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, ShoppingBag, Instagram, ChevronLeft, ChevronRight } from 'lucide-react';
import { useHome } from '../hooks/useHome';
import { ProductCard } from '../components/ProductCard';

export const Home = () => {
  const { featuredProducts, categories, loading } = useHome();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  const headlineY = useTransform(scrollY, [0, 500], [0, -100]);
  const headlineOpacity = useTransform(scrollY, [0, 500], [1, 0.9]);
  const headlineScale = useTransform(scrollY, [0, 500], [1, 1.03]);
  
  const bgScrollY = useTransform(scrollY, [0, 1000], [0, 200]);
  const midScrollY = useTransform(scrollY, [0, 1000], [0, 400]);
  
  const springConfig = { damping: 30, stiffness: 100 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 20);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 20);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [catItemsPerView, setCatItemsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(2.1);
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
    const maxIndex = Math.max(0, featuredProducts.length - Math.floor(itemsPerView));
    if (maxIndex === 0) return;
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    const maxIndex = Math.max(0, featuredProducts.length - Math.floor(itemsPerView));
    if (maxIndex === 0) return;
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const nextCategory = () => {
    const maxIndex = Math.max(0, categories.length - Math.floor(catItemsPerView));
    if (maxIndex === 0) return;
    setCategoryIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevCategory = () => {
    const maxIndex = Math.max(0, categories.length - Math.floor(catItemsPerView));
    if (maxIndex === 0) return;
    setCategoryIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section ref={containerRef} className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-black py-10 md:py-20">
        <motion.div 
          className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
          style={{ y: bgScrollY }}
        >
          <motion.div 
            className="absolute inset-0 opacity-20 md:opacity-25 grayscale"
            style={{ 
              x: useTransform(mouseX, (v) => v * 0.3), 
              y: useTransform(mouseY, (v) => v * 0.3),
              scale: 1.05
            }}
          >
            <img 
              src="https://stohpiithlpfpdffante.supabase.co/storage/v1/object/public/homepage/banner" 
              alt="" 
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          </motion.div>

          <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none" 
               style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
          </div>

          <motion.div
            animate={{ y: [0, 60] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-60px] pointer-events-none opacity-[0.08]"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.15), rgba(255,255,255,0.15) 1px, transparent 1px, transparent 60px)' }}
          />
          <motion.div
            animate={{ x: [0, 60] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-60px] pointer-events-none opacity-[0.05]"
            style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.15), rgba(255,255,255,0.15) 1px, transparent 1px, transparent 60px)' }}
          />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vh] bg-zinc-400/[0.05] rounded-full blur-[140px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-50" />
        </motion.div>

        <motion.div 
          className="absolute inset-0 z-[5] pointer-events-none"
          style={{ y: midScrollY }}
        >
          <div className="absolute top-[65%] left-0 w-full h-[1px] bg-white/[0.03]" />
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
        </motion.div>
        
        <motion.div 
          className="relative z-10 text-center px-6 max-w-7xl mx-auto flex flex-col items-center justify-center"
          style={{ 
            y: headlineY,
            opacity: headlineOpacity,
            scale: headlineScale
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10"
          >
            <span className="inline-block px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase text-white/60 mb-8 backdrop-blur-md">
              KB OUTLET • PREMIUM STREETWEAR
            </span>
            <h1 className="text-7xl md:text-[11rem] lg:text-[13rem] leading-[0.85] font-bebas tracking-tighter text-white mb-10 select-none">
              <span className="block overflow-hidden">
                <motion.span 
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="block"
                >
                  ESTILO <span className="text-gray-base">SEM</span>
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span 
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="block"
                >
                  LIMITES.
                </motion.span>
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            <Link 
              to="/catalogo" 
              className="group relative px-12 py-5 bg-white text-black font-black text-lg rounded-2xl overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-3">
                EXPLORAR CATÁLOGO <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link 
              to="/catalogo?featured=true" 
              className="group px-12 py-5 bg-transparent text-white font-black text-lg rounded-2xl border-2 border-white/10 hover:border-white/30 transition-all hover:bg-white/5 active:scale-95"
            >
              VER NOVIDADES
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Products Carousel */}
      <section className="py-16 md:py-32 bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-16 gap-6 md:gap-8">
            <div>
              <h2 className="text-4xl md:text-7xl font-bebas tracking-tight mb-2 md:mb-4">
                DESTAQUES <br /> <span className="text-gray-base">DA SEMANA.</span>
              </h2>
              <p className="text-muted text-base md:text-lg max-w-md font-medium">As peças mais desejadas da nossa coleção, selecionadas para você.</p>
            </div>
            <div className="flex gap-2 md:gap-3">
              <button 
                onClick={prevSlide}
                className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl border-2 border-white/5 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all active:scale-90"
              >
                <ChevronLeft size={20} className="md:size-6" />
              </button>
              <button 
                onClick={nextSlide}
                className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl border-2 border-white/5 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all active:scale-90"
              >
                <ChevronRight size={20} className="md:size-6" />
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden -mx-4 px-4 md:-mx-6 md:px-6">
            <motion.div 
              className="flex gap-4 md:gap-8"
              animate={{ x: `-${currentIndex * (100 / itemsPerView)}%` }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
            >
              {loading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="min-w-[160px] md:min-w-[320px] aspect-square bg-secondary animate-pulse rounded-2xl md:rounded-3xl" />
                ))
              ) : (
                featuredProducts.map((product) => (
                  <div key={product.id} className="min-w-[160px] md:min-w-[320px] flex-shrink-0">
                    <ProductCard product={product} />
                  </div>
                ))
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 md:py-32 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-16 gap-6 md:gap-8">
            <div>
              <h2 className="text-4xl md:text-7xl font-bebas tracking-tight mb-2 md:mb-4">
                CATEGORIAS <br /> <span className="text-gray-base">EXPLORE.</span>
              </h2>
              <p className="text-muted text-base md:text-lg max-w-md font-medium">Navegue por estilo e encontre a peça perfeita para o seu visual.</p>
            </div>
            <div className="flex gap-2 md:gap-3">
              <button 
                onClick={prevCategory}
                className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl border-2 border-white/5 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all active:scale-90"
              >
                <ChevronLeft size={20} className="md:size-6" />
              </button>
              <button 
                onClick={nextCategory}
                className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl border-2 border-white/5 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all active:scale-90"
              >
                <ChevronRight size={20} className="md:size-6" />
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden -mx-4 px-4 md:-mx-6 md:px-6">
            <motion.div 
              className="flex gap-4 md:gap-8"
              animate={{ x: `-${categoryIndex * (100 / catItemsPerView)}%` }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
            >
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="min-w-[240px] md:min-w-[400px] aspect-video bg-secondary animate-pulse rounded-2xl md:rounded-3xl" />
                ))
              ) : (
                categories.map((category) => (
                  <Link 
                    key={category.id}
                    to={`/catalogo?category=${category.id}`}
                    className="group relative min-w-[240px] md:min-w-[400px] aspect-[16/10] rounded-2xl md:rounded-[2.5rem] overflow-hidden flex-shrink-0"
                  >
                    <img 
                      src={category.image_url} 
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
                      <h3 className="text-2xl md:text-4xl font-bebas tracking-wide text-white mb-1 md:mb-2">{category.name}</h3>
                      <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/60 group-hover:text-white transition-colors">
                        Ver Coleção <ArrowRight size={10} className="inline ml-1 md:size-3 md:ml-2" />
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brand Values / CTA */}
      <section className="py-16 md:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-24 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <h2 className="text-6xl md:text-8xl font-bebas tracking-tighter text-black mb-8 leading-[0.9]">
                FAÇA PARTE DA <br /> <span className="text-zinc-400">NOSSA HISTÓRIA.</span>
              </h2>
              <p className="text-zinc-600 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium">
                Mais que uma loja, uma comunidade. Siga-nos no Instagram e acompanhe os bastidores, novidades e promoções exclusivas.
              </p>
              <a 
                href="https://instagram.com/kboutlet" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-12 py-5 bg-black text-white font-black text-lg rounded-2xl hover:scale-105 transition-all shadow-2xl active:scale-95"
              >
                <Instagram size={24} /> @KBOUTLET
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};
