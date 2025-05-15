import exp from "constants";
import api from "./api";
import { Schedule, ScheduleResponse } from "@/types/schedule";

export const getSchedule = async (): Promise<ScheduleResponse | null> => {
  try {
    const response = await api.get<ScheduleResponse>("/schedules");
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch ships:", error);
    return null; // Return null or handle the error appropriately
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