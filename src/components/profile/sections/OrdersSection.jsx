import React from "react";
import { Package, AlertCircle, Loader } from "lucide-react";
import OrderCard from "../cards/OrderCard";

const OrdersSection = ({ orders, loading, error }) => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h2>

      {error && (
        <div className="flex items-center space-x-2 text-red-500 bg-red-50 p-4 rounded-lg mb-6">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader className="h-8 w-8 text-orange-600 animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No orders yet
          </h3>
          <p className="text-gray-500 mb-4">
            Start your first order and it will appear here
          </p>
          <button
            onClick={() => (window.location.href = "/menu")}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} showDetailsButton={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersSection;
