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

export const categoriesApi = {
  // Get all categories
  getCategories: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await fetch(
        `${API_BASE_URL}/menu/categories/?${queryParams}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      return await handleResponse(response);
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  // Get single category
  getCategory: async (categoryId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/menu/categories/${categoryId}/`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      return await handleResponse(response);
    } catch (error) {
      console.error("Error fetching category:", error);
      throw error;
    }
  },

  // Create category
  createCategory: async (categoryData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/categories/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(categoryData),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  // Update category
  updateCategory: async (categoryId, categoryData) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/menu/categories/${categoryId}/`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(categoryData),
        }
      );

      return await handleResponse(response);
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  },

  // Delete category
  deleteCategory: async (categoryId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/menu/categories/${categoryId}/`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete: ${response.status} - ${errorText}`);
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  },
};
