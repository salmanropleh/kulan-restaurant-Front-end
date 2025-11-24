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
  MoreVertical,
  User,
  Tag,
  Hash,
  Package,
  DollarSign,
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
    setShowFilters(false);
    setMobileMenuOpen(null);
  };

  const getStatusBadge = (status) => {
    const baseClasses =
      "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold transition-all duration-200";

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
      <div className="p-4">
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-2 text-gray-600 text-sm">
            Loading order items...
          </span>
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

      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
          Order Items Management
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          View and manage individual menu items within each order.
        </p>
      </div>

      {/* Header with Count and Refresh - UPDATED FOR BIG SCREENS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full sm:text-sm">
            {getTotalItems()} item{getTotalItems() !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={loadGroupedOrderItems}
            className="flex-1 sm:flex-none bg-primary hover:bg-accent text-white px-3 py-2 rounded text-sm font-medium transition-colors inline-flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Refresh</span>
            <span className="sm:hidden">Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-lg shadow border p-4 mb-4">
        {/* Search Bar */}
        <div className="flex gap-2 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search order items..."
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
            <Search className="w-4 h-4" />
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

      {/* Order Items Content */}
      <div className="bg-white rounded-lg shadow border">
        {filteredItems.length > 0 ? (
          <>
            {/* Desktop Table - UPDATED LAYOUT */}
            <div className="hidden lg:block overflow-x-auto">
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
                      {/* Order & Item Info - UPDATED LAYOUT */}
                      <td className="px-4 py-3 align-top">
                        <div className="flex flex-col gap-1">
                          {group.items?.map((item, itemIndex) => (
                            <div
                              key={item.id || itemIndex}
                              className="flex items-start space-x-3 bg-gray-50 hover:bg-yellow-50 p-3 rounded transition-all duration-200"
                            >
                              {/* Item Image */}
                              {item.menu_item_details?.image ? (
                                <img
                                  src={getImageUrl(
                                    item.menu_item_details.image
                                  )}
                                  alt={
                                    item.cached_item_name ||
                                    item.menu_item_details?.name
                                  }
                                  className="w-16 h-16 rounded object-cover border border-gray-200 flex-shrink-0"
                                  onError={(e) => {
                                    e.target.src = "/api/placeholder/32/32";
                                  }}
                                />
                              ) : (
                                <div className="w-16 h-16 rounded bg-gray-200 border border-gray-200 flex items-center justify-center flex-shrink-0">
                                  <Utensils className="text-gray-400 w-6 h-6" />
                                </div>
                              )}

                              {/* Item Details - STACKED LAYOUT */}
                              <div className="flex-1 min-w-0">
                                {/* Customer Name */}
                                <div className="font-semibold text-gray-900 text-base mb-1">
                                  {group.order?.customer_name ||
                                    "Unknown Customer"}
                                </div>

                                {/* Item Name */}
                                <div className="font-medium text-gray-800 text-sm mb-2">
                                  {item.cached_item_name ||
                                    item.menu_item_details?.name ||
                                    "Unknown Item"}
                                </div>

                                {/* Order Number */}
                                <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                                  <Hash className="w-3 h-3" />
                                  Order #
                                  {group.order?.id?.slice(0, 8) || "Unknown"}
                                </div>

                                {/* Item ID */}
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Hash className="w-3 h-3" />#
                                  {item.id?.slice(0, 8) || "Unknown"}
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

            {/* Mobile Cards - UPDATED: Image height increased to match content */}
            <div className="lg:hidden space-y-3 p-4">
              {filteredItems.map((group, groupIndex) => (
                <div
                  key={group.order?.id || groupIndex}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Order Header - SIMPLIFIED (removed status from here) */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      {/* Empty header - status moved to bottom */}
                    </div>

                    {/* Mobile Menu */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setMobileMenuOpen(
                            mobileMenuOpen === group.order?.id
                              ? null
                              : group.order?.id
                          )
                        }
                        className="text-gray-400 hover:text-gray-600 p-1"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {mobileMenuOpen === group.order?.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                          <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </button>
                          <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Items
                          </button>
                          <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Items
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3">
                    {group.items?.map((item, itemIndex) => (
                      <div
                        key={item.id || itemIndex}
                        className="border border-gray-100 rounded-lg p-3 bg-gray-50"
                      >
                        {/* Item Header - UPDATED: Image height increased */}
                        <div className="flex items-start gap-3 mb-2">
                          {/* Item Image - INCREASED HEIGHT */}
                          {item.menu_item_details?.image ? (
                            <img
                              src={getImageUrl(item.menu_item_details.image)}
                              alt={
                                item.cached_item_name ||
                                item.menu_item_details?.name
                              }
                              className="w-16 h-20 rounded object-cover border border-gray-200 flex-shrink-0"
                              onError={(e) => {
                                e.target.src = "/api/placeholder/32/32";
                              }}
                            />
                          ) : (
                            <div className="w-16 h-20 rounded bg-gray-200 border border-gray-200 flex items-center justify-center flex-shrink-0">
                              <Utensils className="text-gray-400 w-6 h-6" />
                            </div>
                          )}

                          {/* Item Details - STACKED LIKE DESKTOP */}
                          <div className="flex-1 min-w-0">
                            {/* Customer Name */}
                            <div className="font-semibold text-gray-900 text-sm mb-1">
                              {group.order?.customer_name || "Unknown Customer"}
                            </div>

                            {/* Item Name */}
                            <div className="text-sm text-gray-800 font-medium mb-1">
                              {item.cached_item_name ||
                                item.menu_item_details?.name ||
                                "Unknown Item"}
                            </div>

                            {/* Order Number - ONLY APPEARS ONCE */}
                            <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                              <Hash className="w-3 h-3" />
                              Order #{group.order?.id?.slice(0, 8) || "Unknown"}
                            </div>

                            {/* Item ID */}
                            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                              <Hash className="w-3 h-3" />#
                              {item.id?.slice(0, 8) || "Unknown"}
                            </div>

                            {/* Category */}
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <Tag className="w-3 h-3" />
                              {item.cached_item_category ||
                                item.menu_item_details?.category?.name ||
                                "Uncategorized"}
                            </div>
                          </div>
                        </div>

                        {/* Item Details Grid - UPDATED: Status added here */}
                        <div className="grid grid-cols-2 gap-4 text-sm border-t border-gray-100 pt-2">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">
                              Quantity
                            </div>
                            <div className="flex items-center gap-1 text-gray-700">
                              <Package className="w-3 h-3" />
                              {item.quantity || 0}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">
                              Unit Price
                            </div>
                            <div className="flex items-center gap-1 text-gray-700">
                              <DollarSign className="w-3 h-3" />
                              {safeToFixed(item.price_at_time)}
                            </div>
                          </div>

                          {/* Status and Item Total - Side by side */}
                          <div className="col-span-2 grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-xs text-gray-500 mb-1">
                                Status
                              </div>
                              <div
                                className={getStatusBadge(group.order?.status)}
                              >
                                {getStatusIcon(group.order?.status)}
                                {group.order?.status || "Unknown"}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">
                                Item Total
                              </div>
                              <div className="flex items-center gap-1 font-semibold text-gray-900">
                                <DollarSign className="w-4 h-4" />
                                {safeToFixed(
                                  (item.quantity || 0) *
                                    (parseFloat(item.price_at_time) || 0)
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Total */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-semibold text-gray-900">
                        Order Total
                      </div>
                      <div className="flex items-center gap-1 font-bold text-gray-900">
                        <DollarSign className="w-4 h-4" />
                        {safeToFixed(group.order?.total_amount)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <Utensils className="mx-auto w-12 h-12 mb-3 text-gray-300" />
            <p className="text-gray-500 text-sm mb-2">No order items found</p>
            <p className="text-gray-400 text-xs">
              There are currently no order items to display.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderItems;
