import React from "react";
import { Link } from "react-router-dom";
import { Utensils, Facebook, Instagram, Twitter, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom section-padding">
        <div className="py-8 lg:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Utensils className="h-7 w-7 lg:h-8 lg:w-8 text-secondary" />
              <span className="text-xl lg:text-2xl font-display font-bold">
                KULAN RESTAURANT
              </span>
            </Link>
            <p className="text-gray-400 mb-4 text-sm lg:text-base">
              Authentic cuisine crafted with passion and the finest ingredients
              since 2010.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Mail className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/menu"
                  className="text-gray-400 hover:text-white text-sm lg:text-base"
                >
                  Menu
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-white text-sm lg:text-base"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery"
                  className="text-gray-400 hover:text-white text-sm lg:text-base"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white text-sm lg:text-base"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-gray-400 text-sm lg:text-base">
              <p>123 Main Street</p>
              <p>City, State 10001</p>
              <p>+1 (555) 123-4567</p>
              <p>info@kulanrestaurant.com</p>
            </div>
          </div>

          {/* Newsletter */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-display text-lg font-semibold mb-4">
              Newsletter
            </h3>
            <p className="text-gray-400 mb-4 text-sm lg:text-base">
              Subscribe for updates and special offers
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded-lg flex-grow text-gray-900 text-sm lg:text-base min-w-0"
              />
              <button className="bg-secondary px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap text-sm lg:text-base sm:w-auto w-full">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-4 lg:py-6 text-center text-gray-400">
          <p className="text-sm lg:text-base">
            &copy; 2024 KULAN RESTAURANT. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
