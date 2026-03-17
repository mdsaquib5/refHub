import { NavLink, useNavigate } from "react-router-dom";
import { FiBriefcase, FiUserPlus, FiUsers, FiLogOut } from "react-icons/fi";
import { useAuthStore } from "../../store/authStore";

const Sidebar = ({ isOpen, onClose }) => {
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-profile">
          <span className="sidebar-user-name">{user?.name || "User Account"}</span>
          <span className="sidebar-user-email">{user?.email || "user@alten.com"}</span>
        </div>
      </div>

      <nav>
        <NavLink 
          to="/dashboard/jobs" 
          onClick={onClose} 
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          <FiBriefcase size={18} />
          <span>Browse Jobs</span>
        </NavLink>
        <NavLink 
          to="/dashboard/refer" 
          onClick={onClose} 
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          <FiUserPlus size={18} />
          <span>Refer Candidate</span>
        </NavLink>
        <NavLink 
          to="/dashboard/referrals" 
          onClick={onClose} 
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          <FiUsers size={18} />
          <span>My Referrals</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer" style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
        <button onClick={handleLogout} className="logout-btn" style={{ margin: 0, width: '100%' }}>
          <FiLogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
