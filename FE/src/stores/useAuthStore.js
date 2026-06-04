import { create } from "zustand";

const getInitialLoginState = () => {
  const token = localStorage.getItem("accessToken");
  return !!token && token !== "null" && token !== "undefined";
};

export const useAuthStore = create((set) => ({
  isLoggedIn: getInitialLoginState(),
  login: (accessToken, refreshToken) => {
    if (accessToken) localStorage.setItem("accessToken", accessToken);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    set({ isLoggedIn: true });
  },
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({ isLoggedIn: false });
  },
}));