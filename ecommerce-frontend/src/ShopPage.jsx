import { useEffect, useState } from 'react';
import { useCart } from './CartContext';
import Hero from './Hero'; // 💡 Import Hero
import Footer from './Footer'; // 💡 Import Footer
import API_BASE_URL from './config'; // 1. Import it

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    //fetch('http://localhost:3000/api/products') <-- Use this in the Local host 
    fetch(`${API_BASE_URL}/api/products`) // <-- ADD THIS
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      {/* 1. HERO SECTION AT TOP */}
      <Hero />

      {/* 2. MAIN PRODUCT SECTION */}
      <main id="products" className="flex-grow max-w-7xl mx-auto px-6 pb-20 w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">✨ Our Collection ✨</h2>
          <p className="text-gray-600 mt-2">Quality products delivered to your door</p>
        </div>

        {loading ? (
           <div className="text-center py-20 text-xl text-gray-500">Loading products...</div>
        ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
             {products.map(product => (
               <div key={product.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
                  <div className="h-48 overflow-hidden bg-gray-100 relative">
                    <img 
                      src={product.image_url || 'https://placehold.co/300'} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-lg text-gray-800 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>
                    
                    <div className="mt-auto flex justify-between items-center mb-4">
                      <span className="text-xl font-bold text-blue-600">${parseFloat(product.price).toFixed(2)}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.stock > 0 ? 'In Stock' : 'Sold Out'}
                      </span>
                    </div>

                    <button 
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                      className="w-full bg-gray-900 text-white py-2.5 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium shadow-md hover:shadow-lg"
                    >
                      {product.stock > 0 ? 'Add to Cart' : 'Unavailable'}
                    </button>
                  </div>
               </div>
             ))}
           </div>
        )}
      </main>

      {/* 3. FOOTER AT BOTTOM */}
      <Footer />
    </div>
  );
}