import axios from "axios";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

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
  (error) => Promise.reject(error)
);

export default apiClient;