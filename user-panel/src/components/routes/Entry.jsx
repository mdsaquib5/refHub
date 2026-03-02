import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const Entry = () => {
  const { isAuthenticated, authChecked } = useAuthStore();

  if (!authChecked) return <div className="page-loader"><div className="spinner"></div></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default Entry;
