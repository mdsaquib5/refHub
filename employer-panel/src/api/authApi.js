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
  try {
    const res = await axios.post("/employers/refresh-token", {}, {
      validateStatus: function (status) {
        return status >= 200 && status < 300 || status === 401;
      }
    });

    if (res.status === 401) {
      return Promise.reject({ isSilentRefresh: true });
    }

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const employerLogoutApi = async () => {
  await axios.post("/employers/logout");
};
