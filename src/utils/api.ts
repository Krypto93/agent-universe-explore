import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE;
 // Use Vite proxy to avoid CORS in dev

const getAuthHeader = () => {
  const token = localStorage.getItem('jwt');
  return token ? { Authorization: token } : {};
};

export const fetchAgents = async () => {
  return axios.get(`${API_BASE}/agents`, {
    headers: getAuthHeader()
  });
};

export const createAgent = async (data: any) => {
  return axios.post(`${API_BASE}/agents`, data, {
    headers: getAuthHeader()
  });
};

export const getAgentById = async (id: string) => {
  return axios.get(`${API_BASE}/${id}`, {
    headers: getAuthHeader()
  });
};

export const updateAgent = async (id: string, data: any) => {
  return axios.put(`${API_BASE}/${id}`, data, {
    headers: getAuthHeader()
  });
};

export const deleteAgent = async (id: string) => {
  return axios.delete(`${API_BASE}/${id}`, {
    headers: getAuthHeader()
  });
};

export const runAgent = async (id: string) => {
  return axios.post(`${API_BASE}/run`, { agentId: id }, {
    headers: getAuthHeader()
  });
};

export const fetchAgentRuns = async (agentId: string) => {
  return axios.get(`${API_BASE}/runs/${agentId}`, {
    headers: getAuthHeader()
  });
};
