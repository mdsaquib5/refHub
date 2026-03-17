import { useQuery } from "@tanstack/react-query";
import { FiBriefcase, FiUsers } from "react-icons/fi";
import { getAllJobsApi } from "../../api/jobsApi";
import { getAllReferralsApi } from "../../api/referralApi";

const StatsBar = () => {
  const { data: jobsData } = useQuery({
    queryKey: ["employer-jobs"],
    queryFn: getAllJobsApi,
  });

  const { data: referralsData } = useQuery({
    queryKey: ["employer-referrals"],
    queryFn: getAllReferralsApi,
  });

  const totalJobs = jobsData?.jobs?.length || 0;
  const totalReferrals = referralsData?.referrals?.length || 0;

  return (
    <div className="stats-bar">
      <div className="stat-card">
        <div className="stat-icon">
          <FiBriefcase />
        </div>
        <div className="stat-info">
          <span className="stat-value">{totalJobs}</span>
          <span className="stat-label">Total Jobs</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">
          <FiUsers />
        </div>
        <div className="stat-info">
          <span className="stat-value">{totalReferrals}</span>
          <span className="stat-label">Total Referrals</span>
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
