import React from 'react';
import { X, ShoppingCart, Trash2, Plus, Minus, Send, ShoppingBag } from 'lucide-react';
import { useCart } from '../CartContext';
import { motion, AnimatePresence } from 'motion/react';

export const CartDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

  const handleCheckout = () => {
    const message = `*Novo Pedido - KB Outlet*%0A%0A` +
      cart.map(item => `- ${item.nome} (${item.selectedSize}) x${item.quantity}: R$ ${(item.preco * item.quantity).toFixed(2)}`).join('%0A') +
      `%0A%0A*Total: R$ ${totalPrice.toFixed(2)}*`;
    
    window.open(`https://wa.me/554998189601?text=${message}`, '_blank');
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-zinc-900 z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingCart size={20} />
                Sua Sacola
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
                  <ShoppingBag size={48} strokeWidth={1} />
                  <p>Sua sacola está vazia</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4 group">
                    <div className="w-20 h-24 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.imagem_url} alt={item.nome} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-medium text-white line-clamp-1">{item.nome}</h3>
                        <p className="text-xs text-zinc-500">Tamanho: {item.selectedSize}</p>
                        <p className="text-sm font-bold mt-1">R$ {item.preco.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-zinc-800 rounded-md">
                          <button 
                            onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                            className="p-1 hover:text-white text-zinc-500"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-xs">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                            className="p-1 hover:text-white text-zinc-500"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id, item.selectedSize)}
                          className="text-zinc-600 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 space-y-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span>R$ {totalPrice.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all btn-glow"
                >
                  <Send size={18} />
                  Finalizar no WhatsApp
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
