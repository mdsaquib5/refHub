import axios from "./axios";

// Employer → list all jobs
export const getAllJobsApi = async () => {
    const res = await axios.get("/jobs");
    return res.data;
};

// get job by id (EDIT)
export const getJobByIdApi = async (jobId) => {
    const res = await axios.get(`/jobs/${jobId}`);
    return res.data; // 👈 backend response 그대로
};

// create job
export const createJobApi = async (jobData) => {
    const res = await axios.post("/jobs/create", jobData);
    return res.data;
};

// update job status
export const updateJobStatusApi = async ({ jobId, status }) => {
    const res = await axios.patch(`/jobs/${jobId}/status`, { status });
    return res.data;
};

// delete job
export const deleteJobApi = async (jobId) => {
    const res = await axios.delete(`/jobs/${jobId}`);
    return res.data;
};