import { useEffect, useState } from "react";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineBriefcase,
  HiOutlineCurrencyRupee,
  HiOutlineCalendar,
  HiOutlineDocumentText,
  HiOutlineUser,
  HiOutlineCode,
  HiOutlineIdentification,
  HiOutlineChartBar,
  HiOutlineClock,
  HiOutlineSearch,
} from "react-icons/hi";
import {
  MdPendingActions,
  MdCheckCircle,
  MdCancel,
  MdPerson,
  MdAttachFile,
} from "react-icons/md";
import { FiTrendingUp, FiStar } from "react-icons/fi";
import { BsBriefcase, BsPersonBadge } from "react-icons/bs";
import { toast } from "react-toastify";
import { getMyReferrals, deleteReferral } from "../../api/referralApi";

const STATUS_CONFIG = {
  pending: { icon: MdPendingActions, className: "status-pending" },
  viewed: { icon: HiOutlineClock, className: "status-reviewed" },
  shortlisted: { icon: FiStar, className: "status-shortlisted" },
  interviewed: { icon: HiOutlineBriefcase, className: "status-interviewed" },
  rejected: { icon: MdCancel, className: "status-rejected" },
  hired: { icon: MdCheckCircle, className: "status-hired" },
};

const MyReferrals = () => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [resumeModal, setResumeModal] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const data = await getMyReferrals();
        setReferrals(Array.isArray(data) ? data : []);
      } catch {
        toast.error("Failed to load referrals");
      } finally {
        setLoading(false);
      }
    };
    fetchReferrals();
  }, []);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatCurrency = (amount) => {
    if (amount == null) return "-";
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString()}`;
  };

  const getStatusConfig = (status) =>
    STATUS_CONFIG[status] || STATUS_CONFIG.pending;

  const handleDelete = async (referralId) => {
    if (!window.confirm("Are you sure you want to delete this referral?")) return;

    try {
      setIsDeleting(referralId);
      await deleteReferral(referralId);
      setReferrals(referrals.filter((r) => r._id !== referralId));
      toast.success("Referral deleted successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete referral");
    } finally {
      setIsDeleting(null);
    }
  };

  const searchLower = searchTerm.toLowerCase();
  const filteredReferrals = referrals.filter((r) => {
    if (!searchTerm) return true;
    return (
      r.candidate?.name?.toLowerCase().includes(searchLower) ||
      r.candidate?.email?.toLowerCase().includes(searchLower) ||
      r.candidate?.currentDesignation?.toLowerCase().includes(searchLower) ||
      r.candidate?.currentOrganization?.toLowerCase().includes(searchLower) ||
      r.jobPostId?.jobCode?.toLowerCase().includes(searchLower) ||
      r.jobPostId?.organizationName?.toLowerCase().includes(searchLower) ||
      r.jobPostId?.jobBasics?.title?.toLowerCase().includes(searchLower) ||
      r.referredBy?.name?.toLowerCase().includes(searchLower) ||
      r.status?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="my-referrals">
        <div className="referrals-header">
          <h1><BsPersonBadge className="header-icon" /> My Referrals</h1>
        </div>
        <div className="skeleton-list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-row">
                <div className="skeleton-chip"></div>
                <div className="skeleton-line skeleton-line--short" style={{ marginBottom: 0, flex: 1 }}></div>
              </div>
              <div className="skeleton-line skeleton-line--title"></div>
              <div className="skeleton-line skeleton-line--long"></div>
              <div className="skeleton-line skeleton-line--medium"></div>
              <div className="skeleton-line skeleton-line--short"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!referrals.length) {
    return <div className="my-referrals">No referrals found</div>;
  }

  return (
    <div className="my-referrals">
      <div className="referrals-header">
        <h1>
          <BsPersonBadge className="header-icon" />
          My Referrals
        </h1>
        <p className="referrals-count">
          <HiOutlineUser />
          Total: {referrals.length}
        </p>
      </div>

      {/* Search */}
      <div className="referrals-search-bar">
        <HiOutlineSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search by name, job code, status, company, designation..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="referrals-list">
        {filteredReferrals.map((referral) => {
          const statusConfig = getStatusConfig(referral.status);
          const StatusIcon = statusConfig.icon;

          return (
            <div key={referral._id} className="referral-card">
              {/* Header */}
              <div className="card-header">
                <div className="candidate-info">
                  <div className="candidate-name">
                    <MdPerson className="name-icon" />
                    <h2>{referral.candidate?.name}</h2>
                  </div>
                  <div className={`status-badge ${statusConfig.className}`}>
                    <StatusIcon className="status-icon" />
                    <span>{referral.status}</span>
                  </div>
                </div>

                {referral.jobPostId && (
                  <div className="job-meta">
                    <span className="job-title">
                      <HiOutlineBriefcase />
                      {referral.jobPostId.jobBasics?.title}
                    </span>
                    <span className="job-code">
                      <HiOutlineIdentification />
                      {referral.jobPostId.jobCode}
                    </span>
                    <span className="job-company">
                      <BsBriefcase />
                      {referral.jobPostId.organizationName}
                    </span>
                    {referral.jobPostId.locations?.length > 0 && (
                      <span className="job-company">
                        {referral.jobPostId.locations.join(", ")}
                      </span>
                    )}
                  </div>
                )}

                <p className="referral-date">
                  <HiOutlineCalendar />
                  Referred on {formatDate(referral.createdAt)}
                </p>
              </div>

              {/* Body */}
              <div className="card-body">
                <div className="info-grid">
                  <div className="info-item">
                    <HiOutlineMail className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Email</span>
                      <span className="info-value">
                        {referral.candidate?.email}
                      </span>
                    </div>
                  </div>

                  <div className="info-item">
                    <HiOutlinePhone className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Mobile</span>
                      <span className="info-value">
                        {referral.candidate?.mobile}
                      </span>
                    </div>
                  </div>

                  <div className="info-item">
                    <HiOutlineBriefcase className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Current Role</span>
                      <span className="info-value">
                        {referral.candidate?.currentDesignation}
                        {referral.candidate?.currentOrganization &&
                          ` @ ${referral.candidate.currentOrganization}`}
                      </span>
                    </div>
                  </div>

                  <div className="info-item">
                    <HiOutlineChartBar className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Experience</span>
                      <span className="info-value">
                        {referral.candidate?.totalExperience} years
                      </span>
                    </div>
                  </div>

                  <div className="info-item">
                    <HiOutlineCurrencyRupee className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Current CTC</span>
                      <span className="info-value">
                        {formatCurrency(referral.candidate?.currentCTC)}
                      </span>
                    </div>
                  </div>

                  <div className="info-item">
                    <FiTrendingUp className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Expected CTC</span>
                      <span className="info-value">
                        {formatCurrency(referral.candidate?.expectedCTC)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                {referral.candidate?.skillSet?.length > 0 && (
                  <div className="skills-section">
                    <div className="skills-header">
                      <HiOutlineCode className="skills-icon" />
                      <span className="info-label">Skills</span>
                    </div>
                    <div className="skills-list">
                      {referral.candidate.skillSet.map((skill, i) => (
                        <span key={i} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resume */}
                {referral.resume?.url && (
                  <div className="resume-section">
                    <button
                      type="button"
                      className="resume-link"
                      onClick={() =>
                        setResumeModal({
                          url: `${import.meta.env.VITE_API_URL}/resume/${referral._id}`,
                          name: referral.resume.originalName,
                        })
                      }
                    >
                      <MdAttachFile />
                      <HiOutlineDocumentText />
                      <span className="resume-name">
                        {referral.resume.originalName}
                      </span>
                      <span className="resume-size">
                        ({(referral.resume.size / 1024).toFixed(1)} KB)
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="referred-by">
                  <HiOutlineUser />
                  Referred by: {referral.referredBy?.name} (
                  {referral.referredBy?.email})
                </span>
                <button
                  onClick={() => handleDelete(referral._id)}
                  disabled={isDeleting === referral._id}
                  className="delete-btn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#fee2e2',
                    color: '#ef4444',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#fecaca' }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#fee2e2' }}
                >
                  <MdCancel />
                  {isDeleting === referral._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resume PDF Modal */}
      {resumeModal && (
        <div className="resume-modal-overlay" onClick={() => setResumeModal(null)}>
          <div className="resume-modal" onClick={(e) => e.stopPropagation()}>
            <div className="resume-modal-header">
              <h3>{resumeModal.name}</h3>
              <button
                className="resume-modal-close"
                onClick={() => setResumeModal(null)}
              >
                ✕
              </button>
            </div>
            <div className="resume-modal-body">
              <iframe
                src={resumeModal.url}
                title="Resume PDF"
                width="100%"
                height="100%"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReferrals;
