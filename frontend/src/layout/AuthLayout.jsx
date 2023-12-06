import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
export default function AuthLayout() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to={"/"} replace /> : <Outlet />;
}
