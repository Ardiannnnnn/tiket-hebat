import api from "./api";
import { TicketResponse } from "../types/ticket";

export const getTickets = async (scheduleId: number): Promise<TicketResponse> => {
  try {
    const response = await api.get<TicketResponse>(`/ticket/schedule/${scheduleId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch tickets:", error);
    throw error;
  }
};