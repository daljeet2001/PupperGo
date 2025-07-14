"use client";

import { Facebook, Twitter, Linkedin, Mail, PhoneCall } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-black py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand Info */}
        <div>
          <h2 className="text-black text-2xl font-bold mb-3">PupperGo</h2>
        <p className="text-sm">
            Trusted dog walking services with real-time tracking, secure bookings, and happy tails—every time.
        </p>

        </div>

        {/* Links */}
        <div>
          <h3 className="text-black text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#pricing" className="hover:text-gray-700 transition">Pricing</a></li>
            <li><a href="#integration" className="hover:text-gray-700 transition">Integrations</a></li>
            <li><a href="#faq" className="hover:text-gray-700 transition">FAQs</a></li>
            <li><a href="#contact" className="hover:text-gray-700 transition">Contact</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-black text-lg font-semibold mb-3">Contact Us</h3>
          <div className="flex items-center gap-2 text-sm mb-2">
            <Mail size={16} /> support@puppergo.io
          </div>
          <div className="flex items-center gap-2 text-sm">
            <PhoneCall size={16} /> +91-9876543210
          </div>
          <div className="flex gap-4 mt-4">
            <a href="#"><Facebook size={20} /></a>
            <a href="#"><Twitter size={20} /></a>
            <a href="#"><Linkedin size={20} /></a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center text-xs text-gray-500 mt-10 border-t border-gray-600 pt-6">
        © {new Date().getFullYear()} PupperGo. All rights reserved.
      </div>
    </footer>
  );
}