const API_BASE_URL = "http://localhost:8000/api";

class ContactAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get JWT token from localStorage
  getAuthToken() {
    return localStorage.getItem("accessToken");
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const token = this.getAuthToken();

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      ...options,
    };

    // Add Authorization header if token exists
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Add body for methods that require it
    if (options.body && typeof options.body === "object") {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);

      // Handle authentication errors
      if (response.status === 401) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || "Please log in to access your messages."
        );
      }

      if (response.status === 403) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail ||
            "You don't have permission to access this resource."
        );
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            errorData.detail ||
            errorData.errors ||
            `HTTP error! status: ${response.status}`
        );
      }

      // For DELETE requests that might not return content
      if (response.status === 204) {
        return { success: true };
      }

      // Check if response has content
      const contentLength = response.headers.get("Content-Length");
      if (contentLength === "0") {
        return { success: true };
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // ==================== ADMIN ENDPOINTS ====================

  // Get all contact messages for the authenticated admin user
  async getMessages() {
    return this.request("/contact/messages/", {
      method: "GET",
    });
  }

  // Get a specific message by ID
  async getMessage(messageId) {
    return this.request(`/contact/messages/${messageId}/`, {
      method: "GET",
    });
  }

  // Get message statistics for the authenticated admin user
  async getMessageStats() {
    return this.request("/contact/stats/", {
      method: "GET",
    });
  }

  // ==================== USER-SPECIFIC ENDPOINTS ====================

  // Get user's own messages (for profile page)
  async getUserMessages() {
    return this.request("/contact/user/messages/", {
      method: "GET",
    });
  }

  // Get user's message stats (for profile page)
  async getUserMessageStats() {
    return this.request("/contact/user/stats/", {
      method: "GET",
    });
  }

  // ==================== COMMON ENDPOINTS ====================

  // Send a new contact message (public - no auth required)
  async sendMessage(messageData) {
    return this.request("/contact/", {
      method: "POST",
      body: messageData,
    });
  }

  // Mark message as read
  async markAsRead(messageId) {
    return this.request(`/contact/messages/${messageId}/`, {
      method: "PATCH",
      body: { is_read: true },
    });
  }

  // Update message (general update)
  async updateMessage(messageId, updateData) {
    return this.request(`/contact/messages/${messageId}/`, {
      method: "PATCH",
      body: updateData,
    });
  }

  // Delete a message
  async deleteMessage(messageId) {
    return this.request(`/contact/messages/${messageId}/`, {
      method: "DELETE",
    });
  }

  // Check if user is authenticated and is admin
  async checkAuth() {
    try {
      const response = await this.request("/contact/check-auth/", {
        method: "GET",
      });
      return response.authenticated && response.is_admin;
    } catch (error) {
      console.log("Auth check failed:", error);
      return false;
    }
  }
}

// Create and export a singleton instance
export const contactAPI = new ContactAPI();
export default ContactAPI;
