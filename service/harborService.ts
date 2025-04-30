import api from "./api";
import { HarborResponse } from "@/types/harbor"; // kalau kamu simpan di /types/ship.ts

export const getHarbor = () => {
  return api.get<HarborResponse>("/harbors");
};
