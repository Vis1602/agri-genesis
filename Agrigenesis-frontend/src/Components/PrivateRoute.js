import React from "react";
import { Navigate } from "react-router-dom";
import { authService } from "../services/auth";

const PrivateRoute = ({ children, expertOnly = false }) => {
  const isAuthenticated = authService.isLoggedIn();
  const user = authService.getCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (expertOnly && user?.role !== "expert") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
