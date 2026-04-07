import React from 'react';
import { Order } from '../../types';
import { Trash2, CheckCircle, Clock, Truck, XCircle, Calendar, Search } from 'lucide-react';
import { motion } from 'motion/react';

interface OrderTabProps {
  orders: Order[];
  onUpdateStatus: (id: string, status: Order['status']) => void;
  onDelete: (id: string) => void;
  dateFilter: string;
  setDateFilter: (date: string) => void;
}

export const OrderTab: React.FC<OrderTabProps> = ({
  orders,
  onUpdateStatus,
  onDelete,
  dateFilter,
  setDateFilter
}) => {
  const filteredOrders = dateFilter
    ? orders.filter(o => o.created_at.startsWith(dateFilter))
    : orders;

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock size={16} className="text-yellow-500" />;
      case 'paid': return <CheckCircle size={16} className="text-green-500" />;
      case 'shipped': return <Truck size={16} className="text-blue-500" />;
      case 'cancelled': return <XCircle size={16} className="text-red-500" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'paid': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'shipped': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
    }
  };

  return (
    <div className="space-y-6 relative z-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bebas tracking-wide text-white/90">Pedidos ({filteredOrders.length})</h2>
        <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/10 backdrop-blur-md w-full sm:w-auto">
          <Calendar size={18} className="text-white/40 ml-2" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-transparent text-white border-none focus:ring-0 text-sm w-full"
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="text-xs text-white/40 hover:text-white px-2"
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredOrders.map((o) => (
          <motion.div
            key={o.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
          >
            <div className="flex flex-col lg:flex-row justify-between gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{o.customer_name}</h3>
                    <p className="text-sm text-white/40 font-medium">{o.customer_whatsapp}</p>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wider ${getStatusColor(o.status)}`}>
                    {getStatusIcon(o.status)}
                    {o.status}
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 space-y-3">
                  {o.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-white/10 rounded flex items-center justify-center text-[10px] font-bold">
                          {item.quantity}x
                        </span>
                        <span className="text-white/80">{item.name}</span>
                        <span className="text-[10px] px-2 py-0.5 bg-white/10 rounded uppercase tracking-tighter text-white/40">
                          {item.selectedSize}
                        </span>
                      </div>
                      <span className="text-white/60 font-medium">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                    <span className="text-xs text-white/40 font-bold uppercase">Total do Pedido</span>
                    <span className="text-xl font-bebas text-white">R$ {o.total.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-row lg:flex-col justify-between lg:justify-start gap-2 lg:w-48">
                <div className="flex flex-wrap gap-2 flex-1">
                  {(['pending', 'paid', 'shipped', 'cancelled'] as Order['status'][]).map((status) => (
                    <button
                      key={status}
                      onClick={() => onUpdateStatus(o.id, status)}
                      className={`flex-1 lg:flex-none px-3 py-2 rounded-lg text-[10px] font-bold uppercase transition-all duration-300 border ${
                        o.status === status
                          ? 'bg-white text-black border-white shadow-lg shadow-white/10'
                          : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => onDelete(o.id)}
                  className="bg-red-500/10 text-red-500 p-3 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 border border-red-500/20"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-[10px] text-white/20 font-bold uppercase tracking-widest">
              <Calendar size={12} />
              {new Date(o.created_at).toLocaleString('pt-BR')}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
