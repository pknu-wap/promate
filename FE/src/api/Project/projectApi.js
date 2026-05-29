import apiClient from '../apiClient';

export const getAppliedProjects = () => {
  return apiClient.get('/projects/applications/me');
};

export const getBookmarkedProjects = (page = 0, size = 10) => {
  return apiClient.get('/recruitments/bookmark', {
    params: { page, size }
  });
};

export const getActiveProjects = () => {
  return apiClient.get('/projects/me');
};

export const getCompletedProjects = () => {
  return apiClient.get('/projects/activity/me');
};