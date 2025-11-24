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
  MoreVertical,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

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
    setShowFilters(false);
    setMobileMenuOpen(null);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderManagementApi.updateOrderStatus(orderId, newStatus);
      setToastMessage(`Order status updated to ${newStatus}`);
      setShowToast(true);
      loadOrders(); // Refresh the list
      setMobileMenuOpen(null);
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
      <div className="p-4">
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-2 text-gray-600 text-sm">Loading orders...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type="success"
      />

      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
          Orders Management
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          View, search, and manage all customer orders in one place.
        </p>
      </div>

      {/* Header with Count and Refresh */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full sm:text-sm">
            {filteredOrders.length} order
            {filteredOrders.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={loadOrders}
            className="flex-1 sm:flex-none bg-primary hover:bg-accent text-white px-3 py-2 rounded text-sm font-medium transition-colors inline-flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-lg shadow border p-4 mb-4">
        {/* Search Bar */}
        <div className="flex gap-2 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded pl-10 pr-4 py-2 text-sm w-full focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            />
          </div>

          {/* Mobile Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden border border-gray-300 hover:bg-gray-50 px-3 py-2 rounded text-sm transition-colors"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* Filters - Collapsible on mobile */}
        <div className={`${showFilters ? "block" : "hidden"} sm:block`}>
          <div className="flex flex-col sm:flex-row gap-2">
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
              className="border border-gray-300 hover:bg-gray-50 px-3 py-2 rounded text-sm font-medium inline-flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* Orders Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredOrders.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Items
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Order
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Created
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Items Column - NOW FIRST */}
                      <td className="px-4 py-3">
                        {getOrderItemsPreview(order).length > 0 ? (
                          <div className="space-y-1">
                            {getOrderItemsPreview(order)
                              .slice(0, 2)
                              .map((item, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2"
                                >
                                  <img
                                    src={getImageUrl(
                                      item.menu_item_details?.image
                                    )}
                                    alt={
                                      item.cached_item_name ||
                                      item.menu_item_details?.name
                                    }
                                    className="w-8 h-8 rounded object-cover border"
                                    onError={(e) => {
                                      e.target.src = "/api/placeholder/32/32";
                                    }}
                                  />
                                  <div className="text-xs">
                                    <div className="font-medium">
                                      {item.cached_item_name ||
                                        item.menu_item_details?.name}
                                    </div>
                                    <div className="text-gray-500">
                                      Qty: {item.quantity}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            {getOrderItemsPreview(order).length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{getOrderItemsPreview(order).length - 2} more
                                items
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">
                            No items
                          </span>
                        )}
                      </td>

                      {/* Order Column - NOW SECOND */}
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {getOrderId(order)}
                      </td>

                      {/* Customer Column - NOW THIRD */}
                      <td className="px-4 py-3">
                        <div className="text-sm font-semibold text-gray-900">
                          {order.customer_name || "Unknown Customer"}
                        </div>
                        {order.customer_phone && (
                          <div className="text-xs text-gray-600">
                            {order.customer_phone}
                          </div>
                        )}
                      </td>

                      {/* Type Column - NOW FOURTH */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                            order.order_type === "delivery"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {order.order_type === "delivery" ? (
                            <Truck className="w-3 h-3" />
                          ) : (
                            <Store className="w-3 h-3" />
                          )}
                          {order.order_type?.charAt(0).toUpperCase() +
                            order.order_type?.slice(1)}
                        </span>
                      </td>

                      {/* Total Column - NOW FIFTH */}
                      <td className="px-4 py-3 font-semibold text-gray-800">
                        ${safeToFixed(order.total_amount)}
                      </td>

                      {/* Status Column - NOW SIXTH */}
                      <td className="px-4 py-3">
                        <select
                          value={order.status || "pending"}
                          onChange={(e) =>
                            handleStatusUpdate(order.id, e.target.value)
                          }
                          className={`text-xs font-semibold border-0 rounded-full px-2 py-1 focus:ring-2 focus:ring-yellow-400 focus:outline-none ${getStatusBadge(
                            order.status
                          )}`}
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

                      {/* Created Column - NOW SEVENTH */}
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {formatDate(order.created_at)}
                      </td>

                      {/* Actions Column - NOW EIGHTH */}
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-800">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards - REARRANGED TO MATCH DESKTOP ORDER */}
            <div className="lg:hidden space-y-3 p-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* ORDER ITEMS - NOW FIRST */}
                  <div className="mb-3">
                    <div className="text-xs font-semibold text-gray-500 mb-2">
                      ITEMS
                    </div>
                    {getOrderItemsPreview(order).length > 0 ? (
                      <div className="space-y-2">
                        {getOrderItemsPreview(order).map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 bg-gray-50 rounded-lg p-2"
                          >
                            <img
                              src={getImageUrl(item.menu_item_details?.image)}
                              alt={
                                item.cached_item_name ||
                                item.menu_item_details?.name
                              }
                              className="w-10 h-10 rounded object-cover border"
                              onError={(e) => {
                                e.target.src = "/api/placeholder/32/32";
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm text-gray-900 truncate">
                                {item.cached_item_name ||
                                  item.menu_item_details?.name}
                              </div>
                              <div className="text-xs text-gray-600">
                                Qty: {item.quantity} × $
                                {safeToFixed(item.price_at_time)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-400 text-sm italic">
                        No items
                      </div>
                    )}
                  </div>

                  {/* ORDER INFO - NOW SECOND */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-900">
                          {getOrderId(order)}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                            order.order_type === "delivery"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {order.order_type === "delivery" ? (
                            <Truck className="w-3 h-3" />
                          ) : (
                            <Store className="w-3 h-3" />
                          )}
                          {order.order_type?.charAt(0).toUpperCase() +
                            order.order_type?.slice(1)}
                        </span>
                      </div>

                      {/* CUSTOMER INFO - NOW THIRD */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">
                            {order.customer_name || "Unknown Customer"}
                          </span>
                        </div>
                        {order.customer_phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {order.customer_phone}
                            </span>
                          </div>
                        )}
                        {order.customer_email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 truncate">
                              {order.customer_email}
                            </span>
                          </div>
                        )}
                        {order.delivery_address && (
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600 flex-1">
                              {order.delivery_address}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Mobile Menu */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setMobileMenuOpen(
                            mobileMenuOpen === order.id ? null : order.id
                          )
                        }
                        className="text-gray-400 hover:text-gray-600 p-1"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {mobileMenuOpen === order.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                          <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </button>
                          <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Order
                          </button>
                          <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Order
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ORDER DETAILS GRID - TYPE, TOTAL, STATUS, CREATED */}
                  <div className="grid grid-cols-2 gap-4 text-sm border-t border-gray-100 pt-3">
                    {/* TYPE - NOW FOURTH */}
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Type</div>
                      <div className="flex items-center gap-1 text-gray-700">
                        {order.order_type === "delivery" ? (
                          <Truck className="w-4 h-4 text-purple-500" />
                        ) : (
                          <Store className="w-4 h-4 text-blue-500" />
                        )}
                        <span className="font-medium">
                          {order.order_type?.charAt(0).toUpperCase() +
                            order.order_type?.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* TOTAL - NOW FIFTH */}
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        Total Amount
                      </div>
                      <div className="flex items-center gap-1 font-semibold text-gray-900">
                        <DollarSign className="w-4 h-4" />
                        {safeToFixed(order.total_amount)}
                      </div>
                    </div>

                    {/* STATUS - NOW SIXTH */}
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Status</div>
                      <select
                        value={order.status || "pending"}
                        onChange={(e) =>
                          handleStatusUpdate(order.id, e.target.value)
                        }
                        className={`text-xs font-semibold border-0 rounded-full px-2 py-1 w-full focus:ring-2 focus:ring-yellow-400 focus:outline-none ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="delivered">Delivered</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    {/* CREATED - NOW SEVENTH */}
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Created</div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {formatDate(order.created_at)}
                      </div>
                    </div>
                  </div>

                  {/* ACTIONS - NOW EIGHTH (in the mobile menu) */}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <Truck className="mx-auto text-4xl text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm mb-2">
              {searchTerm || statusFilter || typeFilter
                ? "No orders match your filters."
                : "No orders found."}
            </p>
            <p className="text-gray-400 text-xs mb-4">
              {searchTerm || statusFilter || typeFilter
                ? "Try adjusting your filters or search term."
                : "Orders will appear here when customers place them."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
