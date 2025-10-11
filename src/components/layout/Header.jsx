import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Utensils } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "Specials", href: "/specials" },
    { name: "Favorites", href: "/favorites" },
    { name: "About", href: "/about" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <nav className="container-custom px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 lg:py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <Utensils className="h-7 w-7 lg:h-8 lg:w-8 text-primary" />
            <span className="text-xl lg:text-2xl font-display font-bold text-gray-900 whitespace-nowrap">
              KULAN RESTAURANT
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`font-medium transition-colors duration-200 whitespace-nowrap text-sm xl:text-base ${
                  isActive(item.href)
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-600 hover:text-primary"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
            <Link
              to="/reservations"
              className="bg-primary text-white px-4 xl:px-6 py-2 rounded-full hover:bg-accent transition-colors duration-200 font-medium text-sm xl:text-base whitespace-nowrap"
            >
              Reserve Table
            </Link>
            <Link
              to="/order-online"
              className="bg-secondary text-white px-4 xl:px-6 py-2 rounded-full hover:bg-orange-600 transition-colors duration-200 font-medium text-sm xl:text-base whitespace-nowrap"
            >
              Order Online
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`font-medium py-2 text-base ${
                    isActive(item.href) ? "text-primary" : "text-gray-600"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link
                  to="/reservations"
                  className="bg-primary text-white px-4 py-3 rounded-full text-base font-medium text-center hover:bg-accent transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Reserve Table
                </Link>
                <Link
                  to="/order-online"
                  className="bg-secondary text-white px-4 py-3 rounded-full text-base font-medium text-center hover:bg-orange-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Order Online
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
