import { create } from "zustand";
import {
  employerLoginApi,
  employerSignupApi,
  employerLogoutApi,
  employerRefreshApi,
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
      const data = await employerLoginApi(payload);
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
      const data = await employerSignupApi(payload);
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
      const data = await employerRefreshApi();
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
      await employerLogoutApi();
    } catch {
      // Proceed with local logout even if API fails
    }
    set({ accessToken: null, user: null, isAuthenticated: false });
  },
}));
