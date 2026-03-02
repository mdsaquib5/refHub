import axios from "./axios";

export const getAllJobs = async () => {
  const res = await axios.get("/user/jobs");
  return res.data?.jobs || [];
};
