// api/shipService.ts

import api from "./api";
import { Ship, ShipResponse } from "@/types/ship";

export const getShips = async (): Promise<ShipResponse | null> => {
  try {
    const response = await api.get<ShipResponse>("/ships");
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch ships:", error);
    return null; // Return null or handle the error appropriately
  }
};

export const createShip = async (data: any): Promise<boolean> => {
  try {
    await api.post("/ship", data);
    return true;
  } catch (error) {
    console.error("Failed to create ship:", error);
    return false;
  }
};

export const deleteShip = async (id: string | number): Promise<boolean> => {
  try {
    // Berdasarkan endpoint yang Anda berikan di prompt awal
    await api.delete(`/ship/${id}`);
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
    await api.put(`/ship/${id}`, data); // Gunakan PUT sesuai endpoint
    return true;
  } catch (error) {
    console.error("Failed to update ship:", error);
    return false;
  }
};

export const getShipById = async (id: string | number): Promise<Ship | null> => {
  try {
    const response = await api.get<{ status: boolean; data: Ship }>(`/ship/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch ship by ID:", error);
    return null;
  }
};
