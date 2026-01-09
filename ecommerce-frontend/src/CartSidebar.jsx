'use client'

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useCart } from './CartContext'

export default function CartSidebar({ isOpen, onClose }) {
  const { cartItems, removeFromCart, cartTotal } = useCart()

  // 💡 Debugging Checkout Function
  const handleCheckout = async () => {
    console.log("👉 Button Clicked!"); // 1. Check if button works
    
    if (cartItems.length === 0) {
      alert("Cart is empty!");
      return;
    }

    const confirmBuy = window.confirm(`Pay $${cartTotal.toFixed(2)} for ${cartItems.length} items?`);
    if (!confirmBuy) return;

    console.log("🚀 Sending request to server..."); // 2. Check if logic continues

    try {
      const response = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems, totalAmount: cartTotal }),
      });

      console.log("📡 Server Response Status:", response.status); // 3. Check server reply

      const data = await response.json();

      if (response.ok) {
        alert(`✅ Success! Order #${data.orderId} placed.`);
        // Redirect to Admin Orders page
        window.location.href = '/admin?view=orders'; 
      } else {
        alert(`❌ Server Error: ${data.message}`);
      }
    } catch (error) {
      console.error("❌ Network Error:", error);
      alert('Connection failed! Is the backend (node server.js) running?');
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-[1000]">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 sm:my-8 sm:w-full sm:max-w-lg"
          >
            <div className="bg-white flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
                <DialogTitle className="text-lg font-bold text-gray-900">
                  Shopping Cart ({cartItems.length})
                </DialogTitle>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>

              {/* Items List */}
              <div className="px-4 py-4 max-h-[60vh] overflow-y-auto">
                {cartItems.length === 0 ? (
                  <p className="text-center text-gray-500 py-10">Cart is empty</p>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {cartItems.map((product) => (
                      <li key={product.id} className="flex py-6">
                         <img
                            src={product.image_url || 'https://placehold.co/100'}
                            alt={product.name}
                            className="size-16 rounded-md border border-gray-200 object-contain"
                          />
                          <div className="ml-4 flex flex-1 flex-col">
                            <div className="flex justify-between font-medium text-gray-900">
                              <h3>{product.name}</h3>
                              <p className="text-blue-600">${(product.price * product.quantity).toFixed(2)}</p>
                            </div>
                            <div className="flex items-end justify-between text-sm mt-2">
                              <p className="text-gray-500">Qty: {product.quantity}</p>
                              <button 
                                type="button" 
                                onClick={() => removeFromCart(product.id)}
                                className="font-medium text-red-600 hover:text-red-500"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 px-4 py-6 bg-gray-50">
                <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                  <p>Subtotal</p>
                  <p className="text-xl text-blue-600 font-bold">${cartTotal.toFixed(2)}</p>
                </div>
                
                {/* 💡 CHANGED: Direct onClick, type="button" (Safe) */}
                <button
                  type="button" 
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                  className="w-full rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Checkout Now
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}