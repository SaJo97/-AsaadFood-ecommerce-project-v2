import useAuth from "@/hooks/useAuth"
import { useSelector } from "react-redux"
import { Navigate, useLocation } from "react-router"

const ProtectedRoute = ({children, requiredRole}) => {
  const {isAuthenticated, role} = useAuth()
  const {loading} = useSelector((state) => state.auth)
  const location = useLocation();

  // Show loading if auth is being verified (prevents flash of redirect)
  if (loading.checkAuth && !isAuthenticated) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if(!isAuthenticated) {
    if (location.pathname !== "/auth/logga-in") {
      return <Navigate to="/auth/logga-in" replace />;
    }
    return null
  }

  if(requiredRole && role !== requiredRole){
    return <Navigate to="/" replace/>
  }
  return children;
}
export default ProtectedRoute