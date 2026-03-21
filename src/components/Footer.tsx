import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/5 pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="md:col-span-2">
            <Link to="/" className="text-3xl font-black tracking-tighter text-white mb-8 block">
              KB<span className="text-zinc-600">OUTLET</span>
            </Link>
            <p className="text-zinc-500 text-lg font-medium max-w-md leading-relaxed">
              Elevando o streetwear ao patamar de luxo. Curadoria exclusiva das melhores marcas e peças outlet premium para quem não aceita o comum.
            </p>
            <div className="flex gap-6 mt-10">
              <motion.a 
                whileHover={{ y: -5 }}
                href="https://www.instagram.com/k.b_outlet/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all border border-white/5"
              >
                <Instagram size={20} />
              </motion.a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-[0.3em] mb-8">Navegação</h3>
            <ul className="space-y-4">
              {['Início', 'Catálogo', 'Novidades', 'Outlet'].map((item) => (
                <li key={item}>
                  <Link 
                    to={item === 'Início' ? '/' : '/catalogo'} 
                    className="text-zinc-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest flex items-center group"
                  >
                    {item}
                    <ArrowUpRight size={14} className="ml-1 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-[0.3em] mb-8">Contato</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:text-white transition-colors border border-white/5">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-1">WhatsApp</p>
                  <p className="text-sm text-zinc-400 font-bold">(49) 98189-601</p>
                </div>
              </li>
              <li className="flex items-start gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:text-white transition-colors border border-white/5">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-1">Localização</p>
                  <p className="text-sm text-zinc-400 font-bold">Novo Horizonte, SC</p>
                  <p className="text-[10px] text-zinc-500 font-medium">CEP: 89998-000</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em]">
              © {currentYear} KB OUTLET PREMIUM. TODOS OS DIREITOS RESERVADOS.
            </p>
            <div className="flex gap-6">
              <Link 
                to="/admin" 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-zinc-800 hover:text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors"
              >
                Acesso Restrito
              </Link>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-zinc-700">
            <span className="text-[10px] font-bold uppercase tracking-widest">Designed for Excellence</span>
            <div className="w-1 h-1 rounded-full bg-zinc-800" />
            <span className="text-[10px] font-bold uppercase tracking-widest">KB Outlet</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
