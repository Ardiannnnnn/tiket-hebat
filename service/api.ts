// src/services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "https://tikethebat--0000005.ambitiousflower-0b7495d3.southeastasia.azurecontainerapps.io/api/v1",
  timeout: 100000, //
});

export default api;
