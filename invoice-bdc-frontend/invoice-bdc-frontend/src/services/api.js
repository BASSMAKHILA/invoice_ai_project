import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // 🔁 adapte selon ton déploiement

export const uploadFile = async (formData) => {
  return axios.post(`${API_BASE_URL}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getHistory = async () => {
  return axios.get(`${API_BASE_URL}/invoices`);
};
