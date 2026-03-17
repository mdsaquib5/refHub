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
  HiOutlineSearch,
  HiOutlineIdentification,
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

    return matchesSearch;
  });

  const handleReferNow = (jobCode) => {
    navigate(`/dashboard/refer?jobCode=${jobCode}`);
  };

  if (loading) {
    return (
      <div className="jobs-container">
        <div className="stats-bar">
          <div className="stat-card skeleton-pulse" style={{ height: '100px' }}></div>
          <div className="stat-card skeleton-pulse" style={{ height: '100px' }}></div>
        </div>
        <div className="jobs-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="job-card skeleton-pulse" style={{ height: '350px' }}></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="jobs-container">
      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-icon"><HiOutlineBriefcase /></div>
          <div className="stat-info">
            <div className="stat-value">{jobs.length}</div>
            <div className="stat-label">Active Roles</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(0, 230, 118, 0.08)', color: 'var(--success)' }}><HiOutlineStar /></div>
          <div className="stat-info">
            <div className="stat-value">{filteredJobs.length}</div>
            <div className="stat-label">Matching Jobs</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="search-input-group">
          <HiOutlineSearch size={18} />
          <input
            type="text"
            placeholder="Search by title, skills, or job code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-pills">
          <button className="filter-pill active">
            All Positions
          </button>
        </div>
      </div>

      {!filteredJobs.length ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <HiOutlineBriefcase size={48} style={{ marginBottom: '15px' }} />
          <h3>No matching opportunities</h3>
          <p>Try refining your search terms or filters.</p>
        </div>
      ) : (
        <div className="jobs-grid">
          {filteredJobs.map((job) => (
            <div key={job._id} className="job-card animate-fade-in">
              <div className="job-card-header">
                <div className="flex-row">
                  <div className="stat-icon" style={{ width: '40px', height: '40px', borderRadius: '10px', fontSize: '18px' }}>
                    <BsBuilding />
                  </div>
                  <div className="flex-col">
                    <h3 style={{ margin: 0, fontSize: '16px' }}>{job.organizationName}</h3>
                    <span className="text-xs text-muted">{job.jobCode}</span>
                  </div>
                </div>
                <div className="status-badge status-reviewed">
                  {job.jobBasics?.jobCategory || "General"}
                </div>
              </div>

              <div className="job-card-body">
                <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>{job.jobBasics?.title}</h2>
                <div className="grid-2">
                  <div className="info-item">
                    <span className="info-label">Locations</span>
                    <span className="info-value">
                      <HiOutlineLocationMarker className="text-muted" />
                      {job.locations?.join(" • ") || "Remote"}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Experience</span>
                    <span className="info-value">
                      <MdTimer className="text-muted" />
                      {getExperienceText(job.experience?.min, job.experience?.max)}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Package (CTC)</span>
                    <span className="info-value">
                      <HiOutlineCurrencyRupee className="text-muted" />
                      {formatSalary(job.salaryRange?.min, job.salaryRange?.max)}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Department</span>
                    <span className="info-value">
                      <HiOutlineOfficeBuilding className="text-muted" />
                      {job.jobBasics?.department}
                    </span>
                  </div>
                </div>

                {job.skillsRequired?.length > 0 && (
                  <div className="flex-row" style={{ marginTop: '20px', flexWrap: 'wrap', gap: '8px' }}>
                    {job.skillsRequired.slice(0, 3).map((skill, i) => (
                      <span key={i} className="skill-chip">{skill}</span>
                    ))}
                    {job.skillsRequired.length > 3 && (
                      <span className="skill-chip">+{job.skillsRequired.length - 3}</span>
                    )}
                  </div>
                )}
              </div>

              <div className="job-card-footer">
                <span className="text-xs text-muted">Posted: {formatDate(job.createdAt)}</span>
                <button
                  className="btn-primary"
                  onClick={() => handleReferNow(job.jobCode)}
                >
                  <MdShare />
                  <span>Refer Now</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;
