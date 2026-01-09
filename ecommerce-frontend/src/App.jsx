import { useState } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom'; // ❌ NO BrowserRouter here
import { CartProvider, useCart } from './CartContext'; // ✅ Import Provider
import ShopPage from './ShopPage';
import AdminDashboard from './AdminDashboard';
import LoginPage from './LoginPage';
import CartSidebar from './CartSidebar';
import './App.css';

// Component to show cart count
function CartCounter() {
  const { cartItems } = useCart();
  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  if (count === 0) return null;

  return (
    <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
      {count}
    </span>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    // 💡 CRITICAL: CartProvider must wrap the entire App content
    <CartProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        
        {/* Navigation Bar */}
        <nav className="bg-gray-900 text-white p-4 sticky top-0 z-50 shadow-md">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h2 className="text-xl font-bold">My Awesome Store</h2>
            <div className="flex items-center gap-6">
              <Link to="/" className="hover:text-blue-400 transition-colors">Shop</Link>
              <Link to="/admin" className="hover:text-blue-400 transition-colors">Admin</Link>
              
              {/* Cart Trigger */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="flex items-center hover:text-blue-400 transition-colors"
              >
                🛒 Cart <CartCounter />
              </button>
            </div>
          </div>
        </nav>

        {/* Cart Sidebar */}
        <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<ShopPage />} />
          
          <Route 
            path="/login" 
            element={<LoginPage onLogin={() => setIsAuthenticated(true)} />} 
          />

          <Route 
            path="/admin" 
            element={
              isAuthenticated ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
        </Routes>
      </div>
    </CartProvider>
  );
}

export default App;