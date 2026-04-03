import React from 'react';
import { Package, Layers, ShoppingCart } from 'lucide-react';

interface DashboardTabsProps {
  activeTab: 'products' | 'categories' | 'orders';
  setActiveTab: (tab: 'products' | 'categories' | 'orders') => void;
}

export const DashboardTabs: React.FC<DashboardTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-wrap gap-4 mb-8 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md relative z-10">
      <button
        onClick={() => setActiveTab('products')}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
          activeTab === 'products'
            ? 'bg-white text-black shadow-lg shadow-white/10 scale-105'
            : 'hover:bg-white/10 text-white/70'
        }`}
      >
        <Package size={20} />
        Produtos
      </button>
      <button
        onClick={() => setActiveTab('categories')}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
          activeTab === 'categories'
            ? 'bg-white text-black shadow-lg shadow-white/10 scale-105'
            : 'hover:bg-white/10 text-white/70'
        }`}
      >
        <Layers size={20} />
        Categorias
      </button>
      <button
        onClick={() => setActiveTab('orders')}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
          activeTab === 'orders'
            ? 'bg-white text-black shadow-lg shadow-white/10 scale-105'
            : 'hover:bg-white/10 text-white/70'
        }`}
      >
        <ShoppingCart size={20} />
        Pedidos
      </button>
    </div>
  );
};
