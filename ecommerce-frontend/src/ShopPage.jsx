import { useEffect, useState } from 'react';
import { useCart } from './CartContext';
import Hero from './Hero';
import Footer from './Footer';
import API_BASE_URL from './config';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then(res => {
        // 1. If server sends 500 error, throw an error
        if (!res.ok) {
            throw new Error(`Server Error: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        // 2. Safety Check: Only save if it's a real list (Array)
        if (Array.isArray(data)) {
            setProducts(data);
        } else {
            setProducts([]); // If data is weird, show empty list
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("❌ Fetch Failed:", err);
        setProducts([]); // 3. Don't crash! Just show nothing.
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Hero />
      <main className="flex-grow max-w-7xl mx-auto px-6 pb-20 w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">✨ Our Collection ✨</h2>
        </div>

        {loading ? (
           <div className="text-center py-20">Loading products...</div>
        ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
             {/* 4. Only map if we have products */}
             {products.length > 0 ? (
                 products.map(product => (
                   <div key={product.id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-xl flex flex-col">
                      <div className="h-48 overflow-hidden bg-gray-100">
                        <img src={product.image_url || 'https://placehold.co/300'} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-5 flex flex-col flex-grow">
                        <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>
                        <div className="mt-auto flex justify-between items-center mb-4">
                          <span className="text-xl font-bold text-blue-600">${product.price}</span>
                        </div>
                        <button onClick={() => addToCart(product)} className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-blue-600">
                          Add to Cart
                        </button>
                      </div>
                   </div>
                 ))
             ) : (
                 <div className="col-span-full text-center py-10 text-red-500">
                     <p className="font-bold">⚠️ Connection Issue</p>
                     <p>We couldn't load the products. (The server might be sleeping or the database password is wrong).</p>
                 </div>
             )}
           </div>
        )}
      </main>
      <Footer />
    </div>
  );
}