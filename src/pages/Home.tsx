import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Instagram, ShoppingBag } from 'lucide-react';
import { useHome } from '../hooks/useHome';
import { ProductCard } from '../components/ProductCard';

export const Home = () => {
  const { featuredProducts, loading } = useHome();

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen md:h-[90vh] flex items-center overflow-hidden pt-32">
        {/* Background Image (Absolute) */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1974&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover grayscale opacity-30"
          />
          {/* Dark Overlay (Absolute) */}
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        {/* Content (Relative) */}
        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 py-12 md:py-0">
          <div className="flex flex-col items-center justify-center text-center">
            {/* Text Content */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-3xl"
            >
              <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold tracking-[0.3em] uppercase text-white/80 mb-6">
                KB OUTLET • PREMIUM STREETWEAR
              </span>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-bebas leading-[0.85] tracking-tighter mb-8">
                ESTILO <br /> SEM LIMITES.
              </h1>
              <p className="text-muted text-lg md:text-xl font-medium mb-10 max-w-lg mx-auto">
                Curadoria exclusiva das melhores marcas e peças outlet premium para quem não aceita o comum.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                <Link 
                  to="/catalogo" 
                  className="w-full sm:w-auto px-10 py-4 bg-white text-black font-black text-sm uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-2xl"
                >
                  Explorar catálogo
                </Link>
                <Link 
                  to="/catalogo?featured=true" 
                  className="w-full sm:w-auto px-10 py-4 bg-transparent text-white border border-white/20 font-black text-sm uppercase tracking-widest rounded-xl hover:bg-white/5 transition-all"
                >
                  Ver novidades
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
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
