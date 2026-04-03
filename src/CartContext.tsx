'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from './types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size: string, color?: string, personalization_text?: string, personalization_number?: string) => void;
  removeFromCart: (productId: string, size: string, color?: string, personalization_text?: string, personalization_number?: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number, color?: string, personalization_text?: string, personalization_number?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('kb-outlet-cart');
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('kb-outlet-cart', JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const addToCart = (product: Product, size: string, color?: string, personalization_text?: string, personalization_number?: string) => {
    setCart(prev => {
      const existing = prev.find(item => 
        item.id === product.id && 
        item.selected_size === size && 
        item.selected_color === color &&
        item.personalization_text === personalization_text &&
        item.personalization_number === personalization_number
      );
      if (existing) {
        return prev.map(item =>
          item.id === product.id && 
          item.selected_size === size && 
          item.selected_color === color &&
          item.personalization_text === personalization_text &&
          item.personalization_number === personalization_number
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, selected_size: size, selected_color: color, quantity: 1, personalization_text, personalization_number }];
    });
  };

  const removeFromCart = (productId: string, size: string, color?: string, personalization_text?: string, personalization_number?: string) => {
    setCart(prev => prev.filter(item => 
      !(item.id === productId && 
        item.selected_size === size && 
        item.selected_color === color &&
        item.personalization_text === personalization_text &&
        item.personalization_number === personalization_number)
    ));
  };

  const updateQuantity = (productId: string, size: string, quantity: number, color?: string, personalization_text?: string, personalization_number?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color, personalization_text, personalization_number);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId && 
        item.selected_size === size && 
        item.selected_color === color &&
        item.personalization_text === personalization_text &&
        item.personalization_number === personalization_number
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => {
    const basePrice = item.price;
    const extraPrice = (item.personalization_text || item.personalization_number) ? (item.personalization_price || 0) : 0;
    return acc + (basePrice + extraPrice) * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
