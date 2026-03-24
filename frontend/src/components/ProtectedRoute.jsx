import useAuth from "@/hooks/useAuth";
import { checkAuth } from "@/store/auth/authSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router";

const ProtectedRoute = ({ children, requiredRole }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, role } = useAuth();
  const { loading } = useSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Show loading if auth is being verified (prevents flash of redirect)
  if (loading.checkAuth) {
    return <div className="text-center">Laddar...</div>; 
  }

  if (!isAuthenticated) {
    if (location.pathname !== "/auth/logga-in") {
      return <Navigate to="/auth/logga-in" replace />;
    }
    return null;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace/>;
  }
  return children;
};
export default ProtectedRoute;
