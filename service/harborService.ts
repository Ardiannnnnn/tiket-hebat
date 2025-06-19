import api, {Baseapi} from "./api";
import { Harbor, HarborResponse } from "@/types/harbor"; // kalau kamu simpan di /types/ship.ts


export const getHarbors = async (
  page: number = 1,
  limit: number = 10,
  search: string = ""
): Promise<HarborResponse | null> => {
  try {
    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("limit", String(limit));
    if (search.trim() !== "") {
      params.append("search", search.trim());
    }

    const response = await api.get<HarborResponse>(`/harbors?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch harbors:", error);
    return null;
  }
};

export const createHarbor = async (data: any): Promise<boolean> => {
  try {
    await Baseapi.post("/harbor/create", data);
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
