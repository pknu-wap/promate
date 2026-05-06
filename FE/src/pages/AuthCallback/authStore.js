import { create } from "zustand";

export const useAuthStore = create((set) => ({
  isLoggedIn: !!localStorage.getItem("accessToken"),
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