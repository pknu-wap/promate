import apiClient from "../apiClient";

export const getApplicationForm = async (recruitmentId) => {
  const response = await apiClient.get(`/recruitments/${recruitmentId}/application-form`);

  return response.data;
};