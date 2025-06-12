// api/shipService.ts

import api, {Baseapi} from "./api";
import { Ship, ShipResponse } from "@/types/ship";

export const getShips = async (page = 1, limit = 20): Promise<ShipResponse | null> => {
  try {
    const response = await api.get<ShipResponse>(`/ships?page=${page}&limit=${limit}`);
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch ships:", error);
    return null;
  }
};

export const createShip = async (data: any): Promise<boolean> => {
  try {
    await Baseapi.post("/v1/ship/create", data);
    return true;
  } catch (error) {
    console.error("Failed to create ship:", error);
    return false;
  }
};

export const deleteShip = async (id: string | number): Promise<boolean> => {
  try {
    // Berdasarkan endpoint yang Anda berikan di prompt awal
    await Baseapi.delete(`/v1/ship/${id}`);
    return true;
  } catch (error) {
    console.error("Failed to delete ship:", error);
    return false;
  }
};

export const updateShip = async (
  id: string | number,
  data: Partial<Ship>
): Promise<boolean> => {
  try {
    await Baseapi.put(`v1//ship/${id}`, data); // Gunakan PUT sesuai endpoint
    return true;
  } catch (error) {
    console.error("Failed to update ship:", error);
    return false;
  }
};

export const getShipById = async (id: string | number): Promise<Ship | null> => {
  try {
    const response = await api.get<{ status: boolean; data: Ship }>(`/ships/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch ship by ID:", error);
    return null;
  }
};
