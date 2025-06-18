import api, { Baseapi } from "./api";
import { CreateHargaPayload, HargaResponse } from "@/types/harga"; // atau sesuaikan path-nya

export const getharga = async (page = 1, limit = 20) : Promise<HargaResponse | null> => {
  try {
    const response = await api.get("/fares/?page=1&limit=100&sort=created_at:asc&search=");
    return response.data;
  } catch (error) {
    console.error("Gagal mengambil data harga:", error);
    throw error;
  }
}

export const createHarga = async (payload: CreateHargaPayload): Promise<boolean> => {
  try {
    const response = await Baseapi.post("/fare/create", payload);
    return response.status === 201 || response.status === 200;
  } catch (error) {
    console.error("Error creating harga:", error);
    return false;
  }
};

export const deleteHarga = async (id: number): Promise<boolean> => {
  try {
    await api.delete(`/fares/${id}`);
    return true;
  } catch (error) {
    console.error("Gagal menghapus kelas:", error);
    return false;
  }
}