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
    return <p>Loading jobs...</p>;
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