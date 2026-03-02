import { useQuery } from "@tanstack/react-query";
import JobCard from "../../components/jobs/JobCard";
import { getAllJobsApi } from "../../api/jobsApi";

const AllJobs = () => {
  const {
    data,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["employer-jobs"],
    queryFn: getAllJobsApi
  });

  if (isLoading) {
    return (
      <div className="all-jobs-container">
        <div className="skeleton-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-line skeleton-line--title"></div>
              <div className="skeleton-line skeleton-line--subtitle"></div>
              <div className="skeleton-line skeleton-line--long"></div>
              <div className="skeleton-line skeleton-line--medium"></div>
              <div className="skeleton-line skeleton-line--full"></div>
              <div className="skeleton-row">
                <div className="skeleton-chip"></div>
                <div className="skeleton-chip"></div>
                <div className="skeleton-chip"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  const jobs = data?.jobs || [];

  return (
    <div className="all-jobs-container">
      <div className="jobs-list">
        {jobs.length === 0 ? (
          <p>No jobs created yet</p>
        ) : (
          jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))
        )}
      </div>
    </div>
  );
};

export default AllJobs;