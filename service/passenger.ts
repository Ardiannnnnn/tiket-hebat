import api from "./api";
import { TicketEntryPayload } from "@/types/passenger";

/**
 * Kirim data penumpang ke endpoint /claim/entry/{session_id}
 */
export const submitPassengerData = async (
  sessionId: string,
  payload: TicketEntryPayload
) => {
  try {
    const response = await api.post(`claim/entry/${sessionId}`, payload);
    console.log("Passenger entry response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to submit passenger data:", error);
    throw error;
  }
};
