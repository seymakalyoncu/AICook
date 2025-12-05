import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { token } = useAuth();

  console.log("token : " + token);

  // Token yoksa login'e yönlendir
  if (!token) {
    return <Navigate to="/authentication/login" replace />;
  }

  // Token varsa iç route'u render et
  return <Outlet />;
}
