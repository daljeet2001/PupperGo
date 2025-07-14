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
      <div className="flex items-center ml-4 text-[#0E2148] font-bold text-2xl">
        <span className="text-2xl font-bold tracking-tight">PupperGo</span>    
      </div>
    </header>
  );
}