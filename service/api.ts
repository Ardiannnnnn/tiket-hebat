import axios from "axios";

const api = axios.create({
  baseURL: "https://tikethebat.ambitiousflower-0b7495d3.southeastasia.azurecontainerapps.io/api/v1",
  timeout: 100000,
  withCredentials: true, // penting agar cookie otomatis disertakan
});
export default api;
