import React from "react";
import { Menu, Utensils } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
const Header = ({ onToggleSidebar, mobileSidebarOpen }) => {
  const { user } = useAuth();

  // Get user initial from user data
  const getUserInitial = () => {
    if (!user) return "U";

    // Use fullName if available, otherwise fall back to firstName
    if (user.fullName) {
      return user.fullName.charAt(0).toUpperCase();
    } else if (user.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    } else {
      return "U";
    }
  };

  return (
    <header className="bg-secondary text-white shadow-sm border-b border-orange-600">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side: Brand Logo/Icon */}
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
          <div className="bg-white p-4 rounded-lg flex-shrink-0">
            <Utensils className="text-orange-500 h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg md:text-xl font-bold text-white truncate">
              KULAN RESTAURANT
            </h1>
            <p className="text-xs text-orange-100 block truncate">
              Admin Dashboard
            </p>
          </div>
        </div>

        {/* Right side: Hamburger menu (mobile) and User icon */}
        <div className="flex items-center space-x-4">
          {/* Hamburger menu button - only visible on mobile */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Menu className="h-5 w-5 text-white" />
          </button>

          {/* User icon with initial */}
          <button className="flex items-center justify-center w-14 h-14 rounded-full bg-orange-500 hover:bg-orange-600 transition-colors text-white font-semibold text-sm">
            {getUserInitial()}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
