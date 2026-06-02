import apiClient from './apiClient';

export const getMyRecruitments = () =>
  apiClient.get('/recruitments/me');

export const getPendingApplications = (recruitmentId) =>
  apiClient.get(`/recruitments/${recruitmentId}/applications/pending`);

export const getAcceptedApplications = (recruitmentId) =>
  apiClient.get(`/recruitments/${recruitmentId}/applications/accepted`);

export const getRejectedApplications = (recruitmentId) =>
  apiClient.get(`/recruitments/${recruitmentId}/applications/rejected`);

export const getApplicationDetail = (recruitmentId, applicationId) =>
  apiClient.get(`/recruitments/${recruitmentId}/applications/${applicationId}`);

export const updateApplicationStatus = (recruitmentId, applicationId, status) =>
  apiClient.patch(`/recruitments/${recruitmentId}/applications/${applicationId}/status`, { status });

export const completeRecruitment = (recruitmentId) =>
  apiClient.patch(`/recruitments/${recruitmentId}/status`, { status: 'COMPLETED' });
