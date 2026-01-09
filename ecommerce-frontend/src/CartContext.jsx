import { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // 1. Function to add product to cart

const addToCart = (product) => {
  // Use console.log to see exactly what 'product' looks like when added
  console.log("Adding product to cart:", product);

  setCartItems((prevItems) => {
    // We check for product.id (this MUST match your database column name)
    const existingItem = prevItems.find(item => item.id === product.id);
    
    if (existingItem) {
      return prevItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    }
    return [...prevItems, { ...product, quantity: 1 }];
  });
};

  // 2. Function to remove item
  const removeFromCart = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // 3. Calculate total price
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

// src/CartSidebar.jsx

const handleCheckout = async () => {
  if (cartItems.length === 0) return;

  try {
    const response = await fetch('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        cartItems, 
        totalAmount: cartTotal 
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert(`✅ Success! Order #${data.orderId} placed.`);
      
      // 💡 CLEAR THE CART DATA MANUALLY BEFORE RELOADING
      // This ensures the numbers refresh correctly
      window.location.href = '/admin'; // Force go back to admin to see stock change
    } else {
      alert(`❌ Error: ${data.message}`);
    }
  } catch (error) {
    console.error('Checkout error:', error);
    alert('Failed to connect to server. Is your backend running?');
  }
};

export const useCart = () => useContext(CartContext);