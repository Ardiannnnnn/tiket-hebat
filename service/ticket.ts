import api from "./api"
import { TicketResponse } from "../types/ticket";

export const getTickets = async (): Promise<TicketResponse> => {
  try {
    const response = await api.get("/tickets");
    return response.data;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }
};