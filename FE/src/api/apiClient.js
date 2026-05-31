import axios from "axios";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
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
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!isAuthErrorAlerted) {
        isAuthErrorAlerted = true;
        localStorage.removeItem("accessToken");
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        window.location.href = "/login";
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