import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Service functions
export const getFertilizerRecommendation = (data) =>
  api
    .post("/fertilizer/recommend", data)
    .then((res) => res.data.recommendation);
export const getConsultations = () =>
  api.get("/consultation").then((res) => res.data);
export const scheduleConsultation = (data) =>
  api.post("/consultation/schedule", data).then((res) => res.data);
export const getContents = () => api.get("/content").then((res) => res.data);
export const createContent = (data) =>
  api.post("/content", data).then((res) => res.data);
export const getAllExperts = () => api.get("/users/experts").then(res => res.data);
export const getAllFarmers = () => api.get("/users/farmers").then(res => res.data);

// Export the api instance as default
export default api;
