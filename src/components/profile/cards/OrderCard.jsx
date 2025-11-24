import React from "react";

const OrderCard = ({ order, showDetailsButton = false }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
      case "preparing":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatOrderNumber = (orderId) => {
    if (!orderId) return "#N/A";

    // Handle ObjectId format (MongoDB)
    if (typeof orderId === "object" && orderId.hex) {
      return `#${orderId.hex.slice(0, 8).toUpperCase()}`;
    }

    // Handle string IDs
    if (typeof orderId === "string") {
      if (orderId.length >= 8) {
        return `#${orderId.slice(0, 8).toUpperCase()}`;
      }
      return `#${orderId.toUpperCase()}`;
    }

    // Handle numeric IDs
    return `#${orderId}`;
  };

  const getOrderItemsPreview = (order) => {
    if (order.items && order.items.length > 0) {
      return order.items
        .slice(0, 2)
        .map(
          (item) =>
            `${item.quantity}x ${
              item.cached_item_name || item.menu_item_details?.name || "Item"
            }`
        )
        .join(", ");
    }
    return "No items";
  };

  const formatOrderDate = (dateString) => {
    if (!dateString) return "Unknown date";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">
            {formatOrderNumber(order.id || order._id)}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {formatOrderDate(
              order.created_at || order.createdAt || order.order_date
            )}
          </p>
        </div>
        <span
          className={`px-3 py-1 text-sm rounded-full capitalize ${getStatusColor(
            order.status
          )}`}
        >
          {order.status || "unknown"}
        </span>
      </div>

      <p className="text-gray-700 mb-2">
        {getOrderItemsPreview(order)}
        {order.items &&
          order.items.length > 2 &&
          ` and ${order.items.length - 2} more...`}
      </p>

      <div className="flex justify-between items-center">
        <p className="text-lg font-bold text-gray-900">
          ${parseFloat(order.total_amount || order.total || 0).toFixed(2)}
        </p>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 capitalize">
            {order.order_type || "delivery"} • {order.items?.length || 0} items
          </span>
          {showDetailsButton && (
            <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
              View Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
