import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const isLoggedIn = Boolean(localStorage.getItem("spanish-ai-user"));
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};
