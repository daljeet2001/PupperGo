import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  const isHomePage = location.pathname === "/";

  return (
    <footer className="bg-gray-50 border-t border-gray-200 text-gray-700 font-[Open_Sans]">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Learn More */}
        <div>
          <h4 className="font-bold mb-3">Learn More</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#">Read Our Blog</a></li>
            <li><a href="#">PawPals Q&A Community</a></li>
            <li><a href="#">PawProtect</a></li>
            <li><a href="#">Safety</a></li>
          </ul>
        </div>

        {/* About */}
        <div>
          <h4 className="font-bold mb-3">About PawPals</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Get the App</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Investor Relations</a></li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="font-bold mb-3">Need Help?</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Privacy Statement</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>

        {/* Newsletter */}
       <div>
        <h4 className="font-bold mb-3">
          All the pet care tips you need—right to your inbox
        </h4>
        <p className="text-sm mb-4">
          Receive the latest adorable pet photos, care tips, training advice,
          product recommendations, and more.
        </p>

        {/* Styled Form */}
        <form className="flex items-center gap-2 mb-3">
          <input
            type="email"
            placeholder="Your Email..."
            className="flex-1 border border-gray-300 px-4 py-2 rounded-md text-sm focus:outline-none"
          />
          <button
            type="submit"
            className="px-5 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-black hover:text-white transition-colors duration-200"
          >
            Sign up
          </button>
        </form>

        <p className="text-xs text-gray-500">
          By providing my email address, I consent to receive marketing
          communications from PawPals and confirm that I am 18 years of age
          or older. I can unsubscribe at any time.
        </p>
</div>

      </div>

      {/* Bottom Row */}
      <div className="border-t border-gray-200 py-6 px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <p>© 2025 PawPals, Inc. All Rights Reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#"><Facebook className="w-4 h-4" /></a>
          <a href="#"><Instagram className="w-4 h-4" /></a>
          <a href="#"><Twitter className="w-4 h-4" /></a>
          <a href="#"><Youtube className="w-4 h-4" /></a>
        </div>
      </div>
    </footer>
  );
}