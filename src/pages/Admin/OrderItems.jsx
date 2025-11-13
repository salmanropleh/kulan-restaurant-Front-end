import React, { useState, useEffect } from "react";
import {
  Search,
  X,
  Eye,
  Edit,
  Trash2,
  Utensils,
  Truck,
  CheckCircle,
  Clock,
  Hourglass,
  Ban,
  RefreshCw,
} from "lucide-react";
import { orderManagementApi } from "../../services/orderManagementApi";
import Toast from "../../components/ui/Toast/Toast";

const OrderItems = () => {
  const [groupedOrders, setGroupedOrders] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
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

    console.log("Raw grouped order items API response:", data); // Debug log

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

  // Load grouped order items from API
  const loadGroupedOrderItems = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (searchTerm) params.search = searchTerm;

      console.log("Fetching grouped order items with params:", params); // Debug log

      const groupedData = await orderManagementApi.getGroupedOrderItems(params);

      // Extract data from response
      const processedData = extractDataFromResponse(groupedData);

      console.log("Processed grouped order items:", processedData); // Debug log
      setGroupedOrders(processedData);
      setFilteredItems(processedData);
    } catch (error) {
      console.error("Error loading order items:", error);
      setToastMessage("Error loading order items. Please try again.");
      setShowToast(true);
      setGroupedOrders([]);
      setFilteredItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroupedOrderItems();
  }, [statusFilter]);

  // Filter items locally for search
  useEffect(() => {
    let filtered = groupedOrders.filter((group) => {
      if (!group || typeof group !== "object") return false;

      const orderId = group.order?.id?.toString() || "";
      const customerName = group.order?.customer_name || "";
      const itemNames =
        group.items
          ?.map(
            (item) =>
              item.cached_item_name || item.menu_item_details?.name || ""
          )
          .join(" ") || "";
      const categories =
        group.items
          ?.map(
            (item) =>
              item.cached_item_category ||
              item.menu_item_details?.category?.name ||
              ""
          )
          .join(" ") || "";

      const matchesSearch =
        orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        itemNames.toLowerCase().includes(searchTerm.toLowerCase()) ||
        categories.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
    setFilteredItems(filtered);
  }, [searchTerm, groupedOrders]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
  };

  const getStatusBadge = (status) => {
    const baseClasses =
      "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105";

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
        return `${baseClasses} bg-indigo-100 text-indigo-800`;
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
      case "pending":
        return <Clock className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const getTotalItems = () => {
    return filteredItems.reduce(
      (total, group) => total + (group.items?.length || 0),
      0
    );
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
          <span className="ml-2 text-gray-600">Loading order items...</span>
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

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Order Items Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            View and manage individual menu items within each order.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-4">
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {getTotalItems()} item{getTotalItems() !== 1 ? "s" : ""} found
          </span>
          <button
            onClick={loadGroupedOrderItems}
            className="bg-primary hover:bg-accent text-white px-4 py-2 rounded text-sm font-medium shadow-sm transition-all inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 bg-white rounded-lg shadow border mb-6">
        <div className="relative w-full sm:w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search item, order ID, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-full pl-10 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
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
          <button
            onClick={clearFilters}
            className="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded text-sm font-medium inline-flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        </div>
      </div>

      {/* Order Items Table */}
      {filteredItems.length > 0 ? (
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
              <tr>
                <th className="px-4 py-3">Order & Item</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-center">Qty</th>
                <th className="px-4 py-3 text-right">Unit Price</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems.map((group, groupIndex) => (
                <tr
                  key={group.order?.id || groupIndex}
                  className="hover:bg-gray-50 transition-all duration-200"
                >
                  {/* Order & Item Info */}
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-col gap-1">
                      {group.items?.map((item, itemIndex) => (
                        <div
                          key={item.id || itemIndex}
                          className="flex items-center space-x-3 bg-gray-50 hover:bg-yellow-50 p-1 rounded transition-all duration-200"
                        >
                          {/* Item Image */}
                          {item.menu_item_details?.image ? (
                            <img
                              src={getImageUrl(item.menu_item_details.image)}
                              alt={
                                item.cached_item_name ||
                                item.menu_item_details?.name
                              }
                              className="w-10 h-10 rounded object-cover border border-gray-200"
                              onError={(e) => {
                                e.target.src = "/api/placeholder/32/32";
                              }}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded bg-gray-200 border border-gray-200 flex items-center justify-center">
                              <Utensils className="text-gray-400 w-4 h-4" />
                            </div>
                          )}

                          {/* Item Details */}
                          <div className="flex-1">
                            {/* Item Name */}
                            <div className="font-medium text-gray-800">
                              {item.cached_item_name ||
                                item.menu_item_details?.name ||
                                "Unknown Item"}
                            </div>

                            {/* Order Number & Customer Name */}
                            <div className="text-xs text-gray-500">
                              Order #{group.order?.id?.slice(0, 8) || "Unknown"}{" "}
                              •{" "}
                              {group.order?.customer_name || "Unknown Customer"}
                            </div>

                            {/* Item ID */}
                            <div className="text-xs text-gray-400">
                              #{item.id?.slice(0, 8) || "Unknown"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3 text-gray-600 align-top">
                    {group.items?.[0]?.cached_item_category ||
                      group.items?.[0]?.menu_item_details?.category?.name ||
                      "Uncategorized"}
                  </td>

                  {/* Quantity */}
                  <td className="px-4 py-3 text-center align-top">
                    {group.items?.reduce(
                      (total, item) => total + (item.quantity || 0),
                      0
                    ) || 0}
                  </td>

                  {/* Unit Price */}
                  <td className="px-4 py-3 text-right align-top">
                    ${safeToFixed(group.items?.[0]?.price_at_time)}
                  </td>

                  {/* Total */}
                  <td className="px-4 py-3 text-right font-semibold align-top">
                    ${safeToFixed(group.order?.total_amount)}
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-3 text-center align-top">
                    <span className={getStatusBadge(group.order?.status)}>
                      {getStatusIcon(group.order?.status)}
                      {group.order?.status || "Unknown"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 align-top">
                    <div className="flex justify-center space-x-3">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-800 text-sm font-medium transition-colors duration-200">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors duration-200">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500 bg-white rounded-lg shadow border">
          <Utensils className="mx-auto w-12 h-12 mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">No order items found</p>
          <p className="text-sm text-gray-400">
            There are currently no order items to display.
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderItems;
