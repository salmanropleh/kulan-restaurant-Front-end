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

export const orderApi = {
  // Cart endpoints - ALL WITH CREDENTIALS
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

  // Checkout endpoints - ALSO WITH CREDENTIALS
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

  // Order confirmation
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
};
