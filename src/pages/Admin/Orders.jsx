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
} from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockOrders = [
      {
        id: 1,
        customer_name: "John Doe",
        customer_email: "john@example.com",
        customer_phone: "+1234567890",
        delivery_address: "123 Main St, City, State",
        order_items_list: [
          {
            menu_item: {
              name: "KULAN Signature Platter",
              image: "/api/placeholder/32/32",
            },
            quantity: 1,
            price: 45.99,
          },
          {
            menu_item: {
              name: "Sanaki Wa Kupaka",
              image: "/api/placeholder/32/32",
            },
            quantity: 2,
            price: 32.5,
          },
        ],
        order_type: "delivery",
        total_amount: 110.99,
        status: "preparing",
        created_at: "2024-01-15T14:30:00Z",
      },
      {
        id: 2,
        customer_name: "Jane Smith",
        customer_email: "jane@example.com",
        customer_phone: "+0987654321",
        delivery_address: null,
        order_items_list: [
          {
            menu_item: {
              name: "Malawah Pancakes",
              image: "/api/placeholder/32/32",
            },
            quantity: 1,
            price: 12.99,
          },
        ],
        order_type: "pickup",
        total_amount: 12.99,
        status: "ready",
        created_at: "2024-01-15T15:20:00Z",
      },
    ];
    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
  }, []);

  // Filter orders
  useEffect(() => {
    let filtered = orders.filter((order) => {
      const matchesSearch =
        order.id.toString().includes(searchTerm.toLowerCase()) ||
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.customer_phone && order.customer_phone.includes(searchTerm));

      const matchesStatus =
        !statusFilter ||
        order.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesType =
        !typeFilter ||
        order.order_type.toLowerCase() === typeFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesType;
    });
    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, typeFilter, orders]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setTypeFilter("");
  };

  const getStatusBadge = (status) => {
    const baseClasses =
      "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold transition-all";

    switch (status.toLowerCase()) {
      case "preparing":
        return `${baseClasses} bg-yellow-100 text-yellow-800 animate-pulse`;
      case "ready":
        return `${baseClasses} bg-green-100 text-green-800 animate-pulse`;
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
    switch (status.toLowerCase()) {
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
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
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

        {/* Add New Order Button */}
        <div className="mt-4 sm:mt-0 sm:ml-4">
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded text-sm font-medium shadow-sm transition-all inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New Order
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
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
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
            {filteredOrders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50 transition-all duration-200"
              >
                <td className="px-3 py-2 align-top font-medium text-gray-800">
                  #{order.id}
                </td>

                {/* Customer Column */}
                <td className="px-3 py-2 align-top text-xs text-gray-700">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900">
                      {order.customer_name}
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
                  {order.order_items_list &&
                  order.order_items_list.length > 0 ? (
                    <div className="space-y-1">
                      {order.order_items_list.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-gray-50 hover:bg-yellow-50 p-1 rounded-md transition-all duration-200"
                        >
                          <img
                            src={
                              item.menu_item.image || "/api/placeholder/32/32"
                            }
                            alt={item.menu_item.name}
                            className="w-8 h-8 rounded object-cover border border-gray-200 shadow-sm"
                          />
                          <div className="flex flex-col leading-tight text-left">
                            <span className="text-gray-800 font-medium text-[13px]">
                              {item.menu_item.name}
                            </span>
                            <span className="text-gray-500 text-[11px]">
                              Qty: {item.quantity} × ${item.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">No items</span>
                  )}
                  {order.order_items_list &&
                    order.order_items_list.length > 0 && (
                      <p className="text-[11px] text-gray-400 mt-1 italic">
                        {order.order_items_list.length}
                        {order.order_items_list.length === 1
                          ? " item"
                          : " items"}
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
                    {order.order_type.charAt(0).toUpperCase() +
                      order.order_type.slice(1)}
                  </span>
                </td>

                <td className="px-3 py-2 align-top font-semibold text-gray-800">
                  ${order.total_amount.toFixed(2)}
                </td>

                {/* Status Column */}
                <td className="px-3 py-2 align-top text-center">
                  <span className={getStatusBadge(order.status)}>
                    {getStatusIcon(order.status)}
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
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
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No orders found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
