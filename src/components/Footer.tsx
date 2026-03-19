import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MapPin, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <Link to="/" className="text-xl font-bold tracking-tighter text-white mb-4 block">
              KB<span className="text-zinc-500">OUTLET</span>
            </Link>
            <p className="text-zinc-400 text-sm max-w-xs">
              O melhor do streetwear e outlet premium. Qualidade e estilo que você merece.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link to="/" className="hover:text-white transition-colors">Início</Link></li>
              <li><Link to="/catalogo" className="hover:text-white transition-colors">Catálogo</Link></li>
              <li><a href="https://www.instagram.com/k.b_outlet/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contato</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <span>(49) 98189-601</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} />
                <span>Chapecó, SC</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-xs">
            © {new Date().getFullYear()} KB Outlet. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/admin" className="text-zinc-600 hover:text-zinc-400 text-xs transition-colors">
              Painel Admin
            </Link>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/k.b_outlet/" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
