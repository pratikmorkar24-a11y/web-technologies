import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const CART_KEY = 'inkwell_cart';
const CartContext = createContext(null);

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart);
  const [bump, setBump] = useState(0); // triggers the cart-badge "bump" animation

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((bookId, quantity = 1) => {
    bookId = Number(bookId);
    setCart(prev => {
      const existing = prev.find(i => i.bookId === bookId);
      if (existing) {
        return prev.map(i => i.bookId === bookId ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { bookId, quantity }];
    });
    setBump(b => b + 1);
  }, []);

  const setQuantity = useCallback((bookId, quantity) => {
    bookId = Number(bookId);
    setCart(prev => {
      if (quantity <= 0) return prev.filter(i => i.bookId !== bookId);
      return prev.map(i => i.bookId === bookId ? { ...i, quantity } : i);
    });
  }, []);

  const removeFromCart = useCallback((bookId) => {
    bookId = Number(bookId);
    setCart(prev => prev.filter(i => i.bookId !== bookId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const count = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, count, bump, addToCart, setQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
