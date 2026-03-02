import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import Entry from "./components/routes/Entry";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Jobs from "./pages/dashboard/Jobs";
import CreateReferral from "./pages/dashboard/CreateReferral";
import MyReferrals from "./pages/dashboard/MyReferrals";

const App = () => {
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
            <Route index element={<Jobs />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="refer" element={<CreateReferral />} />
            <Route path="referrals" element={<MyReferrals />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
