import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Instagram, ShoppingBag } from 'lucide-react';
import { useHome } from '../hooks/useHome';
import { ProductCard } from '../components/ProductCard';

export const Home = () => {
  const { featuredProducts, loading, error, loadHomeData } = useHome();

  return (
    <div className="bg-black text-white min-h-screen">
      {error && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
          <div className="bg-red-500/90 backdrop-blur-md text-white p-4 rounded-xl shadow-2xl flex items-center justify-between gap-4">
            <p className="text-sm font-bold">{error}</p>
            <button 
              onClick={() => loadHomeData()}
              className="px-3 py-1 bg-white text-red-500 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-white/90 transition-all"
            >
              Recarregar
            </button>
          </div>
        </div>
      )}
      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
        {/* Background Image (Absolute) */}
        <div className="absolute inset-0 z-0 scale-105 animate-slow-zoom">
          <img 
            src="https://images.unsplash.com/photo-1617251137884-f135eccf6942?q=80&w=1964&auto=format&fit=crop" 
            alt="KB Outlet Premium Streetwear" 
            className="w-full h-full object-cover object-center sm:object-top"
          />
          {/* Overlays for Depth and Readability */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          {/* Vignette effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-80" />
        </div>

        {/* Content (Relative) */}
        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 py-20 mt-16 md:mt-24">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            {/* Text Content */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl"
            >
              <div className="overflow-hidden mb-6">
                <motion.span 
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block px-4 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold tracking-[0.3em] uppercase text-white/90"
                >
                  KB OUTLET • EST. 2024
                </motion.span>
              </div>
              
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-bebas leading-[0.85] tracking-tighter mb-8 drop-shadow-2xl">
                <span className="block text-white">NÃO SIGA TENDÊNCIAS.</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">CRIE PRESENÇA.</span>
              </h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="text-white/80 text-lg md:text-2xl font-light tracking-wide mb-12 max-w-2xl md:ml-2"
              >
                Streetwear premium para quem transforma presença em identidade.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 md:ml-2"
              >
                <Link 
                  to="/catalogo" 
                  className="group relative px-10 py-4 bg-white text-black font-black text-sm uppercase tracking-widest overflow-hidden font-mono flex items-center justify-center gap-3 transition-transform hover:scale-105 active:scale-95"
                >
                  <span className="relative z-10">Explorar catálogo</span>
                  <div className="absolute inset-0 bg-neutral-200 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                  <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/catalogo?featured=true" 
                  className="group px-10 py-4 bg-black/20 backdrop-blur-sm text-white border border-white/20 font-black text-sm uppercase tracking-widest hover:bg-white border-transparent hover:border-white hover:text-black transition-all duration-300 ease-in-out font-mono text-center flex items-center justify-center"
                >
                  Ver novidades
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        >
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">Scroll</span>
          <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-white animate-scroll-down" />
          </div>
        </motion.div>
      </section>

      {/* Featured Products Grid */}
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-6">
            <div>
              <h2 className="text-4xl md:text-7xl font-bebas tracking-tight mb-4">
                DESTAQUES <br /> <span className="text-gray-base">DA SEMANA.</span>
              </h2>
              <p className="text-muted text-lg font-medium max-w-md">As peças mais desejadas da nossa coleção, selecionadas para você.</p>
            </div>
            <Link 
              to="/catalogo" 
              className="group flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-white/60 hover:text-white transition-colors"
            >
              Ver tudo <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {loading ? (
              Array(8).fill(0).map((_, i) => (
                <div key={i} className="aspect-square bg-secondary animate-pulse rounded-2xl" />
              ))
            ) : (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-40 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl md:text-9xl font-bebas tracking-tighter mb-8">
              VISTA SEU <span className="text-gray-base">ESTILO.</span>
            </h2>
            <p className="text-muted text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium">
              Junte-se à comunidade KB Outlet e eleve seu visual com peças autênticas e exclusivas.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                to="/catalogo" 
                className="w-full sm:w-auto px-12 py-5 bg-white text-black font-black text-lg uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-2xl"
              >
                Ver catálogo
              </Link>
              <a 
                href="https://instagram.com/kboutlet" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-12 py-5 bg-zinc-900 text-white font-black text-lg rounded-2xl hover:bg-zinc-800 transition-all"
              >
                <Instagram size={24} /> @KBOUTLET
              </a>
            </div>
          </motion.div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
        </div>
      </section>
    </div>
  );
};
