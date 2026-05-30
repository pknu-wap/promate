import apiClient from "../apiClient";

export const getUserInfo = async () => {
  try {
    const response = await apiClient.get("/user/me");
    return response.data;
  } catch (error) {
    console.error("유저 정보 조회 실패:", error);
    throw error;
  }
};