import { useEffect, useState } from 'react';
import API_BASE_URL from './config';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 💡 FIXED: Changed method to 'GET' to match your server.js
    //fetch('http://localhost:3000/api/orders/history') <-- Use this in the Localhost
    fetch(`${API_BASE_URL}/api/orders/history`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch orders');
        }
        return res.json();
      })
      .then(data => {
        console.log("Orders received:", data); // Check console to see the data
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading history:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4">Loading history...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Sales History</h2>
      
      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <p className="text-gray-500 text-lg">No orders found yet.</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.order_id} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Order Header */}
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <span className="font-bold text-gray-800">Order #{order.order_id}</span>
                  <span className="text-gray-500 text-sm ml-2">
                    {new Date(order.created_at).toLocaleString()}
                  </span>
                </div>
                <span className="font-bold text-blue-600 text-lg">
                  ${parseFloat(order.total_amount).toFixed(2)}
                </span>
              </div>

              {/* Order Items */}
              <div className="p-4 bg-white">
                <ul className="divide-y divide-gray-100">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between py-2 text-sm">
                      <div className="flex items-center">
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                          x{item.quantity}
                        </span>
                        <span className="text-gray-700 font-medium">
                          {item.product_name}
                        </span>
                      </div>
                      <span className="text-gray-600">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}