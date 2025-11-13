// Front-End\src\services\reservationsApi.js
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token might be expired, redirect to login or refresh token
      console.error("Authentication failed. Please login again.");
      localStorage.removeItem("accessToken");
      // You might want to redirect to login page here
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const reservationsApi = {
  // Create a new reservation
  createReservation: async (reservationData) => {
    try {
      const response = await apiClient.post(
        "/reservations/reservations/",
        reservationData
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Failed to create reservation"
      );
    }
  },

  // Get all reservations (for admin)
  getReservations: async (params = {}) => {
    try {
      const response = await apiClient.get("/reservations/reservations/", {
        params,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Failed to fetch reservations"
      );
    }
  },

  // Get reservation by ID
  getReservationById: async (id) => {
    try {
      const response = await apiClient.get(`/reservations/reservations/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Failed to fetch reservation"
      );
    }
  },

  // Update reservation
  updateReservation: async (id, updateData) => {
    try {
      const response = await apiClient.patch(
        `/reservations/reservations/${id}/`,
        updateData
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Failed to update reservation"
      );
    }
  },

  // Delete reservation
  deleteReservation: async (id) => {
    try {
      const response = await apiClient.delete(
        `/reservations/reservations/${id}/`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Failed to delete reservation"
      );
    }
  },

  // Get reservation statistics
  getReservationStats: async () => {
    try {
      const response = await apiClient.get("/reservations/stats/");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Failed to fetch reservation stats"
      );
    }
  },

  // Check availability
  checkAvailability: async (date, time) => {
    try {
      const response = await apiClient.get(
        "/reservations/reservations/availability/",
        {
          params: { date, time },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Failed to check availability"
      );
    }
  },

  // Get upcoming reservations
  getUpcomingReservations: async () => {
    try {
      const response = await apiClient.get(
        "/reservations/reservations/upcoming/"
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Failed to fetch upcoming reservations"
      );
    }
  },
};

export default reservationsApi;
