import api from "./api";
import { TicketResponse } from "../types/ticket";

export const getTickets = async (
  scheduleId: number,
  page: number = 1,
  limit: number = 100
): Promise<TicketResponse> => {
  try {
    const response = await api.get<TicketResponse>(
      `/ticket/schedule/${scheduleId}?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch tickets:", error);
    throw error;
  }
};
