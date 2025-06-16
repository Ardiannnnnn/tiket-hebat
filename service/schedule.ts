import exp from "constants";
import api from "./api";
import { Schedule, ScheduleResponse } from "@/types/schedule";

export const getSchedule = async (): Promise<ScheduleResponse | null> => {
  try {
    const response = await api.get<ScheduleResponse>("/schedules/active");
    console.log("response", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch ships:", error);
    const message = 
      error.response?.data?.message || "Gagal mengambil jadwal aktif ";
      throw new Error(message);
  } 
};

export const getSchedules = async (
  page: number = 1,
  limit: number = 20
): Promise<ScheduleResponse> => {
  try {
    const response = await api.get<ScheduleResponse>(
      `/schedules?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch schedules:", error);
    throw error;
  }
};

export const getScheduleById = async (
  id: string | number
): Promise<Schedule | null> => {
  try {
    const response = await api.get<Schedule>(`/schedule/${id}`);
    console.log("Schedule by ID response", response.data);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch schedule with id ${id}:`, error);
    return null;
  }
};  