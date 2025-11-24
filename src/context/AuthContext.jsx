import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = "http://localhost:8000/api";

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/users/check-auth/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // Token is invalid, clear storage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("kulanCurrentUser");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username_or_email, password) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username_or_email: username_or_email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save tokens
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);

        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return {
          success: false,
          error: data.detail || "Login failed. Please check your credentials.",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: "Network error. Please try again.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (firstName, lastName, email, phone, password) => {
    setIsLoading(true);
    try {
      // Generate unique username from email
      const username =
        email.split("@")[0] + "_" + Date.now().toString().slice(-6);

      const response = await fetch(`${API_BASE_URL}/users/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
          confirm_password: password,
          first_name: firstName,
          last_name: lastName,
          phone_number: phone,
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        // Auto-login after successful registration
        const loginResult = await login(email, password);
        return loginResult;
      } else {
        // Handle validation errors from Django
        let errorMessage = "Signup failed";
        if (data.email) {
          errorMessage = data.email[0];
        } else if (data.password) {
          errorMessage = data.password[0];
        } else if (data.username) {
          errorMessage = data.username[0];
        } else if (data.detail) {
          errorMessage = data.detail;
        }
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      return {
        success: false,
        error: "Network error. Please try again.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("kulanCurrentUser");
  };

  const refreshToken = async () => {
    try {
      const refresh = localStorage.getItem("refreshToken");
      if (!refresh) {
        logout();
        return null;
      }

      const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("accessToken", data.access);
        return data.access;
      } else {
        logout();
        return null;
      }
    } catch (error) {
      logout();
      return null;
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isLoading,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
