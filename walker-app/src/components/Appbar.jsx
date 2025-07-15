import { UserButton, SignedIn, SignedOut, SignInButton, SignUpButton, SignOutButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";

export default function Appbar({ showNotifications, setShowNotifications, notifications }) {
  return (
    <header className="w-full bg-white border-b border-gray-200 px-6 py-4 shadow-sm flex items-center justify-between">  
       <div className="flex items-center h-full">
          {/* <Store className="w-8 h-8 text-[#14BA6C]" /> */}
          <span className="ml-2 font-bold text-xl text-[#1E1E1F]">
            PupperGo
          </span>
        </div>

      <div className="flex items-center gap-4">
        {/* When user is signed in */}
        <SignedIn>
          {/* <UserButton afterSignOutUrl="/" /> */}
          <SignOutButton>
            <a className="font-semibold text-[#0E2148] text-sm cursor-pointer">
              Log Out
            </a>
          </SignOutButton>
        </SignedIn>

        {/* When user is signed out */}
        <SignedOut>
          <SignUpButton mode="modal">
            <a className="font-semibold text-[#0E2148] text-sm cursor-pointer">
              Sign Up/Log In
            </a>
          </SignUpButton>
        </SignedOut>
      </div>
    </header>
  );
}
