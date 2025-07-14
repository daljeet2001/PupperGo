import React from 'react';
import {
  SignedOut,
  SignUpButton,
} from "@clerk/clerk-react";

export default function GetStarted() {
  return (
    <div
      className="w-full h-[500px] bg-cover bg-center relative text-white"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1601758260651-32188a43c9b3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }}
    >
      {/* Centered Text Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
         Get paid to play with pets
        </h1>
        <p className="text-base md:text-lg max-w-xl drop-shadow-md">         
          PupperGo makes it easy and promotes you to the nation’s largest network of pet owners.
          Earn money doing something you love.
        </p>
      </div>

      {/* Get Started Button */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <SignedOut>
          <SignUpButton mode="modal" forceRedirectUrl="/home">
            <button className="bg-[#0E2148] hover:opacity-90 text-white font-semibold rounded-full px-8 py-4 text-base md:text-lg flex items-center transition shadow-lg">
              Get Started
            </button>
          </SignUpButton>
        </SignedOut>
      </div>
    </div>
  );
}

