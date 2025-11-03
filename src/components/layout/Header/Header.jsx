// Front-End/src/components/layout/Header.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Utensils,
  User,
  ChevronDown,
  ShoppingCart,
} from "lucide-react"; // Added ShoppingCart
import { useAuth } from "../../../context/AuthContext";
import UserProfile from "../../ui/UserProfile/UserProfile";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  // Navigation order: HOME → MENU (dropdown) → GALLERY → CONTACT → ABOUT
  const navigation = [
    { name: "Home", href: "/" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
    { name: "About", href: "/about" },
  ];

  const menuDropdownItems = [
    {
      name: "View Full Menu",
      href: "/menu",
      description: "Explore all categories",
    },
    {
      name: "Chef's Specials",
      href: "/specials",
      description: "Signature dishes",
    },
    { name: "Favorites", href: "/favorites", description: "Your saved items" },
  ];

  const isActive = (path) => location.pathname === path;

  const isMenuActive = () => {
    return (
      location.pathname === "/menu" ||
      location.pathname === "/specials" ||
      location.pathname === "/favorites"
    );
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center py-2 sm:py-3">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 flex-shrink-0 min-w-0"
          >
            <Utensils className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 whitespace-nowrap truncate">
              KULAN RESTAURANT
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6 mx-4">
            {/* Home Link */}
            <Link
              to="/"
              className={`font-medium transition-colors duration-200 whitespace-nowrap text-sm xl:text-base px-2 py-1 ${
                isActive("/")
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-600 hover:text-primary hover:bg-gray-50 rounded"
              }`}
            >
              Home
            </Link>

            {/* Menu Dropdown - Second position */}
            <div className="relative">
              <div
                className="flex items-center"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <button
                  className={`flex items-center space-x-1 font-medium transition-colors duration-200 whitespace-nowrap text-sm xl:text-base px-2 py-1 ${
                    isMenuActive()
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-600 hover:text-primary hover:bg-gray-50 rounded"
                  }`}
                >
                  <span>Menu</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu - Reduced width to fit content */}
                {isDropdownOpen && (
                  <div
                    className="absolute top-full left-0 mt-0 w-50 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50"
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    {menuDropdownItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="block px-4 py-2 hover:bg-gray-50 transition-colors group"
                        onClick={() => {
                          setIsDropdownOpen(false);
                        }}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900 group-hover:text-primary text-sm whitespace-nowrap">
                            {item.name}
                          </span>
                          <span className="text-xs text-gray-500 mt-0.5 whitespace-nowrap">
                            {item.description}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Rest of navigation items */}
            {navigation.slice(1).map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`font-medium transition-colors duration-200 whitespace-nowrap text-sm xl:text-base px-2 py-1 ${
                  isActive(item.href)
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-600 hover:text-primary hover:bg-gray-50 rounded"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-3 flex-shrink-0">
            <Link
              to="/reservations"
              className="bg-primary text-white px-3 xl:px-4 py-1.5 rounded-full hover:bg-accent transition-colors duration-200 font-medium text-xs xl:text-sm whitespace-nowrap"
            >
              Reserve Table
            </Link>
            <Link
              to="/order-online"
              className="flex items-center space-x-1 bg-secondary text-white px-3 xl:px-4 py-1.5 rounded-full hover:bg-orange-600 transition-colors duration-200 font-medium text-xs xl:text-sm whitespace-nowrap"
            >
              <ShoppingCart className="h-3 w-3 xl:h-4 xl:w-4" />
              <span>Cart</span>
            </Link>

            {/* Conditional rendering based on auth state */}
            {user ? (
              <UserProfile />
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1 bg-primary text-white px-3 xl:px-4 py-1.5 rounded-full hover:bg-accent transition-colors duration-200 font-medium text-xs xl:text-sm whitespace-nowrap"
              >
                <User className="h-3 w-3 xl:h-4 xl:w-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-3 border-t border-gray-200 bg-white">
            <div className="flex flex-col space-y-1">
              {/* Home Link */}
              <Link
                to="/"
                className={`font-medium py-2 px-3 rounded-lg text-base transition-colors ${
                  isActive("/")
                    ? "text-primary bg-primary/10"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>

              {/* Mobile Menu Dropdown Items */}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="px-3 py-2 text-sm font-semibold text-gray-500">
                  Menu
                </div>
                {menuDropdownItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block font-medium py-2 px-6 rounded-lg text-base transition-colors ${
                      isActive(item.href)
                        ? "text-primary bg-primary/10"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Rest of navigation items */}
              {navigation.slice(1).map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`font-medium py-2 px-3 rounded-lg text-base transition-colors ${
                    isActive(item.href)
                      ? "text-primary bg-primary/10"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile CTA Buttons */}
              <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-gray-200">
                <Link
                  to="/reservations"
                  className="bg-primary text-white px-4 py-2.5 rounded-full text-base font-medium text-center hover:bg-accent transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Reserve Table
                </Link>
                <Link
                  to="/order-online"
                  className="flex items-center justify-center space-x-2 bg-secondary text-white px-4 py-2.5 rounded-full text-base font-medium text-center hover:bg-orange-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Cart</span>
                </Link>
                {user ? (
                  <div className="text-center py-2 px-4 text-base font-medium text-white bg-primary rounded-full">
                    Welcome, {user.name}!
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center justify-center space-x-2 bg-primary text-white px-4 py-2.5 rounded-full text-base font-medium text-center hover:bg-accent transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>Sign In</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
