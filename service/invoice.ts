import api from "./api";

export async function getBookingById(bookid: string) {
  const response = await api.get(`/booking/${bookid}`);
  return response.data;
}