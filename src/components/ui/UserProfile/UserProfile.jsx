// Front-End/src/components/ui/UserProfile/UserProfile.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  LogOut,
  Settings,
  LayoutDashboard,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const UserProfile = ({ mobileView = false }) => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`flex items-center space-x-2 ${
          mobileView
            ? "bg-primary text-white hover:bg-accent px-4 py-2.5 rounded-full transition-colors cursor-pointer w-full justify-center"
            : "bg-primary text-white hover:bg-accent px-3 py-1.5 rounded-full transition-colors cursor-pointer"
        }`}
      >
        <User className={mobileView ? "h-4 w-4" : "h-3 w-3 xl:h-4 xl:w-4"} />
        <span
          className={`font-medium ${
            mobileView ? "text-base" : "text-xs xl:text-sm"
          }`}
        >
          {user.first_name || user.username}
        </span>
        {mobileView ? (
          <ChevronUp
            className={`h-4 w-4 transition-transform ${
              isOpen ? "rotate-0" : "rotate-180"
            }`}
          />
        ) : (
          <ChevronDown
            className={`h-3 w-3 transition-transform ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        )}
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            mobileView
              ? "bottom-full left-0 mb-2 w-full min-w-64" // Appears upward on mobile with full width
              : "right-0 mt-2 w-56" // Appears downward on desktop
          } bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-[60] backdrop-blur-sm bg-white/95`}
        >
          {/* User Info Section */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white rounded-t-xl">
            <p className="text-sm font-semibold text-gray-900">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-xs text-gray-600 mt-1 truncate">{user.email}</p>
            {(user.is_staff || user.is_superuser) && (
              <span className="inline-block mt-2 px-2.5 py-1 text-xs font-medium bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 rounded-full border border-orange-200">
                {user.is_superuser ? "Super Admin" : "Staff"}
              </span>
            )}
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {/* Dashboard Link - Only show for staff/admin users */}
            {(user.is_staff || user.is_superuser) && (
              <Link
                to="/admin"
                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group border-l-2 border-transparent hover:border-blue-500"
                onClick={() => setIsOpen(false)}
              >
                <LayoutDashboard className="h-4 w-4 mr-3 text-gray-400 group-hover:text-blue-500" />
                Dashboard
              </Link>
            )}

            <Link
              to="/profile"
              className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group border-l-2 border-transparent hover:border-gray-400"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="h-4 w-4 mr-3 text-gray-400 group-hover:text-gray-600" />
              Profile Settings
            </Link>

            <div className="border-t border-gray-100 my-1"></div>

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 group border-l-2 border-transparent hover:border-red-500"
            >
              <LogOut className="h-4 w-4 mr-3 text-red-400 group-hover:text-red-500" />
              Sign Out
            </button>
          </div>

          {/* Mobile dropdown arrow indicator */}
          {mobileView && (
            <div className="absolute -bottom-1 left-4 w-3 h-3 bg-white border-b border-r border-gray-200 transform rotate-45"></div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
