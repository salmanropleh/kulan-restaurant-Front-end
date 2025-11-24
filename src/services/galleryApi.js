const API_BASE_URL = "http://localhost:8000/api";

export const galleryApi = {
  // GET - Get all gallery images
  getAllImages: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(
        `${API_BASE_URL}/gallery/gallery/?${queryString}`
      );
      if (!response.ok) throw new Error("Failed to fetch gallery images");
      return await response.json();
    } catch (error) {
      console.error("Gallery API Error:", error);
      throw error;
    }
  },

  getImagesByCategory: async (category) => {
    return galleryApi.getAllImages({ category, is_active: "true" });
  },

  getFeaturedImages: async () => {
    return galleryApi.getAllImages({ featured: "true", is_active: "true" });
  },

  getActiveImages: async () => {
    return galleryApi.getAllImages({ is_active: "true" });
  },

  getImageById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/gallery/gallery/${id}/`);
      if (!response.ok) throw new Error("Failed to fetch gallery image");
      return await response.json();
    } catch (error) {
      console.error("Gallery Image API Error:", error);
      throw error;
    }
  },

  // POST - Upload new image
  uploadImage: async (imageData, token) => {
    try {
      const formData = new FormData();
      formData.append("title", imageData.title);
      formData.append("description", imageData.description || "");
      formData.append("category", imageData.category);
      formData.append("is_featured", imageData.is_featured);
      formData.append("is_active", imageData.is_active);
      formData.append("order", imageData.order);
      formData.append("image", imageData.image);

      const response = await fetch(`${API_BASE_URL}/gallery/gallery/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type for FormData - let browser set it with boundary
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Upload error response:", errorData);
        throw new Error(`Failed to upload image: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error in uploadImage:", error);
      throw error;
    }
  },

  // PATCH - Update existing image
  updateImage: async (id, imageData, token) => {
    try {
      const formData = new FormData();
      if (imageData.title) formData.append("title", imageData.title);
      if (imageData.description !== undefined)
        formData.append("description", imageData.description);
      if (imageData.category) formData.append("category", imageData.category);
      if (imageData.is_featured !== undefined)
        formData.append("is_featured", imageData.is_featured);
      if (imageData.is_active !== undefined)
        formData.append("is_active", imageData.is_active);
      if (imageData.order !== undefined)
        formData.append("order", imageData.order);
      if (imageData.image) formData.append("image", imageData.image);

      const response = await fetch(`${API_BASE_URL}/gallery/gallery/${id}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update image: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error in updateImage:", error);
      throw error;
    }
  },

  // DELETE - Delete image
  deleteImage: async (id, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/gallery/gallery/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete image: ${response.status}`);
      }

      return { success: true };
    } catch (error) {
      console.error("Error in deleteImage:", error);
      throw error;
    }
  },
};
