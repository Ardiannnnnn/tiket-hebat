import api from "./api";
import { BookingResponse } from "@/types/invoice"; // Pastikan path sesuai

export const getBookingById = async (orderId: string): Promise<BookingResponse> => {
  const response = await api.get(`/booking/order/${orderId}`);
  return response.data;
};