// src/components/PrivateRoute.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const userId = useSelector((state) => state.user.id);

  // If no user ID in Redux, block access
  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
