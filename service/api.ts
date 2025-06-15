import axios from "axios";

// Instance utama untuk akses langsung ke backend
export const api = axios.create({
  baseURL: "https://tikethebat.gentleglacier-f20ff377.southeastasia.azurecontainerapps.io/api/v1",
  timeout: 100000,
  withCredentials: true, // penting agar cookie otomatis disertakan
});

// Instance untuk akses via proxy Next.js (jika perlu)
export const Baseapi = axios.create({
  baseURL: '/api/v1', // proxy ke backend
});

export default api;