import api from "./api";
import { ShipResponse } from "@/types/ship"; // kalau kamu simpan di /types/ship.ts

export const getShips = () => {
  return api.get<ShipResponse>("/ships");
};
