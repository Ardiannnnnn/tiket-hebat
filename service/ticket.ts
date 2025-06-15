import api from "./api"
import { TicketResponse } from "../types/ticket";

export const getTickets = async (
  page: number = 1,
  limit: number = 10,
  search: string = ""
) => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      search: search.trim()
    });

    const response = await api.get<TicketResponse>(
      `/tickets?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch tickets:", error);
    throw error;
  }
};