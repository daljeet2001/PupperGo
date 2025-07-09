import { PawPrint, HelpCircle, Bell } from "lucide-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDog,faShieldDog,faPaw} from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";

// ✅ Props passed from parent
export default function Appbar({ showNotifications, setShowNotifications, notifications }) {
  return (
    <header className="w-full bg-white border-b border-gray-200 px-6 py-4 shadow-sm flex items-center justify-between font-[Open_Sans]">
      {/* Left: Logo */}
      <div className="flex items-center space-x-1 text-black font-bold text-2xl">
        <span className="text-2xl font-bold tracking-tight">PupperPro</span>
        <FontAwesomeIcon icon={faPaw} size="sm" />
      </div>

      {/* Right: Auth, Notifications & Help */}
      <div className="flex items-center space-x-5 text-gray-700 font-medium">

        {/* Show notification bell only when signed in */}
        <SignedIn>
          <div className="relative">
            <button onClick={() => setShowNotifications(!showNotifications)}>
              <Box sx={{ color: 'action.active' }}>
                <Badge badgeContent={notifications.length} color="primary">
                  <Bell className="w-5 h-5 text-black cursor-pointer" />
                </Badge>
              </Box>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-[300px] max-h-[400px] overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-4">
                <h3 className="text-lg font-semibold mb-2">Notifications</h3>
                {notifications.length > 0 ? (
                  notifications.map((n, i) => (
                    <div key={i} className="flex justify-between items-center p-2 border-b border-gray-200">
                      <div>
                        <p className="text-sm">{n.message}</p>
                        <p className="text-xs text-gray-500">{n.date}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center mt-4">
                    No Notifications<br />You're all caught up!
                  </p>
                )}
              </div>
            )}
          </div>
        </SignedIn>

        {/* Show Sign Up & Sign In only when signed out */}
        <SignedOut>
          <>
            <SignUpButton mode="modal" forceRedirectUrl="/home">
              <button className="hover:text-black text-sm">Sign Up</button>
            </SignUpButton>

            <SignInButton mode="modal" forceRedirectUrl="/home">
              <button className="hover:text-black text-sm">Sign In</button>
            </SignInButton>
          </>
        </SignedOut>

        {/* User profile when signed in */}
        <SignedIn>
          <UserButton forceRedirectUrl="/" />
        </SignedIn>

        {/* Help link */}
        <Link
          to="/help"
          className="hidden md:flex items-center space-x-1 hover:text-black text-sm"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Help</span>
        </Link>
      </div>
    </header>
  );
}