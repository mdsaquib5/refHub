import axios from "./axios";

export const getMyReferrals = async () => {
  const res = await axios.get("/referral");
  return res.data?.referrals || [];
};

export const deleteReferral = async (referralId) => {
  const res = await axios.delete(`/referral/${referralId}`);
  return res.data;
};
