import api, {Baseapi} from "./api";
import { Harbor, HarborResponse } from "@/types/harbor"; // kalau kamu simpan di /types/ship.ts

export const getHarbors = async (): Promise<HarborResponse | null> => {
  try {
    const response = await api.get<HarborResponse>("/harbors");
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch ships:", error);
    return null; // Return null or handle the error appropriately
  }
};

export const createHarbor = async (data: any): Promise<boolean> => {
  try {
    await Baseapi.post("/v1/harbor/create", data);
    return true;
  } catch (error) {
    console.error("Failed to create harbor:", error);
    return false;
  }
};

export const deleteharbor = async (id: string | number): Promise<boolean> => {
  try {
    // Berdasarkan endpoint yang Anda berikan di prompt awal
    await Baseapi.delete(`/v1/harbor/${id}`);
    return true;
  } catch (error) {
    console.error("Failed to delete ship:", error);
    return false;
  }
};


export const updateHarbor = async (
  id: string | number,
  data: Partial<Harbor>
): Promise<boolean> => {
  try {
    await Baseapi.put(`/v1/harbor/update/${id}`, data); // Gunakan PUT sesuai endpoint
    return true;
  } catch (error) {
    console.error("Failed to update ship:", error);
    return false;
  }
};

export const getHarborById = async (id: string | number): Promise<Harbor | null> => {
  try {
    const response = await api.get<{ status: boolean; data: Harbor }>(`/harbor/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch ship by ID:", error);
    return null;
  }
};
