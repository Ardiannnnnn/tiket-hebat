import api from "./api";
import { LockTicketPayload } from "@/types/lock";
import { SessionResponse } from "@/types/session"; 

export const lockTickets = async (payload: LockTicketPayload) => {
  try {
    const response = await api.post("/session/ticket/lock", payload);
    console.log("Lock response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to lock tickets:", error);
    throw error;
  }
};


export const getSessionById = async (sessionId: string): Promise<SessionResponse | null> => {
  try {
    const response = await api.get<SessionResponse>(`/session/uuid/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error("Gagal mengambil data session:", error);
    return null;
  }
};

export async function cancelSession(sessionId: string) {
  return await fetch(`/api/session/${sessionId}`, {
    method: "DELETE",
  });
}