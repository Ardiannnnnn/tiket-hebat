import axios from "axios";

const api = axios.create({
  baseURL: "https://tikethebat.ambitiousflower-0b7495d3.southeastasia.azurecontainerapps.io/api/v1",
  timeout: 100000,
  withCredentials: true, // penting agar cookie otomatis disertakan
});

// Request interceptor (bisa kosong kalau token di cookie)
api.interceptors.request.use(
  (config) => {
    // bisa tambahkan header lain di sini kalau perlu
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor untuk global handling error 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect ke halaman login misalnya
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
