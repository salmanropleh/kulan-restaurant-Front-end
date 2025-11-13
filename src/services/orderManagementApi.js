const API_BASE_URL = "http://localhost:8000/api";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Helper to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    console.error("API Error Response:", errorText);
    throw new Error(`Failed to fetch: ${response.status} - ${errorText}`);
  }
  return response.json();
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

export const orderManagementApi = {
  // Orders API
  getOrders: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await fetch(
        `${API_BASE_URL}/orders/orders/?${queryParams}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
          credentials: "include", // ADD THIS
        }
      );

      const data = await handleResponse(response);
      return extractDataFromResponse(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  getOrderStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/orders/stats/`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("Error fetching order stats:", error);
      throw error;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/orders/orders/${orderId}/update_status/`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ status }),
        }
      );

      return await handleResponse(response);
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },

  // Order Items API
  getOrderItems: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await fetch(
        `${API_BASE_URL}/orders/order-items/?${queryParams}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      const data = await handleResponse(response);
      return extractDataFromResponse(data);
    } catch (error) {
      console.error("Error fetching order items:", error);
      throw error;
    }
  },

  getGroupedOrderItems: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await fetch(
        `${API_BASE_URL}/orders/order-items/grouped_by_order/?${queryParams}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      const data = await handleResponse(response);
      return extractDataFromResponse(data);
    } catch (error) {
      console.error("Error fetching grouped order items:", error);
      throw error;
    }
  },
};
