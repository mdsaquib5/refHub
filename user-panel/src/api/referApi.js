import axios from "./axios";

export const getJobByJobCode = async (jobCode) => {
  const res = await axios.get(`/user/jobs?jobCode=${jobCode}`);
  return res.data?.jobs?.[0] || null;
};

export const createReferral = async (formData) => {
  const res = await axios.post("/referral/refer", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
