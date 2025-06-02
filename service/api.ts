import axios from "axios";

// Instance utama untuk akses langsung ke backend
const api = axios.create({
  baseURL: "https://tikethebat.ambitiousflower-0b7495d3.southeastasia.azurecontainerapps.io/api/v1",
  timeout: 100000,
  withCredentials: true, // penting agar cookie otomatis disertakan
});

// Instance untuk akses via proxy Next.js (jika perlu)
export const Baseapi = axios.create({
  baseURL: '/api', // proxy ke backend
});

export default api;