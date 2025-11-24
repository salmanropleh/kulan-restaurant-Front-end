const API_BASE_URL = "http://localhost:8000/api";

// ==================== HELPER FUNCTIONS ====================

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

// ==================== ORDER API METHODS ====================

export const orderApi = {
  // ==================== CART ENDPOINTS ====================
  // All cart endpoints include credentials for session handling

  getCart: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orderprocess/cart/`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include", // CRITICAL: Include cookies/session
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  },

  addToCart: async (itemData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orderprocess/cart/add/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(itemData),
        credentials: "include", // CRITICAL: Include cookies/session
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  },

  updateCartItem: async (itemId, quantity) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/orderprocess/cart/update/${itemId}/`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({ quantity }),
          credentials: "include", // CRITICAL: Include cookies/session
        }
      );
      return await handleResponse(response);
    } catch (error) {
      console.error("Error updating cart item:", error);
      throw error;
    }
  },

  removeCartItem: async (itemId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/orderprocess/cart/remove/${itemId}/`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
          credentials: "include", // CRITICAL: Include cookies/session
        }
      );
      return await handleResponse(response);
    } catch (error) {
      console.error("Error removing cart item:", error);
      throw error;
    }
  },

  clearCart: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orderprocess/cart/clear/`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include", // CRITICAL: Include cookies/session
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  },

  // ==================== CHECKOUT ENDPOINTS ====================
  // All checkout endpoints include credentials for session handling

  createCheckoutSession: async (checkoutData) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/orderprocess/checkout/create-session/`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(checkoutData),
          credentials: "include", // CRITICAL: Include cookies/session
        }
      );
      return await handleResponse(response);
    } catch (error) {
      console.error("Error creating checkout session:", error);
      throw error;
    }
  },

  processOrder: async (orderData) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/orderprocess/checkout/process-order/`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(orderData),
          credentials: "include", // CRITICAL: Include cookies/session
        }
      );
      return await handleResponse(response);
    } catch (error) {
      console.error("Error processing order:", error);
      throw error;
    }
  },

  // ==================== ORDER CONFIRMATION ENDPOINTS ====================

  getOrderConfirmation: async (orderId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/orderprocess/confirmation/${orderId}/`,
        {
          method: "GET",
          headers: getAuthHeaders(),
          credentials: "include", // CRITICAL: Include cookies/session
        }
      );
      return await handleResponse(response);
    } catch (error) {
      console.error("Error fetching order confirmation:", error);
      throw error;
    }
  },

  // ==================== USER ORDERS ENDPOINTS ====================
  // Get all orders for the authenticated user

  getUserOrders: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/orders/`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include", // CRITICAL: Include cookies/session
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      throw error;
    }
  },

  // ==================== ORDER MANAGEMENT ENDPOINTS ====================
  // Additional order-related endpoints can be added here

  getOrderDetails: async (orderId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/orders/orders/${orderId}/`,
        {
          method: "GET",
          headers: getAuthHeaders(),
          credentials: "include",
        }
      );
      return await handleResponse(response);
    } catch (error) {
      console.error("Error fetching order details:", error);
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
          credentials: "include",
        }
      );
      return await handleResponse(response);
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },
};
