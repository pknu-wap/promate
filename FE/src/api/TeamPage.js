import apiClient from "./apiClient";

export const getProjectMembers = async (projectId) => {
  const response = await apiClient.get(`/projects/${projectId}/members`);
  return response.data.data;
};

export const getProjectTasks = async (projectId) => {
  const response = await apiClient.get(`/projects/${projectId}/tasks`);
  return response.data.data;
};

export const getProjectPosts = async (projectId) => {
  const response = await apiClient.get(`/projects/${projectId}/posts`);
  return response.data.data;
};

export const getPostDetail = async (projectId, postId) => {
  const response = await apiClient.get(`/projects/${projectId}/posts/${postId}`);
  return response.data.data;
};

export const createProjectPost = async (projectId, postData) => {
  const response = await apiClient.post(`/projects/${projectId}/posts`, postData);
  return response.data.data;
};

export const updateProjectPost = async (projectId, postId, postData) => {
  const response = await apiClient.put(`/projects/${projectId}/posts/${postId}`, postData);
  return response.data.data;
};

export const deleteProjectPost = async (projectId, postId) => {
  const response = await apiClient.delete(`/projects/${projectId}/posts/${postId}`);
  return response.data.data;
};

export const getTaskDetail = async (projectId, taskId) => {
  const response = await apiClient.get(`/projects/${projectId}/tasks/${taskId}`);
  return response.data.data;
};

export const createProjectTask = async (projectId, taskData) => {
  const response = await apiClient.post(`/projects/${projectId}/tasks`, taskData);
  return response.data.data;
};

export const updateProjectTask = async (projectId, taskId, taskData) => {
  const response = await apiClient.put(`/projects/${projectId}/tasks/${taskId}`, taskData);
  return response.data.data;
};

export const updateTaskStatus = async (projectId, taskId, statusObj) => {
  const response = await apiClient.patch(`/projects/${projectId}/tasks/${taskId}/status`, statusObj);
  return response.data.data;
};

export const deleteProjectTask = async (projectId, taskId) => {
  const response = await apiClient.delete(`/projects/${projectId}/tasks/${taskId}`);
  return response.data.data;
};