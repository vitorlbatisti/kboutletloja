'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from './types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size: string, color?: string, personalizacao_texto?: string, personalizacao_numero?: string) => void;
  removeFromCart: (productId: string, size: string, color?: string, personalizacao_texto?: string, personalizacao_numero?: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number, color?: string, personalizacao_texto?: string, personalizacao_numero?: string) => void;
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

  const addToCart = (product: Product, size: string, color?: string, personalizacao_texto?: string, personalizacao_numero?: string) => {
    setCart(prev => {
      const existing = prev.find(item => 
        item.id === product.id && 
        item.selectedSize === size && 
        item.selectedColor === color &&
        item.personalizacao_texto === personalizacao_texto &&
        item.personalizacao_numero === personalizacao_numero
      );
      if (existing) {
        return prev.map(item =>
          item.id === product.id && 
          item.selectedSize === size && 
          item.selectedColor === color &&
          item.personalizacao_texto === personalizacao_texto &&
          item.personalizacao_numero === personalizacao_numero
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, selectedSize: size, selectedColor: color, quantity: 1, personalizacao_texto, personalizacao_numero }];
    });
  };

  const removeFromCart = (productId: string, size: string, color?: string, personalizacao_texto?: string, personalizacao_numero?: string) => {
    setCart(prev => prev.filter(item => 
      !(item.id === productId && 
        item.selectedSize === size && 
        item.selectedColor === color &&
        item.personalizacao_texto === personalizacao_texto &&
        item.personalizacao_numero === personalizacao_numero)
    ));
  };

  const updateQuantity = (productId: string, size: string, quantity: number, color?: string, personalizacao_texto?: string, personalizacao_numero?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color, personalizacao_texto, personalizacao_numero);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId && 
        item.selectedSize === size && 
        item.selectedColor === color &&
        item.personalizacao_texto === personalizacao_texto &&
        item.personalizacao_numero === personalizacao_numero
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => {
    const basePrice = item.preco;
    const extraPrice = (item.personalizacao_texto || item.personalizacao_numero) ? (item.preco_personalizacao || 0) : 0;
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
