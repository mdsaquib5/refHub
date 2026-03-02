import axios from "./axios";

export const userLoginApi = async (payload) => {
  const res = await axios.post("/users/login", payload);
  return res.data;
};

export const userSignupApi = async (payload) => {
  const res = await axios.post("/users/signup", payload);
  return res.data;
};

export const userRefreshApi = async () => {
  const res = await axios.post("/users/refresh-token");
  return res.data;
};

export const userLogoutApi = async () => {
  await axios.post("/users/logout");
};
