// service/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "https://tikethebat.gentleglacier-f20ff377.southeastasia.azurecontainerapps.io/api/v1",
  timeout: 100000,
  withCredentials: true,
});

export const Baseapi = axios.create({
  baseURL: '/api/v1',
});

// ✅ Optional: Add global error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

Baseapi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Base API Error:', error);
    return Promise.reject(error);
  }
);

export default api;