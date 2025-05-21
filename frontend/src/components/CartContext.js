import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [cart, setCart] = useState([]);

  const addToCart = (offer) => {
    setCart((prevCart) => [...prevCart, offer]);
  };

  const removeFromCart = (offerId) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== offerId));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>{children}</CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
