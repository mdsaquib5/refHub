import { Outlet } from "react-router-dom";
import Sidebar from "../../components/dashboard/Sidebar";

const Dashboard = () => (
  <div className="dashboard">
    <Sidebar />
    <main>
      <Outlet />
    </main>
  </div>
);

export default Dashboard;
