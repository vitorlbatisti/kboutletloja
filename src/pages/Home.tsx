import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, ShoppingBag, Instagram, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  
  // Scroll-based transforms for the headline
  const headlineY = useTransform(scrollY, [0, 500], [0, -100]);
  const headlineOpacity = useTransform(scrollY, [0, 500], [1, 0.9]);
  const headlineScale = useTransform(scrollY, [0, 500], [1, 1.03]);
  const headlineBrightness = useTransform(scrollY, [0, 300], [1, 1.15]);
  
  // Background layer parallax (Scroll)
  const bgScrollY = useTransform(scrollY, [0, 1000], [0, 200]);
  const midScrollY = useTransform(scrollY, [0, 1000], [0, 400]);
  
  // Smooth spring for mouse parallax
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
        {/* Layer 1: Background Sophistication (Slowest) */}
        <motion.div 
          className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
          style={{ y: bgScrollY }}
        >
          {/* Animated Light Flow - Layer 1 (Linear Sweep) */}
          <motion.div
            animate={{
              x: ['-20%', '20%'],
              y: ['-20%', '20%'],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 pointer-events-none"
            style={{
              width: '200%',
              height: '200%',
              top: '-50%',
              left: '-50%',
              background: 'linear-gradient(120deg, transparent, rgba(255,255,255,0.08), transparent)'
            }}
          />

          {/* Animated Light Flow - Layer 2 (Radial Pulse) */}
          <motion.div
            animate={{
              x: ['-10%', '10%'],
              y: ['-10%', '10%'],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 pointer-events-none"
            style={{
              width: '200%',
              height: '200%',
              top: '-50%',
              left: '-50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.05), transparent 70%)'
            }}
          />

          {/* Noise Texture Layer - Extremely subtle grain */}
          <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none" 
               style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
          </div>

          {/* Vignette / Dark Gradient Layers for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-50" />

          {/* Radial Focus behind text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vh] bg-zinc-400/[0.05] rounded-full blur-[140px]" />
          
          {/* Parallax Background Image */}
          <motion.div 
            className="absolute inset-0 opacity-10 md:opacity-15 grayscale"
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
        </motion.div>

        {/* Layer 2: Mid Layer (Faster) */}
        <motion.div 
          className="absolute inset-0 z-[5] pointer-events-none"
          style={{ y: midScrollY }}
        >
          {/* Minimal Technical Line - Very thin, low opacity */}
          <div className="absolute top-[65%] left-0 w-full h-[1px] bg-white/[0.03]" />
        </motion.div>
        
        {/* Layer 3: Foreground (Text) */}
        <motion.div 
          className="relative z-10 text-center px-6 max-w-7xl mx-auto flex flex-col items-center justify-center"
          style={{ 
            y: headlineY,
            opacity: headlineOpacity,
            scale: headlineScale,
            filter: useTransform(headlineBrightness, (v) => `brightness(${v})`)
          }}
        >
          {/* Top Label - Refined Spacing */}
          <motion.div
            initial={{ opacity: 0, y: -15, filter: 'blur(8px)' }}
            animate={{ opacity: 0.3, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 md:mb-16"
          >
            <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.6em] md:tracking-[0.8em] text-white/90">
              KB OUTLET // NOVA COLEÇÃO 2026
            </span>
          </motion.div>

          {/* Main Headline - Responsive Scaling */}
          <div className="mb-10 md:mb-14 py-2 md:py-4 relative">
            <h1 className="text-[clamp(2.5rem,12vw,11rem)] font-black leading-[0.82] tracking-tighter uppercase flex flex-col italic select-none">
              {/* Line 1: From Left */}
              <div className="relative overflow-visible">
                <motion.span 
                  initial={{ x: -40, opacity: 0, filter: 'blur(4px)', scale: 0.98 }}
                  animate={{ x: 0, opacity: 1, filter: 'blur(0px)', scale: 1 }}
                  transition={{ 
                    duration: 1.2, 
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.1 
                  }}
                  className="block text-white relative drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                >
                  FEITO PRO JOGO
                  {/* Refined Light Sweep Effect */}
                  <motion.div 
                    initial={{ x: '-100%', opacity: 0 }}
                    animate={{ x: '200%', opacity: [0, 0.25, 0] }}
                    transition={{ duration: 0.8, delay: 1.4, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] pointer-events-none"
                  />
                </motion.span>
              </div>

              {/* Line 2: From Right */}
              <div className="relative overflow-visible">
                <motion.span 
                  initial={{ x: 40, opacity: 0, filter: 'blur(4px)', scale: 0.98 }}
                  animate={{ x: 0, opacity: 1, filter: 'blur(0px)', scale: 1 }}
                  transition={{ 
                    duration: 1.2, 
                    ease: [0.16, 1, 0.3, 1], 
                    delay: 0.3 
                  }}
                  className="block text-zinc-400 md:text-zinc-500 relative"
                >
                  FEITO PRA RUA
                  {/* Refined Light Sweep Effect */}
                  <motion.div 
                    initial={{ x: '-100%', opacity: 0 }}
                    animate={{ x: '200%', opacity: [0, 0.2, 0] }}
                    transition={{ duration: 0.8, delay: 1.6, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-[-20deg] pointer-events-none"
                  />
                </motion.span>
              </div>
            </h1>
          </div>

          {/* Supporting Text & CTA - Balanced Spacing */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-8 md:gap-12"
          >
            <p className="text-[9px] md:text-[11px] uppercase tracking-[0.4em] md:tracking-[0.5em] text-zinc-400 md:text-zinc-500 font-bold max-w-[280px] md:max-w-none leading-relaxed">
              Camisas selecionadas. Qualidade real.
            </p>

            <div className="flex flex-col items-center gap-6 md:gap-8">
              <Link 
                to="/catalogo" 
                className="group relative px-10 md:px-14 py-5 md:py-6 bg-white text-black font-black text-[10px] md:text-[11px] uppercase tracking-[0.3em] md:tracking-[0.4em] rounded-full overflow-hidden transition-transform active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Explorar Catálogo <ArrowRight size={14} className="md:w-4 md:h-4" />
                </span>
                <div className="absolute inset-0 bg-zinc-200 translate-y-full md:group-hover:translate-y-0 transition-transform duration-500" />
              </Link>
              
              {/* Secondary Brand Mark */}
              <span className="text-[8px] md:text-[9px] font-black text-zinc-800 uppercase tracking-[1em] md:tracking-[1.2em] mt-4 md:mt-6 opacity-30 md:opacity-40">
                KB OUTLET PREMIUM
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Gradient for smooth transition (Fixed at bottom) */}
        <div className="absolute bottom-0 left-0 w-full h-32 md:h-64 bg-gradient-to-t from-black to-transparent z-[15] pointer-events-none" />

        {/* Scroll Indicator - Minimalist */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ delay: 1.8, duration: 1.2 }}
          className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="w-[1px] h-10 md:h-16 bg-gradient-to-b from-white to-transparent" />
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
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="min-w-[160px] w-[45%] md:w-[calc(33.333%-1rem)] lg:w-[calc(20%-1rem)] max-w-[280px] aspect-[3/4] bg-zinc-950 animate-pulse rounded-[2rem] border border-white/5 shrink-0" />
            ))}
          </div>
        ) : (
          <div className="relative overflow-hidden">
            <motion.div 
              className="flex gap-4"
              animate={{ x: `calc(-${currentIndex * 100}% / ${itemsPerView} - ${currentIndex * (16 / itemsPerView)}px)` }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
            >
              {featuredProducts.map(product => (
                <div key={product.id} className="min-w-[160px] w-[45%] md:w-[calc(33.333%-1rem)] lg:w-[calc(20%-1rem)] max-w-[280px] shrink-0">
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
                className="min-w-[85%] md:min-w-[calc(50%-0.75rem)] lg:min-w-[calc(33.333%-1rem)] group relative overflow-hidden rounded-[2rem] bg-zinc-950 border border-white/5 h-[300px] shrink-0"
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
