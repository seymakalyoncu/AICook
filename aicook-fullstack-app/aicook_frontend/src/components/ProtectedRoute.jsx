// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  console.log("token : " + token);
  if (!token) {
    return <Navigate to="/authentication/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
