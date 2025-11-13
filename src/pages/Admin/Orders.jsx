import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  X,
  Eye,
  Edit,
  Trash2,
  Plus,
  Truck,
  Store,
  Clock,
  CheckCircle,
  CheckSquare,
  Utensils,
  Hourglass,
  Ban,
  RefreshCw,
} from "lucide-react";
import { orderManagementApi } from "../../services/orderManagementApi";
import Toast from "../../components/ui/Toast/Toast";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Helper function to get image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/api/placeholder/32/32";

    // If it's already a full URL, use it
    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    // If it's a relative path, prepend the backend URL
    return `http://localhost:8000${imageUrl}`;
  };

  // Helper function to safely extract data from API response
  const extractDataFromResponse = (data) => {
    if (!data) return [];

    console.log("Raw API response:", data); // Debug log

    // Handle different response formats
    if (Array.isArray(data)) {
      return data;
    } else if (data.results && Array.isArray(data.results)) {
      // Django REST framework pagination format
      return data.results;
    } else if (data.data && Array.isArray(data.data)) {
      // Custom data format
      return data.data;
    } else if (typeof data === "object") {
      // If it's a single object, wrap in array
      return [data];
    }

    return [];
  };

  // Load orders from API
  const loadOrders = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.order_type = typeFilter;

      console.log("Fetching orders with params:", params); // Debug log

      const ordersData = await orderManagementApi.getOrders(params);

      // Extract orders from response
      const ordersList = extractDataFromResponse(ordersData);

      console.log("Processed orders list:", ordersList); // Debug log
      setOrders(ordersList);
      setFilteredOrders(ordersList);
    } catch (error) {
      console.error("Error loading orders:", error);
      setToastMessage("Error loading orders. Please try again.");
      setShowToast(true);
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter, typeFilter]);

  // Filter orders locally for search
  useEffect(() => {
    if (!orders || orders.length === 0) {
      setFilteredOrders([]);
      return;
    }

    let filtered = orders.filter((order) => {
      if (!order || typeof order !== "object") return false;

      const orderId = order.id ? order.id.toString() : "";
      const customerName = order.customer_name || "";
      const customerEmail = order.customer_email || "";
      const customerPhone = order.customer_phone || "";

      const matchesSearch =
        orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerPhone.includes(searchTerm);

      return matchesSearch;
    });
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setTypeFilter("");
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderManagementApi.updateOrderStatus(orderId, newStatus);
      setToastMessage(`Order status updated to ${newStatus}`);
      setShowToast(true);
      loadOrders(); // Refresh the list
    } catch (error) {
      console.error("Error updating order status:", error);
      setToastMessage("Error updating order status");
      setShowToast(true);
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses =
      "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold transition-all";

    switch (status?.toLowerCase()) {
      case "preparing":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "ready":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "delivered":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "cancelled":
        return `${baseClasses} bg-red-100 text-red-800`;
      case "confirmed":
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case "completed":
        return `${baseClasses} bg-emerald-100 text-emerald-800`;
      case "pending":
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "preparing":
        return <Hourglass className="w-3 h-3" />;
      case "ready":
        return <Utensils className="w-3 h-3" />;
      case "delivered":
        return <Truck className="w-3 h-3" />;
      case "cancelled":
        return <Ban className="w-3 h-3" />;
      case "confirmed":
        return <CheckCircle className="w-3 h-3" />;
      case "completed":
        return <CheckSquare className="w-3 h-3" />;
      case "pending":
        return <Clock className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
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
    } catch (error) {
      return "Invalid date";
    }
  };

  const getOrderItemsPreview = (order) => {
    if (order.order_items_preview && order.order_items_preview.length > 0) {
      return order.order_items_preview;
    }
    if (order.items && order.items.length > 0) {
      return order.items.slice(0, 3);
    }
    return [];
  };

  const getOrderId = (order) => {
    if (!order || !order.id) return "Unknown";

    // Handle UUID format
    if (typeof order.id === "string") {
      if (order.id.length > 8) {
        return `#${order.id.slice(0, 8).toUpperCase()}`;
      }
      return `#${order.id}`;
    }

    return `#${order.id}`;
  };

  const safeToFixed = (value, decimals = 2) => {
    if (value === null || value === undefined) return "0.00";
    const num = typeof value === "string" ? parseFloat(value) : value;
    return isNaN(num) ? "0.00" : num.toFixed(decimals);
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-gray-600">Loading orders...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type="success"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">
            Orders Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            View, search, and manage all customer orders in one place.
          </p>
        </div>

        {/* Order Count */}
        <div className="mt-4 sm:mt-0 sm:text-right">
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {filteredOrders.length} order
            {filteredOrders.length !== 1 ? "s" : ""} found
          </span>
        </div>

        {/* Refresh Button */}
        <div className="mt-4 sm:mt-0 sm:ml-4">
          <button
            onClick={loadOrders}
            className="bg-primary hover:bg-accent text-white px-5 py-2 rounded text-sm font-medium shadow-sm transition-all inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 bg-white rounded-lg shadow border mb-6">
        <div className="relative w-full sm:w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by order ID, customer, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded pl-10 pr-3 py-2 text-sm w-full focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="delivered">Delivered</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          >
            <option value="">All Types</option>
            <option value="delivery">Delivery</option>
            <option value="pickup">Pickup</option>
          </select>

          <button
            onClick={clearFilters}
            className="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded text-sm font-medium inline-flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Order
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Customer
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Contact
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Items
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Type
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Total
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="hidden lg:table-cell px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Created
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-all duration-200"
                >
                  <td className="px-3 py-2 align-top font-medium text-gray-800">
                    {getOrderId(order)}
                  </td>

                  {/* Customer Column */}
                  <td className="px-3 py-2 align-top text-xs text-gray-700">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">
                        {order.customer_name || "Unknown Customer"}
                      </span>
                      {order.delivery_address ? (
                        <span className="text-gray-600 text-xs">
                          {order.delivery_address}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic text-xs">
                          No address
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Contact Column */}
                  <td className="px-3 py-2 align-top text-xs text-gray-700">
                    {order.customer_phone ? (
                      <div className="text-xs text-gray-600">
                        {order.customer_phone}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">No phone</span>
                    )}
                    {order.customer_email && (
                      <span className="text-gray-500 text-[11px] block">
                        {order.customer_email}
                      </span>
                    )}
                  </td>

                  {/* Items Column */}
                  <td className="px-3 py-2 align-top text-xs text-gray-600">
                    {getOrderItemsPreview(order).length > 0 ? (
                      <div className="space-y-1">
                        {getOrderItemsPreview(order).map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 bg-gray-50 hover:bg-yellow-50 p-1 rounded-md transition-all duration-200"
                          >
                            <img
                              src={getImageUrl(item.menu_item_details?.image)}
                              alt={
                                item.cached_item_name ||
                                item.menu_item_details?.name
                              }
                              className="w-8 h-8 rounded object-cover border border-gray-200 shadow-sm"
                              onError={(e) => {
                                e.target.src = "/api/placeholder/32/32";
                              }}
                            />
                            <div className="flex flex-col leading-tight text-left">
                              <span className="text-gray-800 font-medium text-[13px]">
                                {item.cached_item_name ||
                                  item.menu_item_details?.name ||
                                  "Unknown Item"}
                              </span>
                              <span className="text-gray-500 text-[11px]">
                                Qty: {item.quantity} × $
                                {safeToFixed(item.price_at_time)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">No items</span>
                    )}
                    {getOrderItemsPreview(order).length > 0 && (
                      <p className="text-[11px] text-gray-400 mt-1 italic">
                        {order.items_count ||
                          getOrderItemsPreview(order).length}
                        {order.items_count === 1 ? " item" : " items"}
                      </p>
                    )}
                  </td>

                  {/* Type Column */}
                  <td className="px-3 py-2 align-top text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105 hover:shadow-md ${
                        order.order_type === "delivery"
                          ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
                          : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                      }`}
                    >
                      {order.order_type === "delivery" ? (
                        <Truck className="w-3 h-3" />
                      ) : (
                        <Store className="w-3 h-3" />
                      )}
                      {order.order_type
                        ? order.order_type.charAt(0).toUpperCase() +
                          order.order_type.slice(1)
                        : "Unknown"}
                    </span>
                  </td>

                  <td className="px-3 py-2 align-top font-semibold text-gray-800">
                    ${safeToFixed(order.total_amount)}
                  </td>

                  {/* Status Column */}
                  <td className="px-3 py-2 align-top text-center">
                    <select
                      value={order.status || "pending"}
                      onChange={(e) =>
                        handleStatusUpdate(order.id, e.target.value)
                      }
                      className={`text-xs font-semibold border-0 rounded-full px-2 py-1 focus:ring-2 focus:ring-yellow-400 focus:outline-none ${getStatusBadge(
                        order.status
                      )
                        .split(" ")
                        .filter((c) => c.includes("bg-") || c.includes("text-"))
                        .join(" ")}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                      <option value="delivered">Delivered</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="hidden lg:table-cell px-3 py-2 align-top text-xs text-gray-600">
                    {formatDate(order.created_at)}
                  </td>

                  {/* Actions Column */}
                  <td className="px-3 py-2 align-top">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 p-1">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-800 p-1">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="px-3 py-8 text-center text-gray-500">
                  No orders found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
