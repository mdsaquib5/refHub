import { create } from "zustand";
import {
  userLoginApi,
  userSignupApi,
  userLogoutApi,
  userRefreshApi,
} from "../api/authApi";
import { toast } from "react-toastify";

export const useAuthStore = create((set) => ({
  accessToken: null,
  isAuthenticated: false,
  authChecked: false,
  loading: false,
  user: null,

  login: async (payload) => {
    set({ loading: true });
    try {
      const data = await userLoginApi(payload);
      set({
        accessToken: data.accessToken,
        user: data.user || null,
        isAuthenticated: true,
        loading: false,
      });
      toast.success("Login successful");
    } catch (err) {
      set({ loading: false });
      toast.error(err.response?.data?.message || "Login failed");
      throw err;
    }
  },

  signup: async (payload) => {
    set({ loading: true });
    try {
      const data = await userSignupApi(payload);
      set({
        accessToken: data.accessToken,
        user: data.user || null,
        isAuthenticated: true,
        loading: false,
      });
      toast.success("Signup successful");
    } catch (err) {
      set({ loading: false });
      toast.error(err.response?.data?.message || "Signup failed");
      throw err;
    }
  },

  refresh: async () => {
    try {
      const data = await userRefreshApi();
      set({
        accessToken: data.accessToken,
        user: data.user || null,
        isAuthenticated: true,
        authChecked: true,
      });
    } catch {
      set({
        accessToken: null,
        user: null,
        isAuthenticated: false,
        authChecked: true,
      });
    }
  },

  logout: async () => {
    try {
      await userLogoutApi();
    } catch {
      // Proceed with local logout even if API call fails
    }
    set({ accessToken: null, user: null, isAuthenticated: false });
  },
}));
