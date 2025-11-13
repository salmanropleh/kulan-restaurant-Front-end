import React, { useState, useEffect } from "react";
import { Eye, Clock, CheckCircle, XCircle, Truck, Store } from "lucide-react";
import { Link } from "react-router-dom";

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecentOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("accessToken");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const response = await fetch(
        "http://localhost:8000/api/orders/orders/?ordering=-created_at",
        {
          headers,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }

      const data = await response.json();
      const ordersList = Array.isArray(data) ? data : data.results || data;

      // ✅ Only keep the latest 5 orders
      const recentFive = ordersList
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);

      setOrders(recentFive);
    } catch (error) {
      console.error("Error fetching recent orders:", error);
      setError("Failed to load recent orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "confirmed":
      case "preparing":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "ready":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "delivered":
      case "completed":
        return <Truck className="w-4 h-4 text-purple-500" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "preparing":
        return "bg-orange-100 text-orange-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "delivered":
      case "completed":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getOrderTypeIcon = (orderType) => {
    return orderType === "delivery" ? (
      <Truck className="w-3 h-3" />
    ) : (
      <Store className="w-3 h-3" />
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  const getOrderId = (order) => {
    if (!order.id) return "Unknown";
    return typeof order.id === "string" && order.id.length > 8
      ? `#${order.id.slice(0, 8)}`
      : `#${order.id}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Orders
        </h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="space-y-2 text-right">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Orders
        </h3>
        <div className="text-center py-8">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-2">{error}</p>
          <button
            onClick={fetchRecentOrders}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
        <button
          onClick={fetchRecentOrders}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
        >
          Refresh
        </button>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                  {getStatusIcon(order.status)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {getOrderId(order)}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status?.charAt(0).toUpperCase() +
                        order.status?.slice(1) || "Unknown"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {order.customer_name || "Unknown Customer"}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center justify-end gap-2 mb-1">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                      order.order_type === "delivery"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {getOrderTypeIcon(order.order_type)}
                    {order.order_type?.charAt(0).toUpperCase() +
                      order.order_type?.slice(1) || "Unknown"}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  ${parseFloat(order.total_amount || 0).toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(order.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Eye className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 mb-2">No recent orders</p>
          <p className="text-gray-400 text-sm">
            New orders will appear here as they come in
          </p>
        </div>
      )}

      {orders.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Link
            to="/admin/orders"
            className="w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium block"
          >
            View All Orders
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecentOrders;
