import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const userRole = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");

  if (!userRole) {
    return <Navigate to="/login" replace />; // Redirect to login if not logged in
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />; // Redirect to home if role is not allowed
  }
  if (!token) {
    return <Navigate to="/login" replace />; // Redirect if no token
  }

  return <Outlet />; // Allow access
};

export default ProtectedRoute;

