// Front-End/src/components/layout/Sidebar.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  BarChart3, // Dashboard
  LayoutGrid, // Categories
  Pizza, // Menu Items
  ShoppingCart, // Orders
  ClipboardList, // Order Items
  Calendar, // Reservations
  Mail, // Messages
  Settings, // Settings
  LogOut, // Logout
} from "lucide-react";
import Toast from "../../components/ui/Toast/Toast";

const Sidebar = ({ currentPath, mobileSidebarOpen, onCloseMobile }) => {
  const [sidebarOpen] = React.useState(true);
  const [showLogoutToast, setShowLogoutToast] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { name: "Dashboard", icon: BarChart3, path: "/admin" },
    { name: "Categories", icon: LayoutGrid, path: "/admin/categories" },
    { name: "Menu Items", icon: Pizza, path: "/admin/menu-items" },
    { name: "Orders", icon: ShoppingCart, path: "/admin/orders" },
    { name: "Order Items", icon: ClipboardList, path: "/admin/order-items" },
    { name: "Reservations", icon: Calendar, path: "/admin/reservations" },
    { name: "Messages", icon: Mail, path: "/admin/messages" },
    { name: "Settings", icon: Settings, path: "/admin/settings" },
    { name: "Logout", icon: LogOut, path: "/logout" },
  ];

  const handleLogout = () => {
    // Call the logout function from AuthContext
    logout();

    // Show logout success toast
    setShowLogoutToast(true);

    // Redirect to homepage after a short delay to show the toast
    setTimeout(() => {
      navigate("/");
    }, 1000);

    // Close mobile sidebar after navigation
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleNavigation = (path) => {
    if (path === "/logout") {
      handleLogout();
    } else {
      navigate(path);
      // Close mobile sidebar after navigation
      if (onCloseMobile) {
        onCloseMobile();
      }
    }
  };

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin" || location.pathname === "/admin/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
    ${sidebarOpen ? "w-50" : "w-20"} 
    bg-primary text-white shadow-lg transition-all duration-300
    fixed lg:static inset-y-0 left-0 z-40
    transform ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
    lg:translate-x-0
  `}
      >
        <div className="p-6 border-b border-secondary">
          <h1
            className={`text-2xl font-bold text-white ${
              !sidebarOpen && "hidden"
            }`}
          >
            KULAN
          </h1>
          <p className={`text-gray-200 mt-1 ${!sidebarOpen && "hidden"}`}>
            Management
          </p>
        </div>

        <nav className="mt-6">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center px-6 py-3 transition-colors ${
                isActive(item.path)
                  ? "bg-secondary bg-opacity-50 text-white font-medium"
                  : "text-gray-200 hover:bg-secondary hover:bg-opacity-50 hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {sidebarOpen && <span className="ml-3">{item.name}</span>}
            </button>
          ))}
        </nav>

        {/* Logout Toast */}
        <Toast
          message="Logged out successfully"
          isVisible={showLogoutToast}
          onClose={() => setShowLogoutToast(false)}
          type="success"
        />
      </div>
    </>
  );
};

export default Sidebar;
