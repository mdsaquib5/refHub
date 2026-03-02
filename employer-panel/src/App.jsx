import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import Entry from "./components/routes/Entry";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import CreateJob from "./pages/dashboard/CreateJob";
import AllJobs from "./pages/dashboard/AllJobs";
import Referrals from "./pages/dashboard/Referrals";

function App() {
  const refresh = useAuthStore((s) => s.refresh);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<Entry />}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<AllJobs />} />
            <Route path="jobs/create" element={<CreateJob />} />
            <Route path="jobs/all" element={<AllJobs />} />
            <Route path="referrals" element={<Referrals />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
