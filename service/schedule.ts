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