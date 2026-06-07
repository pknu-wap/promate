import axios from "axios";
import { reissueKakaoToken } from "./Auth/kakaoAuthApi.js";
import { useAuthStore } from "../stores/useAuthStore.js";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

let isAuthErrorAlerted = false;

// Request 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    if (response.data && response.data.isSuccess === false) {
      return Promise.reject(new Error(response.data.message || "API 요청 처리 중 문제가 발생했습니다."));
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { accessToken, refreshToken, login } = useAuthStore.getState();

        if (!refreshToken) {
          throw new Error("리프레시 토큰이 없습니다.");
        }

        const newTokens = await reissueKakaoToken(refreshToken, accessToken);

        if (login) login(newTokens.accessToken, newTokens.refreshToken);
        localStorage.setItem("accessToken", newTokens.accessToken); // 기존 request interceptor 호환용

        originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
        return apiClient(originalRequest);
      } catch (reissueError) {
        console.error("토큰 재발급 실패:", reissueError);
        if (!isAuthErrorAlerted) {
          isAuthErrorAlerted = true;
          localStorage.removeItem("accessToken");
          const { logout } = useAuthStore.getState();
          if (logout) logout();
          alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
          window.location.href = "/login";
        }
        return Promise.reject(reissueError);
      }
    } else if (error.response && error.response.status === 403) {
      console.warn("API 접근 권한이 없습니다 (403 Forbidden). 요청 url:", error.config?.url);
    }

    if (error.response?.data?.message) {
      return Promise.reject(new Error(error.response.data.message));
    }

    return Promise.reject(error);
  }
);

export default apiClient;