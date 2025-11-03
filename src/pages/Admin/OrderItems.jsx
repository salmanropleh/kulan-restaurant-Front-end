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
} from "lucide-react";

const OrderItems = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [groupedOrders, setGroupedOrders] = useState([]);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockOrderItems = [
      {
        id: 1,
        order: {
          id: 1001,
          customer_name: "John Doe",
          total_amount: 110.99,
          status: "Preparing",
        },
        menu_item: {
          id: 1,
          name: "KULAN Signature Platter",
          image: "/api/placeholder/40/40",
          category: { name: "KULAN Specialties" },
        },
        price: 45.99,
        quantity: 1,
      },
      {
        id: 2,
        order: {
          id: 1001,
          customer_name: "John Doe",
          total_amount: 110.99,
          status: "Preparing",
        },
        menu_item: {
          id: 2,
          name: "Sanaki Wa Kupaka",
          image: "/api/placeholder/40/40",
          category: { name: "Dinner" },
        },
        price: 32.5,
        quantity: 2,
      },
      {
        id: 3,
        order: {
          id: 1002,
          customer_name: "Jane Smith",
          total_amount: 45.99,
          status: "Ready",
        },
        menu_item: {
          id: 3,
          name: "Malawah Pancakes",
          image: null,
          category: { name: "Breakfast" },
        },
        price: 12.99,
        quantity: 1,
      },
      {
        id: 4,
        order: {
          id: 1003,
          customer_name: "Mike Johnson",
          total_amount: 25.5,
          status: "Delivered",
        },
        menu_item: {
          id: 4,
          name: "Hilib Ari",
          image: "/api/placeholder/40/40",
          category: { name: "Lunch" },
        },
        price: 25.5,
        quantity: 1,
      },
    ];
    setOrderItems(mockOrderItems);

    // Group items by order
    const grouped = mockOrderItems.reduce((acc, item) => {
      const orderId = item.order.id;
      if (!acc[orderId]) {
        acc[orderId] = {
          order: item.order,
          items: [],
        };
      }
      acc[orderId].items.push(item);
      return acc;
    }, {});

    setGroupedOrders(Object.values(grouped));
    setFilteredItems(Object.values(grouped));
  }, []);

  // Filter items
  useEffect(() => {
    let filtered = groupedOrders.filter((group) => {
      const matchesSearch =
        group.order.customer_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        group.order.id.toString().includes(searchTerm) ||
        group.items.some(
          (item) =>
            item.menu_item.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            item.menu_item.category.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        );

      const matchesStatus =
        !statusFilter ||
        group.order.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
    setFilteredItems(filtered);
  }, [searchTerm, statusFilter, groupedOrders]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
  };

  const getStatusBadge = (status) => {
    const baseClasses =
      "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105";

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
        return `${baseClasses} bg-indigo-100 text-indigo-800`;
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
      case "pending":
        return <Clock className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const getTotalItems = () => {
    return filteredItems.reduce(
      (total, group) => total + group.items.length,
      0
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
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
        <div className="mt-4 sm:mt-0">
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {getTotalItems()} item{getTotalItems() !== 1 ? "s" : ""} found
          </span>
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
            <option value="Preparing">Preparing</option>
            <option value="Ready">Ready</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
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
              {filteredItems.map((group) => (
                <tr
                  key={group.order.id}
                  className="hover:bg-gray-50 transition-all duration-200"
                >
                  {/* Order & Item Info */}
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-col gap-1">
                      {group.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center space-x-3 bg-gray-50 hover:bg-yellow-50 p-1 rounded transition-all duration-200"
                        >
                          {/* Item Image */}
                          {item.menu_item.image ? (
                            <img
                              src={item.menu_item.image}
                              alt={item.menu_item.name}
                              className="w-10 h-10 rounded object-cover border border-gray-200"
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
                              {item.menu_item.name}
                            </div>

                            {/* Order Number & Customer Name */}
                            <div className="text-xs text-gray-500">
                              Order #{group.order.id} •{" "}
                              {group.order.customer_name}
                            </div>

                            {/* Item ID */}
                            <div className="text-xs text-gray-400">
                              #{item.menu_item.id}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3 text-gray-600 align-top">
                    {group.items[0].menu_item.category?.name || "Uncategorized"}
                  </td>

                  {/* Quantity */}
                  <td className="px-4 py-3 text-center align-top">
                    {group.items.length}
                  </td>

                  {/* Unit Price */}
                  <td className="px-4 py-3 text-right align-top">
                    ${group.items[0].price.toFixed(2)}
                  </td>

                  {/* Total */}
                  <td className="px-4 py-3 text-right font-semibold align-top">
                    ${group.order.total_amount.toFixed(2)}
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-3 text-center align-top">
                    <span className={getStatusBadge(group.order.status)}>
                      {getStatusIcon(group.order.status)}
                      {group.order.status}
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
