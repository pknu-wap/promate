import { create } from "zustand";

export const useAuthStore = create((set) => ({
  isLoggedIn: !!localStorage.getItem("accessToken"),

  login: (accessToken) => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      set({ isLoggedIn: true });
    }
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    set({ isLoggedIn: false });
  },
}));