const API_BASE_URL = "http://localhost:8000/api";

export const testimonialsApi = {
  getAllTestimonials: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(
        `${API_BASE_URL}/testimonials/testimonials/?${queryString}`
      );
      if (!response.ok) throw new Error("Failed to fetch testimonials");
      return await response.json();
    } catch (error) {
      console.error("Testimonials API Error:", error);
      throw error;
    }
  },

  getFeaturedTestimonials: async () => {
    return testimonialsApi.getAllTestimonials({
      featured: "true",
      is_active: "true",
    });
  },

  getActiveTestimonials: async () => {
    return testimonialsApi.getAllTestimonials({ is_active: "true" });
  },

  getTestimonialById: async (id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/testimonials/testimonials/${id}/`
      );
      if (!response.ok) throw new Error("Failed to fetch testimonial");
      return await response.json();
    } catch (error) {
      console.error("Testimonial API Error:", error);
      throw error;
    }
  },
};
