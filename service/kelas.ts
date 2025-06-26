import api, { Baseapi } from "./api";
import { kelasResponse } from "@/types/kelas"; // atau sesuaikan path-nya

export const getKelas = async (page = 1, limit = 20) : Promise<kelasResponse | null> => {
  try {
    const response = await api.get("/classes");
    return response.data;
  } catch (error) {
    console.error("Gagal mengambil data kelas:", error);
    throw error;
  }
}

export const createKelas = async (data: any): Promise<boolean> => {
  try {
    const response = await Baseapi.post("/class/create", data);
    return response.status === 201 || response.status === 200;
  } catch (error) {
    console.error("Error creating kelas:", error);
    return false;
  }
}

export const deleteKelas = async (id: number): Promise<boolean> => {
  try {
    await api.delete(`/classes/${id}`);
    return true;
  } catch (error) {
    console.error("Gagal menghapus kelas:", error);
    return false;
  }
}