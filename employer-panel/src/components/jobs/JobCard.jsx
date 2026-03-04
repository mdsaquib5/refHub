import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteJobApi, updateJobStatusApi } from "../../api/jobsApi";
import { toast } from "react-toastify";

const JobCard = ({ job }) => {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: deleteJobApi,
        onSuccess: () => {
            toast.success("Job deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["employer-jobs"] });
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Delete failed");
        }
    });

    const statusMutation = useMutation({
        mutationFn: updateJobStatusApi,
        onMutate: async ({ jobId, status }) => {
            await queryClient.cancelQueries({ queryKey: ["employer-jobs"] });
            const previous = queryClient.getQueryData(["employer-jobs"]);
            queryClient.setQueryData(["employer-jobs"], (old) => {
                if (!old?.jobs) return old;
                return {
                    ...old,
                    jobs: old.jobs.map((j) =>
                        j._id === jobId ? { ...j, status } : j
                    ),
                };
            });
            return { previous };
        },
        onSuccess: () => {
            toast.success("Job status updated");
        },
        onError: (err, vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(["employer-jobs"], context.previous);
            }
            toast.error("Failed to update status");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["employer-jobs"] });
        },
    });

    const handleDelete = () => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this job?"
        );
        if (!confirmDelete) return;
        deleteMutation.mutate(job._id);
    };

    const toggleStatus = () => {
        const newStatus = job.status === "active" ? "closed" : "active";
        statusMutation.mutate({ jobId: job._id, status: newStatus });
    };

    const {
        jobBasics,
        workplace,
        experience,
        salaryRange,
        organizationName,
        jobSummary,
        jobDescription,
        locations,
        skillsRequired,
        status
    } = job;

    const salaryMinL = (salaryRange.min / 100000).toFixed(1);
    const salaryMaxL = (salaryRange.max / 100000).toFixed(1);

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });

    return (
        <div className="job-card">
            <div className="job-header">
                <div className="job-title-section">
                    <h1>{jobBasics.title}</h1>
                    <p className="organization">{organizationName}</p>

                    <div className="job-meta">
                        <span className="location">{locations.join(", ")}</span>
                        <span className="work-type">{workplace.workType}</span>
                        <span className="work-type">{job.jobCode}</span>
                        <span className="experience">
                            {experience.min}-{experience.max} years
                        </span>
                        <span className="salary">
                            {salaryMinL}L - {salaryMaxL}L {salaryRange.currency}
                        </span>
                        <span className="openings">
                            {workplace.numberOfOpenings} openings
                        </span>
                        <span className="seniority">
                            {workplace.seniorityLevel}
                        </span>
                    </div>

                    <div className="job-meta" style={{ marginTop: "4px", fontSize: "12px", color: "#999" }}>
                        <span>ID: {job._id}</span>
                        <span>Posted: {formatDate(job.createdAt)}</span>
                    </div>
                </div>

                <div className="job-actions">
                    <button
                        className="apply-btn"
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                    >
                        {deleteMutation.isPending ? <span className="btn-loading"><span className="spinner spinner--sm"></span>Deleting</span> : "Delete"}
                    </button>
                </div>
            </div>

            <div className="job-highlights">
                <h2>Job Highlights</h2>
                <ul>
                    <li>
                        Category: {jobBasics.jobCategory}
                    </li>
                    <li>
                        Experience: {experience.min}-{experience.max} years in{" "}
                        {jobBasics.department}
                    </li>
                </ul>
            </div>

            <div className="job-description">
                <h2>Job Description</h2>
                <p>{jobSummary}</p>
                <p>{jobDescription}</p>
            </div>

            <div className="required-skills">
                <h2>Required Skills</h2>
                <div className="skills-tags">
                    {skillsRequired.map((skill, index) => (
                        <span key={index} className="skill-tag">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            <div className="role-info">
                <div className="info-row">
                    <span className="label">Role:</span>
                    <span>{jobBasics.jobCategory}</span>
                </div>
                <div className="info-row">
                    <span className="label">Department:</span>
                    <span>{jobBasics.department}</span>
                </div>
                <div className="info-row">
                    <span className="label">Employment Type:</span>
                    <span>
                        {workplace.workType} - {workplace.seniorityLevel}
                    </span>
                </div>
            </div>

            {/* STATUS BADGE */}
            <button
                className="status-badge"
                onClick={toggleStatus}
                style={{
                    cursor: "pointer",
                    backgroundColor:
                        status === "active" ? "#28a745" : "#6c757d",
                    border: "none",
                    borderRadius: "6px",
                    padding: "6px 12px",
                    color: "white",
                    fontWeight: "600",
                    fontSize: "12px",
                    transition: "all 0.2s ease",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                }}
                title="Click to toggle status"
                onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.05)";
                    e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                    e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                }}
            >
                {status === "active" && ""} {status === "inactive" && ""}
                {status.toUpperCase()}
            </button>
        </div>
    );
};

export default JobCard;
