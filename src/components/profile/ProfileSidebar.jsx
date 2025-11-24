import React from "react";
import {
  User,
  Home,
  Package,
  Calendar,
  Heart,
  Star,
  Shield,
  Settings,
  MessageCircle,
} from "lucide-react";

const ProfileSidebar = ({
  user,
  profilePictureUrl,
  activeSection,
  setActiveSection,
  ordersCount,
  reservationsCount,
  messagesCount,
  favoritesCount = 0, // Add prop with default value
  loyaltyStatus = "Gold", // Add prop with default value
  navigate,
}) => {
  const navItems = [
    { id: "overview", label: "Overview", icon: Home, badge: null },
    {
      id: "orders",
      label: "My Orders",
      icon: Package,
      badge: ordersCount > 0 ? ordersCount.toString() : null,
    },
    {
      id: "reservations",
      label: "My Reservations",
      icon: Calendar,
      badge: reservationsCount > 0 ? reservationsCount.toString() : null,
    },
    {
      id: "favorites",
      label: "My Favorites",
      icon: Heart,
      badge: favoritesCount > 0 ? favoritesCount.toString() : null,
    },
    { id: "quick-actions", label: "Quick Actions", icon: Star, badge: null },
    {
      id: "loyalty",
      label: "Loyalty Status",
      icon: Shield,
      badge: loyaltyStatus,
    },
    { id: "profile", label: "Profile Info", icon: User, badge: null },
    { id: "preferences", label: "Preferences", icon: Settings, badge: null },
    {
      id: "messages",
      label: "Messages",
      icon: MessageCircle,
      badge: messagesCount > 0 ? messagesCount.toString() : null,
    },
  ];

  return (
    <div className="lg:w-64 flex-shrink-0">
      <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
        {/* Profile Summary */}
        <div className="text-center mb-6 pb-6 border-b border-gray-200">
          <div className="relative inline-block mb-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mx-auto overflow-hidden border-2 border-white shadow-md">
              {profilePictureUrl ? (
                <img
                  src={profilePictureUrl}
                  alt={user.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-6 w-6 text-white" />
              )}
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 text-sm">
            {user.fullName}
          </h3>
          <p className="text-xs text-gray-500 mt-1">{user.role}</p>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                  activeSection === item.id
                    ? "bg-orange-50 text-orange-700 border border-orange-200"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center">
                  <Icon className="h-4 w-4 mr-3" />
                  {item.label}
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      item.id === "loyalty"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Admin Quick Access */}
        {user.isAdmin && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate("/admin")}
              className="w-full flex items-center px-3 py-2 text-sm text-orange-700 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <Shield className="h-4 w-4 mr-3" />
              Admin Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSidebar;
