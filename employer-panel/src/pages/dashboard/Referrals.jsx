import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import { getAllReferralsApi, updateReferralStatusApi } from "../../api/referralApi";
import { getAllJobsApi } from "../../api/jobsApi";

const STATUS_OPTIONS = [
  "pending",
  "viewed",
  "shortlisted",
  "interviewed",
  "rejected",
  "hired",
];

const STATUS_COLORS = {
  pending: "#00B0FF",     // Alten Info Blue
  viewed: "#007BFF",      // Alten Secondary Blue
  shortlisted: "#00E676",  // Greenish Cyan
  interviewed: "#003A8F", // Alten Primary Deep Blue
  rejected: "#FF4D4D",    // Subtle Red
  hired: "#00E676",       // Vibrant success
};

const Referrals = () => {
  const queryClient = useQueryClient();
  const [selectedJob, setSelectedJob] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [resumeModal, setResumeModal] = useState(null);

  const {
    data: referralsData,
    isLoading: referralsLoading,
    isError: referralsError,
  } = useQuery({
    queryKey: ["employer-referrals"],
    queryFn: getAllReferralsApi,
  });

  const { data: jobsData } = useQuery({
    queryKey: ["employer-jobs"],
    queryFn: getAllJobsApi,
  });

  const statusMutation = useMutation({
    mutationFn: updateReferralStatusApi,
    onMutate: async ({ referralId, status }) => {
      await queryClient.cancelQueries({ queryKey: ["employer-referrals"] });
      const previous = queryClient.getQueryData(["employer-referrals"]);
      queryClient.setQueryData(["employer-referrals"], (old) => {
        if (!old?.referrals) return old;
        return {
          ...old,
          referrals: old.referrals.map((r) =>
            r._id === referralId ? { ...r, status } : r
          ),
        };
      });
      return { previous };
    },
    onSuccess: () => {
      toast.success("Status updated");
    },
    onError: (err, vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["employer-referrals"], context.previous);
      }
      toast.error(err.response?.data?.message || "Failed to update status");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["employer-referrals"] });
    },
  });

  const handleStatusChange = (referralId, newStatus) => {
    statusMutation.mutate({ referralId, status: newStatus });
  };

  const referrals = referralsData?.referrals || [];
  const jobs = jobsData?.jobs || [];

  const searchLower = searchTerm.toLowerCase();
  const filteredReferrals = referrals.filter((r) => {
    const matchesJob =
      selectedJob === "all" || r.jobPostId?._id === selectedJob;

    const matchesSearch =
      !searchTerm ||
      r.candidate?.name?.toLowerCase().includes(searchLower) ||
      r.candidate?.email?.toLowerCase().includes(searchLower) ||
      r.candidate?.currentDesignation?.toLowerCase().includes(searchLower) ||
      r.candidate?.currentOrganization?.toLowerCase().includes(searchLower) ||
      r.jobPostId?.jobCode?.toLowerCase().includes(searchLower) ||
      r.jobPostId?.organizationName?.toLowerCase().includes(searchLower) ||
      r.referredBy?.name?.toLowerCase().includes(searchLower) ||
      r.referredBy?.email?.toLowerCase().includes(searchLower) ||
      r.status?.toLowerCase().includes(searchLower);

    return matchesJob && matchesSearch;
  });

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

  if (referralsLoading) {
    return (
      <div className="referrals-container">
        <div className="referrals-page-header">
          <h1>All Referrals</h1>
        </div>
        <div className="skeleton-list">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-row">
                <div className="skeleton-line skeleton-line--short" style={{ marginBottom: 0, flex: 1 }}></div>
                <div className="skeleton-chip"></div>
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

  if (referralsError) {
    return (
      <div className="referrals-container">
        <p>Failed to load referrals</p>
      </div>
    );
  }

  return (
    <div className="referrals-container">
      <div className="referrals-page-header">
        <h1>All Referrals</h1>
        <span className="referral-count">{referrals.length} total</span>
      </div>

      {/* Filters */}
      <div className="referrals-filters">
        <input
          type="text"
          className="referral-search"
          placeholder="Search by name, email, job code, designation, status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="job-select"
          value={selectedJob}
          onChange={(e) => setSelectedJob(e.target.value)}
        >
          <option value="all">All Jobs</option>
          {jobs.map((job) => (
            <option key={job._id} value={job._id}>
              {job.jobBasics?.title} ({job.jobCode})
            </option>
          ))}
        </select>
      </div>

      {/* Referral Cards */}
      {filteredReferrals.length === 0 ? (
        <p className="no-referrals">No referrals found</p>
      ) : (
        <div className="referrals-list">
          {filteredReferrals.map((referral) => (
            <div key={referral._id} className="referral-card">
              <div className="referral-card-top">
                <h3>{referral.candidate?.name}</h3>
                <span
                  className={`referral-status-badge status-${referral.status}`}
                >
                  {referral.status}
                </span>
              </div>

              <div className="role-info">
                <div className="info-row">
                  <span className="label">Contact Email</span>
                  <span>{referral.candidate?.email}</span>
                </div>
                <div className="info-row">
                  <span className="label">Phone Number</span>
                  <span>{referral.candidate?.mobile || "N/A"}</span>
                </div>
                <div className="info-row">
                  <span className="label">Current Designation</span>
                  <span>
                    {referral.candidate?.currentDesignation || "N/A"}
                    {referral.candidate?.currentOrganization && ` @ ${referral.candidate.currentOrganization}`}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Total Experience</span>
                  <span>{referral.candidate?.totalExperience ?? "0"} Years</span>
                </div>
              </div>

              <div className="role-info" style={{ marginTop: '16px' }}>
                <div className="info-row">
                  <span className="label">Current CTC</span>
                  <span>{formatCurrency(referral.candidate?.currentCTC)}</span>
                </div>
                <div className="info-row">
                  <span className="label">Expected CTC</span>
                  <span>{formatCurrency(referral.candidate?.expectedCTC)}</span>
                </div>
              </div>

              {referral.candidate?.skillSet?.length > 0 && (
                <div className="referral-skills">
                  {referral.candidate.skillSet.map((skill, i) => (
                    <span key={i} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Job Info */}
              {referral.jobPostId && (
                <div className="referral-job-info" style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                  <span className="label" style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800' }}>Applied For</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <span style={{ fontWeight: '700', color: '#fff' }}>{referral.jobPostId.jobBasics?.title}</span>
                    <span className="referral-job-code">{referral.jobPostId.jobCode}</span>
                  </div>
                </div>
              )}

              {/* Resume */}
              {referral.resume?.url && (
                <div style={{ marginTop: '16px' }}>
                  <button
                    type="button"
                    className="referral-resume-link"
                    onClick={() =>
                      setResumeModal({
                        url: `${import.meta.env.VITE_API_URL}/resume/${referral._id}`,
                        name: referral.resume.originalName,
                      })
                    }
                  >
                    View Resume: {referral.resume.originalName}
                  </button>
                </div>
              )}

              <div className="referral-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  By: <strong>{referral.referredBy?.name}</strong>
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {formatDate(referral.createdAt)}
                </span>
              </div>

              {/* Status Update */}
              <div className="referral-status-update">
                <label>Update Status:</label>
                <select
                  value={referral.status}
                  onChange={(e) =>
                    handleStatusChange(referral._id, e.target.value)
                  }
                  disabled={statusMutation.isPending}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
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

export default Referrals;
