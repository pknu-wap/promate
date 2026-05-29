import apiClient from '../apiClient';

export const getDashboardProjects = () => {
  return apiClient.get('/dashboard/projects/me');
};

export const getDashboardUrgentTasks = () => {
  return apiClient.get('/dashboard/tasks/deadline');
};

export const getDashboardCompletedTasks = () => {
  return apiClient.get('/dashboard/tasks/completed');
};

export const getDashboardProjectStatuses = () => {
  return apiClient.get('/dashboard/projects/status');
};