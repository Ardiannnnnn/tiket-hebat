import api, { Baseapi } from "./api";
import { ManifestResponse } from "@/types/kapasitas"; // atau sesuaikan path-nya

interface CreateKapasitasPayload {
  schedule_id: number;
  class_id: number;
  quota: number;
  price: number;
}

export const getManifest = async (page = 1, limit = 20) : Promise<ManifestResponse | null> => {
  try {
    const response = await api.get("/quotas");
    return response.data;
  } catch (error) {
    console.error("Gagal mengambil data kelas:", error);
    throw error;
  }
}

// service/kapasitas.ts
export const createKapasitas = async (payload: CreateKapasitasPayload): Promise<boolean> => {
  try {
    console.log("📤 Creating kapasitas with payload:", payload);
    
    const response = await api.post("/quota/create", payload);
    
    console.log("✅ Create kapasitas response:", response.data);
    
    // ✅ Handle different response structures
    if (response.data.status === true || response.data.success === true) {
      return true;
    }
    
    return false;
  } catch (error: any) {
    console.error("❌ Error creating kapasitas:", error);
    console.error("❌ Error response:", error.response?.data);
    return false;
  }
};

export const deleteManifest= async (id: number): Promise<boolean> => {
  try {
    await api.delete(`/manifests/${id}`);
    return true;
  } catch (error) {
    console.error("Gagal menghapus kelas:", error);
    return false;
  }
}