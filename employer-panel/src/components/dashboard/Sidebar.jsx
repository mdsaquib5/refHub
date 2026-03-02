import { NavLink, useNavigate } from "react-router-dom";
import {
    FiBriefcase,
    FiUsers,
    FiPlusCircle,
    FiFileText,
    FiLogOut
} from "react-icons/fi";
import { useAuthStore } from "../../store/authStore";

const navItems = [
    {
        title: 'Manage Jobs',
        icon: FiBriefcase,
        children: [
            { name: 'Create Job', path: '/dashboard/jobs/create', icon: FiPlusCircle },
            { name: 'All Jobs', path: '/dashboard/jobs/all', icon: FiFileText },
        ]
    },
    {
        title: 'All Referrals',
        path: '/dashboard/referrals',
        icon: FiUsers,
    },
];

const Sidebar = () => {
    const logout = useAuthStore((state) => state.logout);
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login", { replace: true });
    };

    const initial = user?.companyName?.charAt(0)?.toUpperCase() || "E";

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-profile">
                    <div className="sidebar-avatar">{initial}</div>
                    <div className="sidebar-user-info">
                        <span className="sidebar-user-name">
                            {user?.companyName || "Employer"}
                        </span>
                        <span className="sidebar-user-email">
                            {user?.email || ""}
                        </span>
                    </div>
                </div>
            </div>

            <nav className="sidebar-nav">
                <ul className="nav-list">
                    {navItems.map((item) => (
                        <li key={item.title} className="nav-item">
                            {item.children ? (
                                <div className="nav-group">
                                    <div className="nav-group-title">
                                        <item.icon className="nav-icon" />
                                        <span>{item.title}</span>
                                    </div>
                                    <ul className="nav-sublist">
                                        {item.children.map((child) => (
                                            <li key={child.path}>
                                                <NavLink
                                                    to={child.path}
                                                    className={({ isActive }) =>
                                                        `nav-sublink ${isActive ? 'active' : ''}`
                                                    }
                                                >
                                                    <child.icon className="nav-icon-small" />
                                                    <span>{child.name}</span>
                                                </NavLink>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `nav-link ${isActive ? 'active' : ''}`
                                    }
                                >
                                    <item.icon className="nav-icon" />
                                    <span>{item.title}</span>
                                </NavLink>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="sidebar-footer">
                <button className="logout-btn" onClick={handleLogout}>
                    <FiLogOut className="nav-icon" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
