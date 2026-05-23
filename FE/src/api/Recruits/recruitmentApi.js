import apiClient from "../apiClient";

export const getApplicationForm = async (recruitmentId) => {
  const response = await apiClient.get(`/recruitments/${recruitmentId}/application-form`);

  return response.data;
};

export const postApplication = async (recruitmentId, applicationData) => {
  const response = await apiClient.post(`/recruitments/${recruitmentId}/apply`, applicationData);

  return response.data;
};