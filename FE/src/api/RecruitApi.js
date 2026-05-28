import apiClient from './apiClient';

export const getApplicationList = (recruitmentId) =>
  apiClient.get(`/api/recruitments/${recruitmentId}/applications`);

export const getApplicationDetail = (recruitmentId, applicationId) =>
  apiClient.get(`/api/recruitments/${recruitmentId}/applications/${applicationId}`);

export const updateApplicationStatus = (recruitmentId, applicationId, status) =>
  apiClient.patch(`/api/recruitments/${recruitmentId}/applications/${applicationId}/status`, { status });
