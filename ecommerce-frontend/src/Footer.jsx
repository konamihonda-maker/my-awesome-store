export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Column 1: Brand */}
        <div>
          <h3 className="text-white text-lg font-bold mb-4">My Awesome Store</h3>
          <p className="text-sm leading-relaxed">
            The best place to find high-quality digital products. 
            Secure payment and instant delivery guaranteed.
          </p>
        </div>

        {/* Column 2: Links */}
        <div>
          <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition">Home</a></li>
            <li><a href="#products" className="hover:text-white transition">Products</a></li>
            <li><a href="#" className="hover:text-white transition">About Us</a></li>
          </ul>
        </div>

        {/* Column 3: Newsletter */}
        <div>
          <h3 className="text-white text-lg font-bold mb-4">Stay Updated</h3>
          <div className="flex">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-gray-800 border-none text-white px-4 py-2 rounded-l-md focus:ring-1 focus:ring-blue-500 w-full outline-none"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition">
              Join
            </button>
          </div>
        </div>
      </div>
      
      <div className="text-center text-xs mt-12 border-t border-gray-800 pt-8">
        &copy; {new Date().getFullYear()} My Awesome Store. All rights reserved.
      </div>
    </footer>
  );
}