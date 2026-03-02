import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const Entry = () => {
  const { isAuthenticated, authChecked } = useAuthStore();

  if (!authChecked) return <p>Loading...</p>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default Entry;
