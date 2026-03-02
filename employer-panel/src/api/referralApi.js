import axios from "./axios";

export const getAllReferralsApi = async () => {
  const res = await axios.get("/employer/referral/all");
  return res.data;
};

export const getReferralsByJobApi = async (jobId) => {
  const res = await axios.get(`/employer/referral/jobs/${jobId}/referrals`);
  return res.data;
};

export const updateReferralStatusApi = async ({ referralId, status }) => {
  const res = await axios.patch(
    `/employer/referral/referrals/${referralId}/status`,
    { status }
  );
  return res.data;
};
