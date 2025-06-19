import api, { Baseapi } from "./api";
import { ManifestResponse } from "@/types/kapasitas"; // atau sesuaikan path-nya

interface CreateKapasitasPayload {
  ship_id: number;
  class_id: number;
  capacity: number;
}

export const getManifest = async (page = 1, limit = 20) : Promise<ManifestResponse | null> => {
  try {
    const response = await api.get("/manifests/?page=1&limit=100&sort=created_at:asc&search=");
    return response.data;
  } catch (error) {
    console.error("Gagal mengambil data kelas:", error);
    throw error;
  }
}

export const createKapasitas = async (payload: CreateKapasitasPayload): Promise<boolean> => {
  try {
    const response = await Baseapi.post("/manifest/create", payload);
    return response.data
  } catch(err){
    console.error("Error Creating Capasity")
    return false
  }
}

export const deleteManifest= async (id: number): Promise<boolean> => {
  try {
    await api.delete(`/manifests/${id}`);
    return true;
  } catch (error) {
    console.error("Gagal menghapus kelas:", error);
    return false;
  }
}