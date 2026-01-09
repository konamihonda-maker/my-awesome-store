import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <div className="relative bg-gray-900 overflow-hidden mb-8">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Shopping Background"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/60 to-transparent" />
      </div>

      {/* Text Content */}
      <div className="relative max-w-7xl mx-auto py-24 px-6 sm:py-32 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          End of Year <span className="text-blue-500">Super Sale</span>
        </h1>
        <p className="mt-6 text-xl text-gray-300 max-w-3xl">
          Get the best deals on premium digital assets. 
          Limited time offer: Up to 50% off on selected items!
        </p>
        <div className="mt-10 flex gap-4">
          <a href="#products" className="inline-block bg-blue-600 border border-transparent py-3 px-8 rounded-md font-medium text-white hover:bg-blue-700 transition shadow-lg shadow-blue-500/30">
            Shop Now
          </a>
          <Link to="/login" className="inline-block bg-white/10 border border-white/20 py-3 px-8 rounded-md font-medium text-white hover:bg-white/20 transition backdrop-blur-sm">
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}