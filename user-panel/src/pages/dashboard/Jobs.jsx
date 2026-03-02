import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineBriefcase,
  HiOutlineLocationMarker,
  HiOutlineCurrencyRupee,
  HiOutlineOfficeBuilding,
  HiOutlineCode,
  HiOutlineStar,
  HiOutlineTag,
} from "react-icons/hi";
import { MdWork, MdTimer, MdShare } from "react-icons/md";
import { BsBuilding, BsPersonBadge } from "react-icons/bs";
import { FiClock } from "react-icons/fi";
import { FaRegCalendarAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { getAllJobs } from "../../api/jobsApi";

const Jobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsData = await getAllJobs();
        setJobs(Array.isArray(jobsData) ? jobsData : []);
      } catch {
        toast.error("Failed to load jobs");
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const formatSalary = (min, max) => {
    if (min == null || max == null) return "-";
    const format = (n) =>
      n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${n.toLocaleString()}`;
    return `${format(min)} - ${format(max)}`;
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const getExperienceText = (min, max) => {
    if (min == null || max == null) return "-";
    if (min === 0 && max === 0) return "Fresher";
    if (min === max) return `${min} yrs`;
    return `${min} - ${max} yrs`;
  };

  const searchLower = searchTerm.toLowerCase();
  const filteredJobs = jobs.filter((job) => {
    const title = job.jobBasics?.title?.toLowerCase() || "";
    const company = job.organizationName?.toLowerCase() || "";
    const locations = job.locations?.join(" ").toLowerCase() || "";
    const jobCode = job.jobCode?.toLowerCase() || "";

    const matchesSearch =
      title.includes(searchLower) ||
      company.includes(searchLower) ||
      locations.includes(searchLower) ||
      jobCode.includes(searchLower);

    if (filter === "recent") {
      const last30Days = new Date();
      last30Days.setDate(last30Days.getDate() - 30);
      return matchesSearch && new Date(job.createdAt) > last30Days;
    }

    return matchesSearch;
  });

  const handleReferNow = (jobCode) => {
    navigate(`/dashboard/refer?jobCode=${jobCode}`);
  };

  if (loading) {
    return <div className="jobs-container">Loading jobs...</div>;
  }

  if (!jobs.length) {
    return (
      <div className="jobs-container">
        <div className="no-jobs-found">
          <MdWork />
          <h3>No jobs available</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="jobs-container">
      <div className="jobs-header">
        <div className="header-content">
          <h1>
            <BsPersonBadge className="header-icon" />
            Job Opportunities
          </h1>
          <p>Refer candidates for open positions</p>
        </div>
        <div className="jobs-stats">
          <div className="stat-badge">
            <MdWork />
            <span>{jobs.length} Open Jobs</span>
          </div>
        </div>
      </div>

      <div className="jobs-filter-section">
        <div className="search-bar">
          <HiOutlineBriefcase className="search-icon" />
          <input
            type="text"
            placeholder="Search job, company, location or job code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All Jobs
          </button>
          <button
            className={`filter-btn ${filter === "recent" ? "active" : ""}`}
            onClick={() => setFilter("recent")}
          >
            <FiClock />
            Recent
          </button>
        </div>
      </div>

      <div className="jobs-grid">
        {filteredJobs.map((job) => (
          <div key={job._id} className="job-card">
            <div className="job-card-header">
              <div className="company-info">
                <div className="company-icon">
                  <BsBuilding />
                </div>
                <div className="company-details">
                  <h3>{job.organizationName}</h3>
                  <span className="job-code">
                    <HiOutlineTag />
                    {job.jobCode}
                  </span>
                </div>
              </div>
              <span className="job-badge">
                <HiOutlineStar />
                {job.jobBasics?.jobCategory}
              </span>
            </div>

            <div className="job-title-section">
              <h2>{job.jobBasics?.title}</h2>
              <p className="department">
                <HiOutlineOfficeBuilding />
                {job.jobBasics?.department}
              </p>
            </div>

            <div className="job-details-grid">
              <div className="job-detail-item">
                <HiOutlineLocationMarker />
                <span>{job.locations?.join(" • ") || "-"}</span>
              </div>
              <div className="job-detail-item">
                <MdTimer />
                <span>
                  {getExperienceText(job.experience?.min, job.experience?.max)}
                </span>
              </div>
              <div className="job-detail-item">
                <HiOutlineCurrencyRupee />
                <span>
                  {formatSalary(job.salaryRange?.min, job.salaryRange?.max)} /yr
                </span>
              </div>
              <div className="job-detail-item">
                <FaRegCalendarAlt />
                <span>{formatDate(job.createdAt)}</span>
              </div>
              {job.workplace?.workType && (
                <div className="job-detail-item">
                  <HiOutlineBriefcase />
                  <span>{job.workplace.workType}</span>
                </div>
              )}
              {job.workplace?.numberOfOpenings && (
                <div className="job-detail-item">
                  <MdWork />
                  <span>{job.workplace.numberOfOpenings} openings</span>
                </div>
              )}
            </div>

            {job.skillsRequired?.length > 0 && (
              <div className="job-skills">
                {job.skillsRequired.map((skill, i) => (
                  <span key={i} className="skill-chip">
                    <HiOutlineCode />
                    {skill}
                  </span>
                ))}
              </div>
            )}

            <div className="job-card-footer">
              <button
                className="refer-now-btn"
                onClick={() => handleReferNow(job.jobCode)}
              >
                <MdShare />
                Refer Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Jobs;
