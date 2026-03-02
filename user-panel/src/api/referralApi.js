import axios from "./axios";

export const getMyReferrals = async () => {
  const res = await axios.get("/referral");
  return res.data?.referrals || [];
};
