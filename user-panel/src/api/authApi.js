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
  try {
    // validateStatus to prevent axios from throwing an error on 401 only for this request
    const res = await axios.post("/users/refresh-token", {}, {
      validateStatus: function (status) {
        return status >= 200 && status < 300 || status === 401;
      }
    });

    // If it's a 401, manually reject without triggering the global interceptor's red console error
    if (res.status === 401) {
      return Promise.reject({ isSilentRefresh: true });
    }

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const userLogoutApi = async () => {
  await axios.post("/users/logout");
};
