import { UserButton, SignedIn, SignedOut, SignInButton, SignUpButton, SignOutButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import {BellPlus} from "lucide-react"

export default function Appbar({ showNotifications, setShowNotifications, notifications }) {
  return (
    <header className="w-full bg-white border-b border-gray-200 px-6 py-4 shadow-sm flex items-center justify-between">  
      <div className="flex items-center h-full">
          <span className="ml-2 font-bold text-xl text-[#1E1E1F]">
            PupperGo
          </span>
      </div>
     

    <div className="flex items-center gap-2">
    <SignedIn>
      <div className="relative flex items-center">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 rounded-full hover:bg-gray-100 transition"
        >
          <BellPlus className="w-5 h-5 text-gray-700" />
        </button>

        {showNotifications && (
          <div className="absolute top-6 right-0 mt-2 w-[320px] max-h-[400px] overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg z-20 p-4">
            <h3 className="text-base font-semibold text-gray-800 mb-3 border-b pb-2">
              Notifications
            </h3>
            {notifications.length > 0 ? (
              notifications.map((n, i) => (
                <div
                  key={i}
                  className="p-3 rounded-md bg-gray-50 hover:bg-gray-100 transition mb-2 border border-gray-200"
                >
                  <p className="text-sm text-gray-800">{n.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{n.date}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center mt-6">
                No Notifications<br />You're all caught up!
              </p>
            )}
          </div>
        )}
      </div>
    </SignedIn>

    <SignedIn>
      <SignOutButton>
        <a className="font-semibold text-[#0E2148] text-sm cursor-pointer hover:underline">
          Log Out
        </a>
      </SignOutButton>
    </SignedIn>

    <SignedOut>
      <SignUpButton mode="modal">
        <a className="font-semibold text-[#0E2148] text-sm cursor-pointer hover:underline">
          Sign Up/Log In
        </a>
      </SignUpButton>
    </SignedOut>
</div>

    </header>
  );
}
