// service/api.ts
import axios from "axios";

const TUNNEL_URL = "https://api.tikethebat.live";

export const api = axios.create({
  baseURL: `${TUNNEL_URL}/api/v1`,
  timeout: 100000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

export const Baseapi = axios.create({
  baseURL: '/api/v1', // This will use the Next.js rewrite
  timeout: 100000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

export default api;