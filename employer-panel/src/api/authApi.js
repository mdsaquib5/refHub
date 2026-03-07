import axios from "./axios";

export const employerLoginApi = async (payload) => {
  const res = await axios.post("/employers/login", payload);
  return res.data;
};

export const employerSignupApi = async (payload) => {
  const res = await axios.post("/employers/signup", payload);
  return res.data;
};

export const employerRefreshApi = async () => {
  const res = await axios.post("/employers/refresh-token");
  return res.data;
};

export const employerLogoutApi = async () => {
  await axios.post("/employers/logout");
};
