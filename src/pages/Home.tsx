import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, ShoppingBag, Instagram } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [prodRes, catRes] = await Promise.all([
        supabase.from('produtos').select('*').limit(4).order('created_at', { ascending: false }),
        supabase.from('categorias').select('*')
      ]);

      if (prodRes.data) setFeaturedProducts(prodRes.data);
      if (catRes.data) setCategories(catRes.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=2070" 
            alt="Streetwear Hero" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-transparent to-transparent" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-black tracking-tighter mb-6"
          >
            ESTILO QUE <br /> <span className="text-zinc-500">DEFINE VOCÊ</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-zinc-400 text-lg md:text-xl mb-8 max-w-2xl mx-auto"
          >
            Descubra as últimas tendências em streetwear e outlet premium. 
            Qualidade impecável com o melhor preço do mercado.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link 
              to="/catalogo" 
              className="px-8 py-4 bg-white text-black font-bold rounded-full flex items-center gap-2 hover:bg-zinc-200 transition-all btn-glow"
            >
              Ver Catálogo <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Categorias</h2>
            <p className="text-zinc-500 mt-2">Explore por estilo</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category, idx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link 
                to={`/catalogo?categoria=${category.id}`}
                className="group relative h-40 flex items-center justify-center bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-zinc-500 transition-all overflow-hidden"
              >
                <span className="relative z-10 text-lg font-bold group-hover:scale-110 transition-transform">{category.nome}</span>
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Destaques</h2>
            <p className="text-zinc-500 mt-2">Os mais desejados da semana</p>
          </div>
          <Link to="/catalogo" className="text-sm font-medium hover:underline flex items-center gap-1">
            Ver tudo <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-[3/4] bg-zinc-900 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <div key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Instagram Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-zinc-900/50 rounded-3xl p-8 md:p-16 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-md text-center md:text-left">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center md:justify-start gap-3">
              <Instagram className="text-zinc-400" /> Siga no Instagram
            </h2>
            <p className="text-zinc-400 mb-8">
              Fique por dentro de todos os lançamentos, promoções e novidades exclusivas da KB Outlet.
            </p>
            <a 
              href="https://www.instagram.com/k.b_outlet/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-white hover:text-black rounded-full transition-all font-bold"
            >
              @k.b_outlet
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden rotate-3">
              <img src="https://picsum.photos/seed/kb1/400/400" alt="Insta 1" className="w-full h-full object-cover" />
            </div>
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden -rotate-3 mt-8">
              <img src="https://picsum.photos/seed/kb2/400/400" alt="Insta 2" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
