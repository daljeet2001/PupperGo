import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function CallToAction() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="rounded-3xl overflow-hidden flex flex-col md:flex-row bg-white text-black ">
        {/* Left Image */}
        <div className="md:w-1/2 w-full h-64 md:h-auto">
          <img
            src="https://images.unsplash.com/photo-1677126297997-acbbd0e87d92?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Dog playing"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Content */}
        <div className="md:w-1/2 w-full flex flex-col justify-center px-8 py-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Animal lovers wanted!</h2>
          <p className="text-base md:text-lg mb-6 leading-relaxed">
            Are you a pet lover with pet care experience? Want to earn money working
            with pets? Learn more about becoming a dog walker, sitter, or trainer in
            your city.
          </p>

          <button className="bg-[#0E2148] hover:opacity-90 text-white font-semibold rounded-full px-6 py-3 text-sm md:text-base flex items-center w-max transition">
            Become a Pet Caregiver
            <ArrowRight className="ml-2 w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
