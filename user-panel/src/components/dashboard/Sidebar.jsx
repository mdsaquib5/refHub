import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const Sidebar = () => {
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <aside className="sidebar">
      <div className="sidebar-profile">
        <div className="sidebar-avatar">{initial}</div>
        <div className="sidebar-user-info">
          <span className="sidebar-user-name">{user?.name || "User"}</span>
          <span className="sidebar-user-email">{user?.email || ""}</span>
        </div>
      </div>
      <NavLink to="/dashboard/jobs">Jobs</NavLink>
      <NavLink to="/dashboard/refer">Refer Candidate</NavLink>
      <NavLink to="/dashboard/referrals">My Referrals</NavLink>
      <button onClick={handleLogout}>Logout</button>
    </aside>
  );
};

export default Sidebar;
