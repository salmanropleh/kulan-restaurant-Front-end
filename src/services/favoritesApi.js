const API_BASE_URL = "http://localhost:8000/api";

class FavoritesAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

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

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    if (options.body && typeof options.body === "object") {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      console.log(`API Request: ${url}`, response.status);

      if (response.status === 401) {
        throw new Error("Please log in to access favorites.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            errorData.detail ||
            errorData.error ||
            `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Get user's favorites - CORRECTED URL
  async getFavorites() {
    return this.request("/favorites/favorites/favorites_list/", {
      method: "GET",
    });
  }

  // Toggle favorite status - CORRECTED URL
  async toggleFavorite(menuItemId) {
    return this.request("/favorites/favorites/toggle/", {
      method: "POST",
      body: { menu_item_id: menuItemId },
    });
  }

  // Add multiple favorites (for migration) - CORRECTED URL
  async bulkAddFavorites(menuItemIds) {
    return this.request("/favorites/favorites/bulk_add/", {
      method: "POST",
      body: { menu_item_ids: menuItemIds },
    });
  }

  // Check if item is favorite
  async isFavorite(menuItemId) {
    const favorites = await this.getFavorites();
    return favorites.some((fav) => fav.id === menuItemId);
  }
}

export const favoritesApi = new FavoritesAPI();
