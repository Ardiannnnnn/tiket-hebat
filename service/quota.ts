import api from "./api";
import { ClassAvailability } from "@/types/classAvailability"; // atau sesuaikan path-nya
import { AxiosResponse } from "axios";

export interface QuotaResponse {
  data: {
    classes_availability: ClassAvailability[];
  };
}

export const getQuotaByScheduleId = async (
  scheduleId: string | number
): Promise<ClassAvailability[]> => {
  try {
    const res: AxiosResponse<QuotaResponse> = await api.get(`/schedule/${scheduleId}/quota`);
    return res.data.data.classes_availability || [];
  } catch (error) {
    console.error("Gagal mengambil data kuota:", error);
    throw error;
  }
};
