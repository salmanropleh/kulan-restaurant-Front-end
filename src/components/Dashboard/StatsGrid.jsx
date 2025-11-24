// Front-End/src/components/Dashboard/StatsGrid.jsx
import React, { useState, useEffect } from "react";
import StatCard from "./StatCard";
import { usersAdminApi } from "../../services/usersAdminApi";

const StatsGrid = () => {
  const [stats, setStats] = useState([
    { title: "Total Users", value: "0", color: "bg-blue-500", loading: true },
    { title: "Categories", value: "0", color: "bg-indigo-500", loading: true },
    { title: "Menu Items", value: "0", color: "bg-purple-500", loading: true },
    { title: "Total Orders", value: "0", color: "bg-red-500", loading: true },
    { title: "Order Items", value: "0", color: "bg-green-500", loading: true },
    {
      title: "Reservations",
      value: "0",
      color: "bg-yellow-500",
      loading: true,
    },
    {
      title: "Total Messages",
      value: "0",
      color: "bg-pink-500",
      loading: true,
    },
    {
      title: "Gallery Images",
      value: "0",
      color: "bg-teal-500",
      loading: true,
    },
    {
      title: "Testimonials",
      value: "0",
      color: "bg-orange-500",
      loading: true,
    },
    {
      title: "Favorites",
      value: "0",
      color: "bg-rose-500",
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

      console.log("Fetching stats data...");

      // Fetch all API data in parallel including users
      const [
        usersData,
        categoriesResponse,
        menuItemsResponse,
        ordersResponse,
        orderItemsResponse,
        reservationsResponse,
        messagesResponse,
        galleryResponse,
        testimonialsResponse,
        favoritesResponse,
      ] = await Promise.all([
        // Fetch users using the usersAdminApi
        usersAdminApi.getAllUsers(),
        fetch(`http://localhost:8000/api/menu/categories/`, { headers }),
        fetch(`http://localhost:8000/api/menu/items/`, { headers }),
        fetch(`http://localhost:8000/api/orders/orders/`, { headers }),
        fetch(`http://localhost:8000/api/orders/order-items/`, { headers }),
        fetch(`http://localhost:8000/api/reservations/reservations/`, {
          headers,
        }),
        fetch(`http://localhost:8000/api/contact/messages/`, { headers }),
        fetch(`http://localhost:8000/api/gallery/gallery/`, { headers }),
        fetch(`http://localhost:8000/api/testimonials/testimonials/`, {
          headers,
        }),
        // Use the admin_list endpoint for favorites to get all favorites count
        fetch(`http://localhost:8000/api/favorites/favorites/admin_list/`, {
          headers,
        }),
      ]);

      // Parse responses (except users which is already parsed by the API)
      const categoriesData = await categoriesResponse.json();
      const menuItemsData = await menuItemsResponse.json();
      const ordersData = await ordersResponse.json();
      const orderItemsData = await orderItemsResponse.json();
      const reservationsData = await reservationsResponse.json();
      const messagesData = await messagesResponse.json();
      const galleryData = await galleryResponse.json();
      const testimonialsData = await testimonialsResponse.json();
      const favoritesData = await favoritesResponse.json();

      console.log("API Responses:", {
        usersData,
        categoriesData,
        menuItemsData,
        ordersData,
        orderItemsData,
        reservationsData,
        messagesData,
        galleryData,
        testimonialsData,
        favoritesData,
      });

      // Helper function to extract count with better error handling
      const getCount = (data, endpoint = "") => {
        try {
          if (typeof data === "number") return data;
          if (typeof data.count === "number") return data.count;
          if (Array.isArray(data)) return data.length;
          if (Array.isArray(data.results)) return data.results.length;
          if (typeof data === "object" && data !== null) {
            // Handle various API response formats
            if (Array.isArray(data)) return data.length;
            if (data.results && Array.isArray(data.results))
              return data.results.length;
            // Try to find any array property
            const arrayProps = Object.values(data).filter(
              (val) => Array.isArray(val) && val.length > 0
            );
            if (arrayProps.length > 0) return arrayProps[0].length;
          }
          console.warn(`Unexpected data format for ${endpoint}:`, data);
          return 0;
        } catch (error) {
          console.error(`Error processing data for ${endpoint}:`, error);
          return 0;
        }
      };

      // Get users count from users API
      const getUsersCount = (usersData) => {
        try {
          console.log("Users data for counting:", usersData);

          // Handle both paginated and non-paginated responses
          if (Array.isArray(usersData)) {
            return usersData.length;
          }
          if (usersData.results && Array.isArray(usersData.results)) {
            return usersData.results.length;
          }
          if (typeof usersData.count === "number") {
            return usersData.count;
          }

          console.warn("Unexpected users data format:", usersData);
          return 0;
        } catch (error) {
          console.error("Error counting users:", error);
          return 0;
        }
      };

      // Update stats with real data from all APIs
      setStats([
        {
          title: "Total Users",
          value: getUsersCount(usersData),
          color: "bg-blue-500",
          loading: false,
        },
        {
          title: "Categories",
          value: getCount(categoriesData, "categories"),
          color: "bg-indigo-500",
          loading: false,
        },
        {
          title: "Menu Items",
          value: getCount(menuItemsData, "menu items"),
          color: "bg-purple-500",
          loading: false,
        },
        {
          title: "Total Orders",
          value: getCount(ordersData, "orders"),
          color: "bg-red-500",
          loading: false,
        },
        {
          title: "Order Items",
          value: getCount(orderItemsData, "order items"),
          color: "bg-green-500",
          loading: false,
        },
        {
          title: "Reservations",
          value: getCount(reservationsData, "reservations"),
          color: "bg-yellow-500",
          loading: false,
        },
        {
          title: "Total Messages",
          value: getCount(messagesData, "messages"),
          color: "bg-pink-500",
          loading: false,
        },
        {
          title: "Gallery Images",
          value: getCount(galleryData, "gallery"),
          color: "bg-teal-500",
          loading: false,
        },
        {
          title: "Testimonials",
          value: getCount(testimonialsData, "testimonials"),
          color: "bg-orange-500",
          loading: false,
        },
        {
          title: "Favorites",
          value: getCount(favoritesData, "favorites"),
          color: "bg-rose-500",
          loading: false,
        },
      ]);
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Fallback to showing 0 for all stats
      setStats(
        stats.map((stat) => ({
          ...stat,
          value: "0",
          loading: false,
        }))
      );
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

  // Split stats into groups for 3-3-3-2 layout
  const firstRow = stats.slice(0, 3);
  const secondRow = stats.slice(3, 6);
  const thirdRow = stats.slice(6, 9);
  const fourthRow = stats.slice(9, 11); // Last 2 cards

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Dashboard Overview
        </h2>
        <button
          onClick={handleRefresh}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
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
          Refresh Stats
        </button>
      </div>

      {/* First Row - 3 cards on desktop, 2 cards on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {firstRow.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            color={stat.color}
            loading={stat.loading}
          />
        ))}
      </div>

      {/* Second Row - 3 cards on desktop, 2 cards on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {secondRow.map((stat, index) => (
          <StatCard
            key={index + 3}
            title={stat.title}
            value={stat.value}
            color={stat.color}
            loading={stat.loading}
          />
        ))}
      </div>

      {/* Third Row - 3 cards on desktop, 2 cards on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {thirdRow.map((stat, index) => (
          <StatCard
            key={index + 6}
            title={stat.title}
            value={stat.value}
            color={stat.color}
            loading={stat.loading}
          />
        ))}
      </div>

      {/* Fourth Row - 2 cards (centered) - 2 cards on mobile, 2 centered cards on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {fourthRow.map((stat, index) => (
          <div
            key={index + 9}
            className={fourthRow.length === 1 ? "lg:col-span-1" : ""}
          >
            <StatCard
              title={stat.title}
              value={stat.value}
              color={stat.color}
              loading={stat.loading}
            />
          </div>
        ))}

        {/* Fill remaining columns when there's only one card */}
        {fourthRow.length === 1 && (
          <>
            <div className="hidden lg:block"></div>
            <div className="hidden lg:block"></div>
          </>
        )}
      </div>
    </div>
  );
};

export default StatsGrid;
