import React from 'react';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";

export default function GetStarted() {
  return (
    <div
      className="w-full h-[500px] bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1705368118174-ae5c17c0036d?q=80&w=2075&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }}
    >
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
         <SignedOut>
          <>
            <SignUpButton mode="modal" forceRedirectUrl="/home">
             <button className="bg-[#0E2148] hover:opacity-90 text-white font-semibold rounded-full px-8 py-4 text-base md:text-lg flex items-center transition shadow-lg">
              Get Started
             </button>
            </SignUpButton>
          </>
         </SignedOut>
      </div>
    </div>
  );
}


