import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("access");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (!user?.is_staff && !user?.is_superuser) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
