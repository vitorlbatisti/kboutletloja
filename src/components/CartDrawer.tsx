import React, { useState } from 'react';
import { X, ShoppingCart, Trash2, Plus, Minus, Send, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';

export const CartDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckout = async () => {
    if (!customerName.trim()) {
      alert('Por favor, informe seu nome para finalizar o pedido.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Save to Supabase
      const { error } = await supabase.from('pedidos').insert([{
        cliente_nome: customerName,
        cliente_whatsapp: 'Via WhatsApp Web',
        itens: cart,
        total: totalPrice,
        status: 'pendente'
      }]);

      if (error) throw error;

      // 2. Redirect to WhatsApp
      const message = `*Novo Pedido - KB Outlet*%0A%0A` +
        `*Cliente:* ${customerName}%0A%0A` +
        cart.map(item => `- ${item.nome} (${item.selectedSize}) x${item.quantity}: R$ ${(item.preco * item.quantity).toFixed(2)}`).join('%0A') +
        `%0A%0A*Total: R$ ${totalPrice.toFixed(2)}*`;
      
      window.open(`https://wa.me/554998189601?text=${message}`, '_blank');
      
      // 3. Clear cart and close
      clearCart();
      onClose();
      setCustomerName('');
    } catch (err: any) {
      console.error('Erro ao processar pedido:', err);
      alert('Erro ao processar pedido. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-black z-[70] shadow-[0_0_100px_rgba(0,0,0,0.8)] border-l border-white/5 flex flex-col"
          >
            <div className="p-10 border-b border-white/5 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3">
                  <ShoppingBag size={24} className="text-zinc-500" />
                  SUA SACOLA
                </h2>
                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-bold mt-1">
                  {cart.length} {cart.length === 1 ? 'Item' : 'Itens'} selecionados
                </p>
              </div>
              <button 
                onClick={onClose} 
                className="p-3 hover:bg-white/5 rounded-full transition-all text-zinc-500 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-10">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-700 space-y-6">
                  <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center">
                    <ShoppingBag size={40} strokeWidth={1} />
                  </div>
                  <p className="text-sm font-bold uppercase tracking-widest">Sua sacola está vazia</p>
                  <button 
                    onClick={onClose}
                    className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors underline underline-offset-8"
                  >
                    Continuar Comprando
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={`${item.id}-${item.selectedSize}`} 
                    className="flex gap-6 group relative"
                  >
                    <div className="w-24 h-32 bg-zinc-950 rounded-2xl overflow-hidden flex-shrink-0 border border-white/5">
                      <img src={item.imagem_url} alt={item.nome} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h3 className="font-bold text-white tracking-tight text-lg line-clamp-1">{item.nome}</h3>
                        <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mt-1">Tamanho: {item.selectedSize}</p>
                        <p className="text-lg font-black mt-2 tracking-tighter">R$ {item.preco.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center bg-zinc-950 border border-white/5 rounded-full px-2 py-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                            className="p-1.5 hover:text-white text-zinc-600 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                            className="p-1.5 hover:text-white text-zinc-600 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id, item.selectedSize)}
                          className="p-2 text-zinc-800 hover:text-red-500 transition-all hover:bg-red-500/10 rounded-full"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-10 border-t border-white/5 bg-black/50 backdrop-blur-xl space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-bold">Seu Nome</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
                    <input 
                      type="text" 
                      placeholder="Como podemos te chamar?"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-12 pr-6 py-4 bg-zinc-950 border border-white/5 rounded-2xl focus:outline-none focus:border-white/20 transition-all text-sm font-medium placeholder:text-zinc-800"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-600">Subtotal</span>
                  <span className="text-3xl font-black tracking-tighter">R$ {totalPrice.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                  className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.2em] rounded-[2rem] flex items-center justify-center gap-4 hover:bg-zinc-200 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] active:scale-95 disabled:opacity-50"
                >
                  <Send size={20} />
                  {isSubmitting ? 'Processando...' : 'Finalizar Pedido'}
                </button>
                <p className="text-[10px] text-center text-zinc-600 font-bold uppercase tracking-widest">
                  Finalize seu pedido via WhatsApp
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
