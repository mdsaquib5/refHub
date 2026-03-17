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
  HiOutlineUsers,
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

  const statusStats = referrals.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {});

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
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="my-referrals-page">
      <h1 className="page-title">My Referrals</h1>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-icon"><HiOutlineUsers /></div>
          <div className="stat-info">
            <div className="stat-value">{referrals.length}</div>
            <div className="stat-label">Total Referred</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(255, 171, 0, 0.08)', color: 'var(--warning)' }}><HiOutlineClock /></div>
          <div className="stat-info">
            <div className="stat-value">{statusStats.pending || 0}</div>
            <div className="stat-label">Pending Review</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(0, 230, 118, 0.08)', color: 'var(--success)' }}><MdCheckCircle /></div>
          <div className="stat-info">
            <div className="stat-value">{statusStats.hired || 0}</div>
            <div className="stat-label">Hired</div>
          </div>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-input-group">
          <HiOutlineSearch size={18} />
          <input
            type="text"
            placeholder="Search by candidate name, job code, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {!filteredReferrals.length ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <HiOutlineUser size={48} style={{ marginBottom: '15px' }} />
          <h3>No referrals matched</h3>
          <p>Candidates you refer will appear here for status tracking.</p>
        </div>
      ) : (
        <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))' }}>
          {filteredReferrals.map((referral) => {
            const statusConfig = getStatusConfig(referral.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div key={referral._id} className="referral-card animate-fade-in shadow-sm">
                <div className="referral-card-header">
                  <div className="flex-row">
                    <div className="stat-icon" style={{ width: '42px', height: '42px', borderRadius: '10px', fontSize: '18px' }}>
                      <MdPerson />
                    </div>
                    <div className="flex-col">
                      <h3 style={{ margin: 0, fontSize: '18px' }}>{referral.candidate?.name}</h3>
                      <div className={`status-badge ${statusConfig.className}`}>
                        <StatusIcon size={12} />
                        <span>{referral.status}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-muted">{formatDate(referral.createdAt)}</span>
                </div>

                <div className="referral-card-body">
                  {referral.jobPostId && (
                    <div style={{ marginBottom: '20px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                      <span className="info-label" style={{ marginBottom: '6px', display: 'block' }}>Targeted Opportunity</span>
                      <h4 style={{ color: '#fff', fontSize: '15px', marginBottom: '4px' }}>{referral.jobPostId.jobBasics?.title}</h4>
                      <div className="flex-row" style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                         <HiOutlineIdentification /> {referral.jobPostId.jobCode} • <BsBriefcase /> {referral.jobPostId.organizationName}
                      </div>
                    </div>
                  )}

                  <div className="grid-2">
                    <div className="info-item">
                      <span className="info-label">Contact Details</span>
                      <span className="info-value"><HiOutlineMail size={14} className="text-muted" /> {referral.candidate?.email}</span>
                      <span className="info-value"><HiOutlinePhone size={14} className="text-muted" /> {referral.candidate?.mobile}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Experience & Expectation</span>
                      <span className="info-value"><HiOutlineChartBar size={14} className="text-muted" /> {referral.candidate?.totalExperience} Years</span>
                      <span className="info-value"><HiOutlineCurrencyRupee size={14} className="text-muted" /> {formatCurrency(referral.candidate?.expectedCTC)}</span>
                    </div>
                  </div>

                  {referral.resume?.url && (
                    <div style={{ marginTop: '20px' }}>
                      <button
                        type="button"
                        className="skill-chip"
                        style={{ width: '100%', justifyContent: 'center', padding: '10px', background: 'rgba(0,123,255,0.05)', borderColor: 'rgba(0,123,255,0.1)', cursor: 'pointer' }}
                        onClick={() =>
                          setResumeModal({
                            url: `${import.meta.env.VITE_API_URL}/resume/${referral._id}`,
                            name: referral.resume.originalName,
                          })
                        }
                      >
                        <MdAttachFile />
                        View Document ({(referral.resume.size / 1024).toFixed(1)} KB)
                      </button>
                    </div>
                  )}
                </div>

                <div className="referral-card-footer">
                  <span className="text-xs text-muted">REF NO: {referral._id.slice(-8).toUpperCase()}</span>
                  <button
                    onClick={() => handleDelete(referral._id)}
                    disabled={isDeleting === referral._id}
                    className="btn-danger"
                  >
                    <MdCancel />
                    {isDeleting === referral._id ? 'Removing...' : 'Remove Entry'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
