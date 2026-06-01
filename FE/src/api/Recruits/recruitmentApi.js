import apiClient from "../apiClient";

export const getApplicationForm = async (recruitmentId) => {
  const response = await apiClient.get(`/recruitments/${recruitmentId}/application-form`);

  return response.data;
};

export const postApplication = async (recruitmentId, applicationData) => {
  const response = await apiClient.post(`/recruitments/${recruitmentId}/apply`, applicationData);

  return response.data;
};

/**
 * 팀장 프로젝트 이력 조회
 * @param {number|string} recruitmentId
 * @returns {Promise<Object>}
 */
export const getLeaderProfile = async (recruitmentId) => {
  try {
    const response = await apiClient.get(`/recruits/${recruitmentId}/leader-profile`);
    return response.data.data;
  } catch (error) {
    console.error("팀장 프로필 조회 실패:", error);
    throw error;
  }
};