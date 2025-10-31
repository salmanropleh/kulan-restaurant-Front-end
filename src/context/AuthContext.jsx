// Front-End/src/context/AuthContext.jsx
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

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem("kulanCurrentUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // Get ALL users from localStorage
      const savedUsers = localStorage.getItem("kulanUsers");
      if (!savedUsers) {
        return {
          success: false,
          error: "No account found. Please sign up first.",
        };
      }

      const users = JSON.parse(savedUsers);

      // Find user by email (case-insensitive)
      const userData = users.find(
        (user) => user.email.toLowerCase() === email.toLowerCase()
      );

      if (!userData) {
        return {
          success: false,
          error: "No account found with this email. Please sign up first.",
        };
      }

      // For demo purposes, we accept any password
      // In real app, you'd verify password hash here

      setUser(userData);
      // Also store as current logged-in user
      localStorage.setItem("kulanCurrentUser", JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: "Login failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (firstName, lastName, email, phone, password) => {
    setIsLoading(true);
    try {
      // Get existing users or initialize empty array
      const savedUsers = localStorage.getItem("kulanUsers");
      const users = savedUsers ? JSON.parse(savedUsers) : [];

      // Check if user already exists (case-insensitive)
      const existingUser = users.find(
        (user) => user.email.toLowerCase() === email.toLowerCase()
      );

      if (existingUser) {
        return {
          success: false,
          error: "An account with this email already exists",
        };
      }

      // Create new user
      const newUser = {
        id: Date.now(),
        firstName: firstName,
        lastName: lastName,
        fullName: `${firstName} ${lastName}`,
        email: email,
        phone: phone,
        createdAt: new Date().toISOString(),
        preferences: {
          newsletter: false,
          smsNotifications: true,
        },
      };

      // Add new user to users array
      users.push(newUser);

      // Save updated users array
      localStorage.setItem("kulanUsers", JSON.stringify(users));
      // Also set as current logged-in user
      localStorage.setItem("kulanCurrentUser", JSON.stringify(newUser));

      setUser(newUser);
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: "Signup failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("kulanCurrentUser");
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
