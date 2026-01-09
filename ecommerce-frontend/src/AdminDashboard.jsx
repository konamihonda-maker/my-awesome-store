import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductForm from './ProductForm';
import OrderHistory from './OrderHistory';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [view, setView] = useState('products'); // 'products' or 'orders'
  const location = useLocation();

  // 1. Fetch Products on load
  const fetchProducts = () => {
    fetch('http://localhost:3000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error loading products:", err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. Handle URL redirect (from Checkout)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('view') === 'orders') {
      setView('orders');
    }
  }, [location]);

  // 3. Delete Product Function
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await fetch(`http://localhost:3000/api/products/${id}`, { method: 'DELETE' });
      fetchProducts(); // Refresh list
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>

      {/* Navigation Tabs */}
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setView('products')}
          className={`px-6 py-2 rounded-lg font-bold transition-colors ${
            view === 'products' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-white text-gray-600 border hover:bg-gray-50'
          }`}
        >
          📦 Manage Products
        </button>
        <button 
          onClick={() => setView('orders')}
          className={`px-6 py-2 rounded-lg font-bold transition-colors ${
            view === 'orders' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-white text-gray-600 border hover:bg-gray-50'
          }`}
        >
          📜 Order History
        </button>
      </div>

      {/* View Switcher */}
      {view === 'products' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Add Product Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Add New Product</h2>
              <ProductForm onProductAdded={fetchProducts} />
            </div>
          </div>

          {/* Right Column: Product List */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4">Current Inventory ({products.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map(product => (
                <div key={product.id} className="bg-white border rounded-lg p-4 flex flex-col shadow-sm hover:shadow-md transition-shadow">
                  <img 
                    src={product.image_url || 'https://placehold.co/150'} 
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-md mb-4 bg-gray-50"
                  />
                  <h3 className="font-bold text-lg">{product.name}</h3>
                  <p className="text-gray-500 text-sm mb-2 truncate">{product.description}</p>
                  <div className="mt-auto flex justify-between items-center">
                    <div>
                      <span className="block font-bold text-blue-600">${product.price}</span>
                      <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        Stock: {product.stock}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Orders View */
        <OrderHistory />
      )}
    </div>
  );
}