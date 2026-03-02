import { Outlet } from "react-router-dom";
import Sidebar from "../../components/dashboard/Sidebar";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;