"use client";

import { Facebook, Twitter, Linkedin, Mail, PhoneCall } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-black py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand Info */}
        <div>
          <a href="/home" className="flex items-center mb-3">
       
            <span className="font-bold text-xl text-[#1E1E1F]">PupperGo</span>
            <img src="/logo.png" alt="PupperGo Logo" className="h-7 w-7 ml-1" />
          </a>
          <p className="text-sm text-gray-700 leading-relaxed">
            Trusted dog walking services with real-time tracking, secure bookings, 
            and happy tails—every time.
          </p>
        </div>

        {/* Quick Links */}
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
            <Mail size={16} /> <span>support@puppergo.io</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <PhoneCall size={16} /> <span>+91-9876543210</span>
          </div>
          <div className="flex gap-4 mt-4">
            <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
            <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
            <a href="#" aria-label="LinkedIn"><Linkedin size={20} /></a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center text-xs text-gray-500 mt-10 border-t border-gray-300 pt-6">
        © {new Date().getFullYear()} PupperGo. All rights reserved.
      </div>
    </footer>
  );
}
