import api, { Baseapi } from "./api";
import {
  TicketResponse,
  TicketForm,
  SingleTicketResponse,
} from "../types/ticket";

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

export const checkInTicket = async (
  ticketId: number
): Promise<SingleTicketResponse> => {
  try {
    console.log(`🔄 Checking in ticket ID: ${ticketId}`);

    const response = await Baseapi.patch<SingleTicketResponse>(
      `/ticket/check-in/${ticketId}`
    );

    // ✅ Log response safely without accessing nested properties
    console.log(`✅ Check-in response for ticket ${ticketId}:`, response.data);

    // ✅ Remove problematic line that causes error
    // console.log(`✅ Updated is_checked_in:`, response.data.data.is_checked_in);

    return response.data;
  } catch (error) {
    console.error(`❌ Failed to check-in ticket ${ticketId}:`, error);
    throw error;
  }
};
export const getTicketById = async (
  ticketId: number
): Promise<SingleTicketResponse> => {
  try {
    const response = await api.get<SingleTicketResponse>(`/ticket/${ticketId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch ticket:", error);
    throw error;
  }
};

export const createTicket = async (
  formData: TicketForm
): Promise<TicketResponse> => {
  try {
    const response = await Baseapi.post<TicketResponse>(
      `/ticket/create`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create ticket:", error);
    throw error;
  }
};
