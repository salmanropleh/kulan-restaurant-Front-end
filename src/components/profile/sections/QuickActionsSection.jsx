import React from "react";
import {
  Package,
  Calendar,
  User,
  Heart,
  Clock,
  MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickActionsSection = ({ setActiveSection }) => {
  const navigate = useNavigate();

  const quickActions = [
    {
      icon: Package,
      label: "Order Food",
      description: "Start a new order",
      action: () => navigate("/menu"),
    },
    {
      icon: Calendar,
      label: "Book Table",
      description: "Make a reservation",
      action: () => navigate("/reservations"),
    },
    {
      icon: User,
      label: "Profile Info",
      description: "Update personal details",
      action: () => setActiveSection("profile"),
    },
    {
      icon: Heart,
      label: "My Favorites",
      description: "View saved items",
      action: () => setActiveSection("favorites"),
    },
    {
      icon: Clock,
      label: "My Orders",
      description: "Past orders & history",
      action: () => setActiveSection("orders"),
    },
    {
      icon: MessageCircle,
      label: "Contact Support",
      description: "Get help",
      action: () => navigate("/contact"),
    },
  ];

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.action}
              className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all text-left cursor-pointer w-full group"
            >
              <Icon className="h-8 w-8 text-orange-600 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 mb-1">
                {action.label}
              </h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActionsSection;
