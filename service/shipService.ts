import api from "./api";
import { ShipResponse } from "@/types/ship"; // kalau kamu simpan di /types/ship.ts

export const getShips = async (): Promise<ShipResponse> => {
  const response = await api.get<ShipResponse>("/ships");
  console.log("response", response.data);
  return response.data;
};
