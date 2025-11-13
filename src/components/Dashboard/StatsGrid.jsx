import React, { useState, useEffect } from "react";
import StatCard from "./StatCard";

const StatsGrid = () => {
  const [stats, setStats] = useState([
    { title: "Categories", value: "0", color: "bg-blue-500", loading: true },
    { title: "Order Items", value: "0", color: "bg-green-500", loading: true },
    { title: "Menu Items", value: "0", color: "bg-purple-500", loading: true },
    {
      title: "Reservations",
      value: "0",
      color: "bg-yellow-500",
      loading: true,
    },
    { title: "Total Orders", value: "0", color: "bg-red-500", loading: true },
    {
      title: "Total Messages", // Changed from "Unread Messages"
      value: "0",
      color: "bg-indigo-500",
      loading: true,
    },
  ]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      // Fetch all API data in parallel
      const [
        categoriesResponse,
        menuItemsResponse,
        ordersResponse,
        orderItemsResponse,
        reservationsResponse,
        messagesResponse,
      ] = await Promise.all([
        fetch(`http://localhost:8000/api/menu/categories/`, { headers }),
        fetch(`http://localhost:8000/api/menu/items/`, { headers }),
        fetch(`http://localhost:8000/api/orders/orders/`, { headers }),
        fetch(`http://localhost:8000/api/orders/order-items/`, { headers }),
        fetch(`http://localhost:8000/api/reservations/reservations/`, {
          headers,
        }),
        fetch(`http://localhost:8000/api/contact/messages/`, { headers }), // Direct fetch instead of custom function
      ]);

      // Parse responses
      const categoriesData = await categoriesResponse.json();
      const menuItemsData = await menuItemsResponse.json();
      const ordersData = await ordersResponse.json();
      const orderItemsData = await orderItemsResponse.json();
      const reservationsData = await reservationsResponse.json();
      const messagesData = await messagesResponse.json();

      // Helper function to extract count
      const getCount = (data) => {
        if (typeof data.count === "number") return data.count;
        if (Array.isArray(data)) return data.length;
        if (Array.isArray(data.results)) return data.results.length;
        if (typeof data === "object" && data !== null) {
          // Handle reservations API response format
          if (Array.isArray(data)) return data.length;
          if (data.results && Array.isArray(data.results))
            return data.results.length;
          return data;
        }
        return 0;
      };

      // Get total messages count (all messages, both read and unread)
      const totalMessagesCount = getCount(messagesData);

      // Update stats with real data
      setStats([
        {
          title: "Categories",
          value: getCount(categoriesData),
          color: "bg-blue-500",
          loading: false,
        },
        {
          title: "Order Items",
          value: getCount(orderItemsData),
          color: "bg-green-500",
          loading: false,
        },
        {
          title: "Menu Items",
          value: getCount(menuItemsData),
          color: "bg-purple-500",
          loading: false,
        },
        {
          title: "Reservations",
          value: getCount(reservationsData),
          color: "bg-yellow-500",
          loading: false,
        },
        {
          title: "Total Orders",
          value: getCount(ordersData),
          color: "bg-red-500",
          loading: false,
        },
        {
          title: "Total Messages", // Changed from "Unread Messages"
          value: totalMessagesCount,
          color: "bg-indigo-500",
          loading: false,
        },
      ]);
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Fallback to showing 0 for all stats
      setStats([
        {
          title: "Categories",
          value: "0",
          color: "bg-blue-500",
          loading: false,
        },
        {
          title: "Order Items",
          value: "0",
          color: "bg-green-500",
          loading: false,
        },
        {
          title: "Menu Items",
          value: "0",
          color: "bg-purple-500",
          loading: false,
        },
        {
          title: "Reservations",
          value: "0",
          color: "bg-yellow-500",
          loading: false,
        },
        {
          title: "Total Orders",
          value: "0",
          color: "bg-red-500",
          loading: false,
        },
        {
          title: "Total Messages", // Changed from "Unread Messages"
          value: "0",
          color: "bg-indigo-500",
          loading: false,
        },
      ]);
    }
  };

  useEffect(() => {
    fetchData();

    // Auto-refresh every 2 minutes
    const interval = setInterval(fetchData, 120000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    // Set loading for all stats
    setStats((prev) =>
      prev.map((stat) => ({
        ...stat,
        loading: true,
      }))
    );
    fetchData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Dashboard Overview
        </h2>
        <button
          onClick={handleRefresh}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-2 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            color={stat.color}
            loading={stat.loading}
          />
        ))}
      </div>
    </div>
  );
};

export default StatsGrid;
