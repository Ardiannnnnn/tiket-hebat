import exp from "constants";
import api, { Baseapi } from "./api";
import { Schedule, ScheduleResponse } from "@/types/schedule";

interface CreateJadwalPayload {
  ship_id: number;
  departure_harbor_id: number;
  arrival_harbor_id: number;
  departure_datetime: string;
  arrival_datetime: string;
  status: string;
}

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

export const getScheduleAll = async (page = 1, limit = 20) : Promise<ScheduleResponse | null> => {
  try {
    const response = await api.get("/schedules/active");
    return response.data;
  } catch (error) {
    console.error("Gagal mengambil data harga:", error);
    throw error;
  }
}

export const createSchedule = async (payload: CreateJadwalPayload): Promise<boolean> => {
  try {
    const response = await Baseapi.post("/schedule/create", payload);
    return response.status === 201 || response.status === 200;
  } catch (error) {
    console.error("Error creating harga:", error);
    return false;
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

export const deleteSchedule = async (
  id: string | number
  ): Promise<boolean> => {
              try {
    const response = await Baseapi.delete(`/schedule/${id}`);
    return response.status === 200;
  } catch (error) {
    console.error(`Error deleting schedule with id ${id}:`, error);
    return false;
  }

}