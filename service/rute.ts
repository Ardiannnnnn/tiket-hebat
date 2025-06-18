import api, { Baseapi } from "./api";
import { RouteResponse } from "@/types/rute"; // atau sesuaikan path-nya

export const getRute = async (page = 1, limit = 20) : Promise<RouteResponse | null> => {
  try {
    const response = await api.get("/routes/?page=1&limit=5&sort=created_at:asc&search=");
    return response.data;
  } catch (error) {
    console.error("Gagal mengambil data kelas:", error);
    throw error;
  }
}

export const createRute = async (data:any): Promise<boolean> => {
  try{
    const response = await Baseapi.post("/route/create", data);
    return response.data
  } catch(error){
    console.log("gagal membuat rute", error)
    return false
  }
}

export const deleteRute= async (id: number): Promise<boolean> => {
  try {
    await api.delete(`/routes/${id}`);
    return true;
  } catch (error) {
    console.error("Gagal menghapus kelas:", error);
    return false;
  }
}